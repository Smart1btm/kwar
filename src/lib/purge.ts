import { db } from '@/lib/db';

export async function purgeOldSyncedTransactions(): Promise<void> {
  const row = await db.appSettings.get('local_retention_days');
  const days = (row?.value as number) ?? 3;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  await db.localTransactions
    .where('is_synced')
    .equals(1)
    .filter((tx) => tx.synced_at !== null && tx.synced_at < cutoff)
    .delete();
}

export async function getRetentionDays(): Promise<number> {
  const row = await db.appSettings.get('local_retention_days');
  return (row?.value as number) ?? 3;
}

export async function setRetentionDays(days: number): Promise<void> {
  await db.appSettings.put({ key: 'local_retention_days', value: days });
}
