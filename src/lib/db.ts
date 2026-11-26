import Dexie, { type Table } from 'dexie';
import type {
  LocalProduct,
  LocalCustomer,
  LocalMember,
  LocalCashDrawer,
  LocalCart,
  LocalTransaction,
  OutboxItem,
  LocalDrawerSession,
  LocalSetting,
} from '@/types';

export class KWarDatabase extends Dexie {
  products!: Table<LocalProduct, string>;
  customers!: Table<LocalCustomer, string>;
  members!: Table<LocalMember, string>;
  cashDrawers!: Table<LocalCashDrawer, string>;
  activeCarts!: Table<LocalCart, number>;
  localTransactions!: Table<LocalTransaction, string>;
  outboxQueue!: Table<OutboxItem, string>;
  cashDrawerSession!: Table<LocalDrawerSession, string>;
  appSettings!: Table<LocalSetting, string>;

  constructor(name = 'KWarLocalDB') {
    super(name);
    this.version(1).stores({
      products: 'id, barcode, name, category, nearest_expiry, favorite_order',
      customers: 'id, name',
      cashDrawers: 'id, drawer_type',
      members: 'id, role',
      activeCarts: 'id, updatedAt',
      localTransactions: 'id, invoice_no, createdAt, is_synced, synced_at',
      outboxQueue: 'id, type, createdAt, status',
      cashDrawerSession: 'id, drawer_id, status',
      appSettings: 'key',
    });
  }
}

export const db = new KWarDatabase();

export const practiceDB = new KWarDatabase('KWarPracticeDB');

export function getDB(practice: boolean): KWarDatabase {
  return practice ? practiceDB : db;
}
