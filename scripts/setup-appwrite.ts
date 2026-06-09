/**
 * Appwrite Setup Script
 *
 * Run once to create the database, collection, attributes, and indexes.
 * Usage: npm run setup
 *
 * Requires in .env.local:
 *   APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 *
 * After running, APPWRITE_DATABASE_ID and APPWRITE_PARCELS_COLLECTION_ID
 * will be written back to .env.local automatically.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { Client, Databases, DatabasesIndexType, ID, OrderBy, Permission, Role } from 'node-appwrite';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// ── helpers ──────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`  ${msg}`);
}
function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}
function warn(msg: string) {
  console.log(`  ⚠  ${msg}`);
}
function section(title: string) {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 50 - title.length))}`);
}
function fail(msg: string): never {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Read .env.local, update specific keys, write it back. */
function updateEnvFile(updates: Record<string, string>) {
  const path = '.env.local';
  const lines = existsSync(path) ? readFileSync(path, 'utf8').split('\n') : [];
  const result: string[] = [];
  const written = new Set<string>();

  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (match && updates[match[1]] !== undefined) {
      result.push(`${match[1]}=${updates[match[1]]}`);
      written.add(match[1]);
    } else {
      result.push(line);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!written.has(key)) {
      result.push(`${key}=${value}`);
    }
  }

  writeFileSync(path, result.join('\n'), 'utf8');
}

// ── validation ────────────────────────────────────────────────────────────────

const {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  APPWRITE_DATABASE_ID: ENV_DB_ID,
  APPWRITE_PARCELS_COLLECTION_ID: ENV_COL_ID,
} = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  fail(
    'Missing required env vars.\n\n' +
    '  Copy .env.local.example → .env.local and fill in:\n' +
    '    APPWRITE_ENDPOINT\n' +
    '    APPWRITE_PROJECT_ID\n' +
    '    APPWRITE_API_KEY\n'
  );
}

// ── client ────────────────────────────────────────────────────────────────────

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!);

const databases = new Databases(client);

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║         Parcel Manager — Appwrite Setup              ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`\n  Endpoint : ${APPWRITE_ENDPOINT}`);
  console.log(`  Project  : ${APPWRITE_PROJECT_ID}`);

  // ── 1. Database ─────────────────────────────────────────────────────────────
  section('Database');

  let databaseId = ENV_DB_ID || ID.unique();

  if (ENV_DB_ID) {
    try {
      await databases.get(ENV_DB_ID);
      ok(`Using existing database  [${ENV_DB_ID}]`);
    } catch {
      warn(`Database ID in .env.local not found, creating new one…`);
      databaseId = ID.unique();
      await databases.create(databaseId, 'Parcel Manager');
      ok(`Database created  [${databaseId}]`);
      updateEnvFile({ APPWRITE_DATABASE_ID: databaseId });
    }
  } else {
    log('No APPWRITE_DATABASE_ID found, creating database…');
    await databases.create(databaseId, 'Parcel Manager');
    ok(`Database created  [${databaseId}]`);
    updateEnvFile({ APPWRITE_DATABASE_ID: databaseId });
  }

  // ── 2. Collection ────────────────────────────────────────────────────────────
  section('Collection');

  let collectionId = ENV_COL_ID || ID.unique();

  if (ENV_COL_ID) {
    try {
      await databases.getCollection(databaseId, ENV_COL_ID);
      ok(`Using existing collection  [${ENV_COL_ID}]`);
      collectionId = ENV_COL_ID;
    } catch {
      warn('Collection ID in .env.local not found, creating new one…');
      collectionId = ID.unique();
      await createCollection(databaseId, collectionId);
    }
  } else {
    log('Creating collection "parcels"…');
    await createCollection(databaseId, collectionId);
    updateEnvFile({ APPWRITE_PARCELS_COLLECTION_ID: collectionId });
  }

  // ── 3. Attributes ────────────────────────────────────────────────────────────
  section('Attributes');
  log('Fetching existing attributes…');

  const existing = await databases.listAttributes(databaseId, collectionId);
  const existingKeys = new Set(existing.attributes.map((a: { key: string }) => a.key));

  const stringAttrs: Array<{ key: string; size: number; required: boolean; defaultVal?: string }> = [
    { key: 'parcel_code',            size: 255,  required: true  },
    { key: 'sender_name',            size: 255,  required: true  },
    { key: 'receiver_name',          size: 255,  required: true  },
    { key: 'receiver_contact',       size: 255,  required: true  },
    { key: 'parcel_office_name',     size: 255,  required: true  },
    { key: 'parcel_office_contact',  size: 255,  required: true  },
    { key: 'parcel_office_address',  size: 1000, required: true  },
    { key: 'status',                 size: 50,   required: true  },
    { key: 'weight',                 size: 50,   required: false },
    { key: 'description',            size: 500,  required: false },
    { key: 'notes',                  size: 1000, required: false },
  ];

  let created = 0;
  let skipped = 0;

  for (const attr of stringAttrs) {
    if (existingKeys.has(attr.key)) {
      skipped++;
      log(`skip  ${attr.key}  (already exists)`);
      continue;
    }

    try {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        attr.key,
        attr.size,
        attr.required,
        attr.defaultVal,
      );
      ok(`created  ${attr.key}`);
      created++;
      // brief pause to avoid hitting Appwrite rate limits
      await sleep(300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      warn(`Failed to create "${attr.key}": ${msg}`);
    }
  }

  if (created > 0) {
    log(`\n  Waiting for attributes to become active…`);
    await sleep(2000);
  }

  ok(`${created} attribute(s) created, ${skipped} skipped`);

  // ── 4. Index ─────────────────────────────────────────────────────────────────
  section('Indexes');

  const existingIndexes = await databases.listIndexes(databaseId, collectionId);
  const existingIndexKeys = new Set(existingIndexes.indexes.map((i: { key: string }) => i.key));

  if (!existingIndexKeys.has('parcel_code_key')) {
    try {
      await databases.createIndex(
        databaseId,
        collectionId,
        'parcel_code_key',
        DatabasesIndexType.Key,
        ['parcel_code'],
        [OrderBy.Asc],
      );
      ok('Index on parcel_code created');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      warn(`Index creation: ${msg}`);
    }
  } else {
    ok('Index on parcel_code already exists');
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Setup complete! Your .env.local has been updated.   ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log('  Next steps:');
  console.log('    1.  Run: npm run dev');
  console.log('    2.  Open http://localhost:3000\n');
}

async function createCollection(databaseId: string, collectionId: string) {
  await databases.createCollection(
    databaseId,
    collectionId,
    'Parcels',
    [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ],
  );
  ok(`Collection created  [${collectionId}]`);
  updateEnvFile({ APPWRITE_PARCELS_COLLECTION_ID: collectionId });
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  fail(`Unexpected error: ${msg}`);
});
