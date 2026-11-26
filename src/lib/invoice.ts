import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export async function nextInvoiceNo(deviceCode: string): Promise<string> {
  const ddmmyyyy = formatDate(new Date(), 'ddMMyyyy');
  const key = `invoice_seq:${ddmmyyyy}`;
  return db.transaction('rw', db.appSettings, async () => {
    const row = await db.appSettings.get(key);
    const seq = ((row?.value as number) ?? 0) + 1;
    await db.appSettings.put({ key, value: seq });
    return `kw/${String(seq).padStart(4, '0')}/${deviceCode}/${ddmmyyyy}`;
  });
}
