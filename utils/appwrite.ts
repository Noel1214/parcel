import { Client, Databases } from 'node-appwrite';

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    databases: new Databases(client),
  };
}

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
export const PARCELS_COLLECTION_ID = process.env.APPWRITE_PARCELS_COLLECTION_ID!;
