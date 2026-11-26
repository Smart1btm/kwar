// K_War shared types — derived from Model Data document v2.4

export type DeviceRole = 'hp_manager' | 'tablet_cashier';
export type MemberRole = 'owner' | 'trusted_family' | 'regular_staff';
export type DrawerAccess = 'shared_only' | 'individual_only' | 'both_flexible';
export type DrawerType = 'shared' | 'individual' | 'reserve';
export type SessionStatus = 'open' | 'closed';
export type ProductKind = 'regular' | 'bulk' | 'refill' | 'consignment' | 'open_price';
export type PaymentType = 'cash_full' | 'debt_full' | 'split_cash_debt' | 'qris_static' | 'personal_use';
export type TransactionStatus = 'completed' | 'voided' | 'returned';
export type ReviewStatus = 'none' | 'open' | 'reviewed';
export type ApprovalType = 'DEBT_OVERLIMIT' | 'DAMAGED_STOCK' | 'PERSONAL_USE' | 'VOID_LATE';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type CashMovementKind =
  | 'opening' | 'sale_cash' | 'debt_payment' | 'purchase_payment'
  | 'consignment_payment' | 'void_refund' | 'adjustment'
  | 'transfer_out' | 'transfer_in';
export type StockReason =
  | 'sale' | 'void_return' | 'purchase_receive' | 'purchase_reverse'
  | 'consignment_in' | 'consignment_return' | 'damaged' | 'expired'
  | 'personal_use' | 'opname';
export type DebtLedgerKind = 'sale_debt' | 'payment' | 'void_reversal' | 'adjustment';
export type PurchaseInvoiceStatus = 'pending_confirmation' | 'confirmed' | 'rejected';
export type CashTransferStatus = 'pending' | 'confirmed' | 'rejected';
export type SyncRejectionStatus = 'open' | 'resolved' | 'discarded';
export type OutboxType =
  | 'transaction' | 'void' | 'return' | 'debt_payment'
  | 'drawer_session' | 'purchase_receipt' | 'stock_adjustment'
  | 'cash_transfer' | 'new_customer' | 'audit_log';
export type OutboxStatus = 'pending' | 'synced' | 'rejected';

export interface Device {
  id: string;
  device_code: string;
  device_name: string;
  device_role: DeviceRole;
  install_id: string;
  auth_user_id: string | null;
  secret_hash: string | null;
  is_active: boolean;
  registered_at: string;
  last_seen_at: string | null;
  revoked_at: string | null;
}

