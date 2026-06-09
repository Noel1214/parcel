'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, DATABASE_ID, PARCELS_COLLECTION_ID } from '@/utils/appwrite';
import { revalidatePath } from 'next/cache';

export interface ParcelData {
  parcel_code: string;
  sender_name: string;
  receiver_name: string;
  receiver_contact: string;
  parcel_office_name: string;
  parcel_office_contact: string;
  parcel_office_address: string;
  status: string;
  weight: string;
  description: string;
  notes: string;
}

// Appwrite Documents have a custom prototype that can't cross the server→client
// boundary in Next.js. Serialising through JSON gives a plain object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function createParcel(data: ParcelData) {
  const { databases } = createAdminClient();
  const doc = await databases.createDocument(
    DATABASE_ID,
    PARCELS_COLLECTION_ID,
    ID.unique(),
    data
  );
  revalidatePath('/parcel-office/parcels');
  return plain(doc);
}

export async function getParcels() {
  const { databases } = createAdminClient();
  const result = await databases.listDocuments(DATABASE_ID, PARCELS_COLLECTION_ID, [
    Query.orderDesc('$createdAt'),
    Query.limit(100),
  ]);
  return plain(result.documents);
}

export async function getParcel(id: string) {
  const { databases } = createAdminClient();
  const doc = await databases.getDocument(DATABASE_ID, PARCELS_COLLECTION_ID, id);
  return plain(doc);
}

export async function updateParcel(id: string, data: Partial<ParcelData>) {
  const { databases } = createAdminClient();
  const doc = await databases.updateDocument(DATABASE_ID, PARCELS_COLLECTION_ID, id, data);
  revalidatePath('/parcel-office/parcels');
  return plain(doc);
}

export async function deleteParcel(id: string) {
  const { databases } = createAdminClient();
  await databases.deleteDocument(DATABASE_ID, PARCELS_COLLECTION_ID, id);
  revalidatePath('/parcel-office/parcels');
}

export async function searchParcelByCode(code: string) {
  const { databases } = createAdminClient();
  const result = await databases.listDocuments(DATABASE_ID, PARCELS_COLLECTION_ID, [
    Query.equal('parcel_code', code),
  ]);
  return result.documents[0] ? plain(result.documents[0]) : null;
}