export interface Member {
  id: string;
  nickname: string;
  photo_r2_path: string | null;
  role: MemberRole;
  drawer_access: DrawerAccess;
  auth_user_id: string | null;
  approval_public_key: string | null;
  simple_mode: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CashDrawer {
  id: string;
  drawer_type: DrawerType;
  drawer_name: string;
  assigned_member_id: string | null;
  current_cash_balance: number;
  created_at: string;
}

export interface DrawerSession {
  id: string;
  drawer_id: string;
  member_id: string;
  device_id: string;
  opened_at: string;
  opening_balance: number;
  closed_at: string | null;
  closing_balance_system: number | null;
  closing_balance_actual: number | null;
  cash_denominations: Record<string, number> | null;
  difference_amount: number | null;
  is_difference_reviewed: boolean;
  status: SessionStatus;
  expected_opening: number | null;
  declared_counts: {
    transactions: number;
    debt_payments: number;
    purchases: number;
    transfers: number;
  } | null;
  is_complete: boolean;
  review_flags: string[];
  force_closed_by_member_id: string | null;
}

export interface Product {
  id: string;
  barcode: string | null;
  box_barcode: string | null;
  name: string;
  category: string | null;
  unit: string;
  product_kind: ProductKind;
  consignor_id: string | null;
  cost_price_hpp: number;
  selling_price: number;
  box_selling_price: number | null;
  box_conversion_qty: number | null;
  bundle_qty: number | null;
  bundle_price: number | null;
  stock_qty: number;
  empty_stock_qty: number;
  min_stock_alert: number;
  critical_stock_alert: number;
  track_expiry: boolean;
  is_change_item: boolean;
  last_opname_at: string | null;
  favorite_order: number | null;
  nearest_expiry: string | null;
  has_price_hike_indicator: boolean;
  image_r2_path: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  credit_limit: number;
  created_by_member_id: string | null;
  current_debt: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  device_id: string;
  member_id: string;
  drawer_id: string;
  session_id: string;
  customer_id: string | null;
  invoice_no: string;
  subtotal: number;
  rounding_adj: number;
  total_final: number;
  payment_type: PaymentType;
  cash_tendered: number;
  cash_change: number;
  debt_amount: number;
  qris_confirmed_at: string | null;
  approval_request_id: string | null;
  review_flags: string[];
  review_status: ReviewStatus;
  reviewed_by_member_id: string | null;
  reviewed_at: string | null;
  status: TransactionStatus;
  void_reason: string | null;
  voided_at: string | null;
  voided_by_member_id: string | null;
  void_approval_request_id: string | null;
  created_at: string;
  synced_at: string | null;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  custom_name: string | null;
  qty: number;
  selling_price_unit: number;
  cost_price_unit: number;
  is_box_sale: boolean;
  exchange_empty: boolean;
  subtotal: number;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  store_address: string | null;
  store_phone: string | null;
  timezone: string;
  qris_image_r2_url: string | null;
  receipt_footer_text: string;
  ai_features_enabled: boolean;
  voice_order_enabled: boolean;
  smart_insight_enabled: boolean;
  allow_remote_approval: boolean;
  expiry_alert_days: number;
  rounding_unit: number;
  local_retention_days: number;
  shift_max_hours: number;
  void_alert_per_shift: number;
  cash_diff_alert_amount: number;
  price_hike_alert_pct: number;
  confirm_change_over: number;
  confirm_qty_over: number;
  confirm_price_over: number;
  confirm_total_over: number;
  help_phone: string | null;
  updated_at: string;
}

export interface QrApprovalRequest {
  id: string;
  device_id: string;
  requested_by_member_id: string;
  request_type: ApprovalType;
  qr_token: string;
  payload: Record<string, unknown>;
  payload_hash: string;
  status: ApprovalStatus;
  approved_by_member_id: string | null;
  proof: Record<string, unknown> | null;
  consumed_at: string | null;
  consumed_ref: string | null;
  created_at: string;
  responded_at: string | null;
  expires_at: string;
}

// Local (Dexie) types — no HPP, no phone/address on tablet

export interface LocalProduct {
  id: string;
  barcode: string | null;
  box_barcode: string | null;
  name: string;
  category: string | null;
  unit: string;
  product_kind: ProductKind;
  selling_price: number;
  box_selling_price: number | null;
  box_conversion_qty: number | null;
  bundle_qty: number | null;
  bundle_price: number | null;
  stock_qty: number;
  empty_stock_qty: number;
  min_stock_alert: number;
  critical_stock_alert: number;
  track_expiry: boolean;
  is_change_item: boolean;
  favorite_order: number | null;
  nearest_expiry: string | null;
  image_r2_path: string | null;
  deleted_at: string | null;
  updated_at: string;
}

export interface LocalCustomer {
  id: string;
  name: string;
  credit_limit: number;
  current_debt: number;
  deleted_at: string | null;
  updated_at: string;
}

export interface LocalMember {
  id: string;
  nickname: string;
  photo_r2_path: string | null;
  role: MemberRole;
  drawer_access: DrawerAccess;
  is_active: boolean;
}

export interface LocalCashDrawer {
  id: string;
  drawer_type: DrawerType;
  drawer_name: string;
  assigned_member_id: string | null;
}

export interface LocalCart {
  id: number;
  items: CartItem[];
  updatedAt: string;
}

export interface CartItem {
  product_id: string;
  custom_name: string | null;
  qty: number;
  selling_price_unit: number;
  is_box_sale: boolean;
  exchange_empty: boolean;
  subtotal: number;
}

export interface LocalTransaction {
  id: string;
  device_id: string;
  member_id: string;
  drawer_id: string;
  session_id: string;
  customer_id: string | null;
  invoice_no: string;
  subtotal: number;
  rounding_adj: number;
  total_final: number;
  payment_type: PaymentType;
  cash_tendered: number;
  cash_change: number;
  debt_amount: number;
  qris_confirmed_at: string | null;
  approval_request_id: string | null;
  status: TransactionStatus;
  void_reason: string | null;
  voided_at: string | null;
  voided_by_member_id: string | null;
  void_approval_request_id: string | null;
  created_at: string;
  is_synced: 0 | 1;
  synced_at: string | null;
  items: TransactionItem[];
}

export interface OutboxItem {
  id: string;
  type: OutboxType;
  createdAt: string;
  status: OutboxStatus;
  payload: Record<string, unknown>;
}

export interface LocalDrawerSession {
  id: string;
  drawer_id: string;
  member_id: string;
  device_id: string;
  opened_at: string;
  opening_balance: number;
  closed_at: string | null;
  closing_balance_actual: number | null;
  cash_denominations: Record<string, number> | null;
  declared_counts: {
    transactions: number;
    debt_payments: number;
    purchases: number;
    transfers: number;
  } | null;
  status: SessionStatus;
  is_synced: 0 | 1;
  synced_at: string | null;
}

export interface LocalSetting {
  key: string;
  value: string | number | boolean;
}

export interface PullLedgerResponse {
  server_timestamp: string;
  products_updated: LocalProduct[];
  customers_updated: LocalCustomer[];
  members_updated: LocalMember[];
  drawers_updated: LocalCashDrawer[];
  store_settings: Partial<StoreSettings>;
  member_public_keys: { member_id: string; public_key: string }[];
}

export interface PushBundleResponse {
  status: 'success' | 'partial';
  server_timestamp: string;
  accepted_ids: string[];
  flagged: { type: string; id: string; flags: string[] }[];
  rejected: { type: string; id: string; code: string; message: string }[];
}
