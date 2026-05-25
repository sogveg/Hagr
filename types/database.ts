// Erstatt denne filen med auto-genererte typer etter Supabase-tilkobling:
// npx supabase gen types typescript --project-id DIN_PROJECT_ID > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type BookingStatus =
  | 'draft' | 'pending_payment' | 'payment_failed' | 'confirmed'
  | 'agreement_pending' | 'agreement_signed' | 'preparation_pending'
  | 'prepared' | 'ready_for_handover' | 'delivered' | 'active_rental'
  | 'return_due' | 'returned' | 'inspection_pending' | 'completed'
  | 'cancelled' | 'overdue' | 'disputed'

export type InventoryStatus =
  | 'available' | 'reserved' | 'prepared' | 'delivered' | 'active_rental'
  | 'return_due' | 'returned' | 'cleaning' | 'maintenance' | 'damaged' | 'retired' | 'lost'

type R = { foreignKeyName: string; columns: string[]; isOneToOne?: boolean; referencedRelation: string; referencedColumns: string[] }

export type Database = {
  public: {
    Tables: {
      locations: {
        Row: { id: string; name: string; slug: string; country: string; active: boolean; created_at: string }
        Insert: { id?: string; name: string; slug: string; country?: string; active?: boolean; created_at?: string }
        Update: { id?: string; name?: string; slug?: string; country?: string; active?: boolean }
        Relationships: R[]
      }
      categories: {
        Row: { id: string; name: string; slug: string; description: string | null; image_url: string | null; active: boolean; sort_order: number; created_at: string }
        Insert: { id?: string; name: string; slug: string; description?: string | null; image_url?: string | null; active?: boolean; sort_order?: number }
        Update: { name?: string; slug?: string; description?: string | null; image_url?: string | null; active?: boolean; sort_order?: number }
        Relationships: R[]
      }
      products: {
        Row: { id: string; category_id: string | null; name: string; slug: string; brand: string | null; model: string | null; description: string | null; short_description: string | null; price_day: number | null; price_week: number | null; price_month: number | null; deposit_amount: number; minimum_rental_days: number; published: boolean; seo_title: string | null; seo_description: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; category_id?: string | null; name: string; slug: string; brand?: string | null; model?: string | null; description?: string | null; short_description?: string | null; price_day?: number | null; price_week?: number | null; price_month?: number | null; deposit_amount?: number; minimum_rental_days?: number; published?: boolean; seo_title?: string | null; seo_description?: string | null }
        Update: { category_id?: string | null; name?: string; slug?: string; brand?: string | null; model?: string | null; description?: string | null; short_description?: string | null; price_day?: number | null; price_week?: number | null; price_month?: number | null; deposit_amount?: number; minimum_rental_days?: number; published?: boolean; seo_title?: string | null; seo_description?: string | null; updated_at?: string }
        Relationships: R[]
      }
      product_locations: {
        Row: { product_id: string; location_id: string }
        Insert: { product_id: string; location_id: string }
        Update: { product_id?: string; location_id?: string }
        Relationships: R[]
      }
      inventory_items: {
        Row: { id: string; product_id: string | null; location_id: string | null; internal_name: string; serial_number: string | null; purchase_price: number | null; purchase_date: string | null; condition: string; status: InventoryStatus; notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; product_id?: string | null; location_id?: string | null; internal_name: string; serial_number?: string | null; purchase_price?: number | null; purchase_date?: string | null; condition?: string; status?: InventoryStatus; notes?: string | null }
        Update: { product_id?: string | null; location_id?: string | null; internal_name?: string; serial_number?: string | null; purchase_price?: number | null; purchase_date?: string | null; condition?: string; status?: InventoryStatus; notes?: string | null; updated_at?: string }
        Relationships: R[]
      }
      customers: {
        Row: { id: string; user_id: string | null; first_name: string | null; last_name: string | null; email: string; phone: string | null; address_line1: string | null; address_line2: string | null; postal_code: string | null; city: string | null; country: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id?: string | null; first_name?: string | null; last_name?: string | null; email: string; phone?: string | null; address_line1?: string | null; address_line2?: string | null; postal_code?: string | null; city?: string | null; country?: string }
        Update: { user_id?: string | null; first_name?: string | null; last_name?: string | null; email?: string; phone?: string | null; address_line1?: string | null; address_line2?: string | null; postal_code?: string | null; city?: string | null; country?: string; updated_at?: string }
        Relationships: R[]
      }
      staff_profiles: {
        Row: { id: string; user_id: string | null; role: string; name: string | null; active: boolean; created_at: string }
        Insert: { id?: string; user_id?: string | null; role?: string; name?: string | null; active?: boolean }
        Update: { user_id?: string | null; role?: string; name?: string | null; active?: boolean }
        Relationships: R[]
      }
      bookings: {
        Row: { id: string; customer_id: string | null; location_id: string | null; status: BookingStatus; start_date: string; end_date: string; rental_amount: number; deposit_amount: number; delivery_fee: number; pickup_fee: number; total_amount: number; currency: string; stripe_checkout_session_id: string | null; stripe_payment_intent_id: string | null; notes: string | null; internal_notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; customer_id?: string | null; location_id?: string | null; status?: BookingStatus; start_date: string; end_date: string; rental_amount?: number; deposit_amount?: number; delivery_fee?: number; pickup_fee?: number; total_amount?: number; currency?: string; stripe_checkout_session_id?: string | null; stripe_payment_intent_id?: string | null; notes?: string | null; internal_notes?: string | null }
        Update: { customer_id?: string | null; location_id?: string | null; status?: BookingStatus; start_date?: string; end_date?: string; rental_amount?: number; deposit_amount?: number; delivery_fee?: number; pickup_fee?: number; total_amount?: number; currency?: string; stripe_checkout_session_id?: string | null; stripe_payment_intent_id?: string | null; notes?: string | null; internal_notes?: string | null; updated_at?: string }
        Relationships: R[]
      }
      booking_items: {
        Row: { id: string; booking_id: string | null; product_id: string | null; inventory_item_id: string | null; quantity: number; unit_price: number; price_type: string; created_at: string }
        Insert: { id?: string; booking_id?: string | null; product_id?: string | null; inventory_item_id?: string | null; quantity?: number; unit_price?: number; price_type?: string }
        Update: { booking_id?: string | null; product_id?: string | null; inventory_item_id?: string | null; quantity?: number; unit_price?: number; price_type?: string }
        Relationships: R[]
      }
      payments: {
        Row: { id: string; booking_id: string | null; stripe_payment_intent_id: string | null; amount: number; currency: string; status: string; payment_type: string; created_at: string }
        Insert: { id?: string; booking_id?: string | null; stripe_payment_intent_id?: string | null; amount: number; currency?: string; status?: string; payment_type?: string }
        Update: { booking_id?: string | null; stripe_payment_intent_id?: string | null; amount?: number; currency?: string; status?: string; payment_type?: string }
        Relationships: R[]
      }
      deposits: {
        Row: { id: string; booking_id: string | null; amount: number; status: string; stripe_payment_intent_id: string | null; amount_refunded: number; amount_withheld: number; reason: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; booking_id?: string | null; amount: number; status?: string; stripe_payment_intent_id?: string | null; amount_refunded?: number; amount_withheld?: number; reason?: string | null }
        Update: { booking_id?: string | null; amount?: number; status?: string; stripe_payment_intent_id?: string | null; amount_refunded?: number; amount_withheld?: number; reason?: string | null; updated_at?: string }
        Relationships: R[]
      }
      rental_agreements: {
        Row: { id: string; booking_id: string | null; version: string; status: string; signed_by_customer_at: string | null; signed_by_staff_at: string | null; customer_signature_ip: string | null; customer_signature_user_agent: string | null; pdf_url: string | null; created_at: string }
        Insert: { id?: string; booking_id?: string | null; version?: string; status?: string; signed_by_customer_at?: string | null; signed_by_staff_at?: string | null; customer_signature_ip?: string | null; customer_signature_user_agent?: string | null; pdf_url?: string | null }
        Update: { booking_id?: string | null; version?: string; status?: string; signed_by_customer_at?: string | null; signed_by_staff_at?: string | null; customer_signature_ip?: string | null; customer_signature_user_agent?: string | null; pdf_url?: string | null }
        Relationships: R[]
      }
      condition_reports: {
        Row: { id: string; booking_id: string | null; inventory_item_id: string | null; created_by: string | null; report_type: string; status: string; condition_summary: string | null; customer_signature_url: string | null; staff_signature_url: string | null; customer_signed_at: string | null; staff_signed_at: string | null; pdf_url: string | null; created_at: string }
        Insert: { id?: string; booking_id?: string | null; inventory_item_id?: string | null; created_by?: string | null; report_type: string; status?: string; condition_summary?: string | null; customer_signature_url?: string | null; staff_signature_url?: string | null; customer_signed_at?: string | null; staff_signed_at?: string | null; pdf_url?: string | null }
        Update: { booking_id?: string | null; inventory_item_id?: string | null; created_by?: string | null; report_type?: string; status?: string; condition_summary?: string | null; customer_signature_url?: string | null; staff_signature_url?: string | null; customer_signed_at?: string | null; staff_signed_at?: string | null; pdf_url?: string | null }
        Relationships: R[]
      }
      condition_report_checklist_items: {
        Row: { id: string; condition_report_id: string | null; label: string; status: string; notes: string | null; created_at: string }
        Insert: { id?: string; condition_report_id?: string | null; label: string; status: string; notes?: string | null }
        Update: { condition_report_id?: string | null; label?: string; status?: string; notes?: string | null }
        Relationships: R[]
      }
      condition_report_photos: {
        Row: { id: string; condition_report_id: string | null; photo_url: string; caption: string | null; created_at: string }
        Insert: { id?: string; condition_report_id?: string | null; photo_url: string; caption?: string | null }
        Update: { condition_report_id?: string | null; photo_url?: string; caption?: string | null }
        Relationships: R[]
      }
      damage_reports: {
        Row: { id: string; booking_id: string | null; inventory_item_id: string | null; created_by: string | null; description: string; severity: string | null; estimated_cost: number | null; deposit_withheld: number; status: string; created_at: string }
        Insert: { id?: string; booking_id?: string | null; inventory_item_id?: string | null; created_by?: string | null; description: string; severity?: string | null; estimated_cost?: number | null; deposit_withheld?: number; status?: string }
        Update: { booking_id?: string | null; inventory_item_id?: string | null; created_by?: string | null; description?: string; severity?: string | null; estimated_cost?: number | null; deposit_withheld?: number; status?: string }
        Relationships: R[]
      }
      maintenance_logs: {
        Row: { id: string; inventory_item_id: string | null; type: string | null; description: string | null; cost: number | null; performed_at: string; created_by: string | null }
        Insert: { id?: string; inventory_item_id?: string | null; type?: string | null; description?: string | null; cost?: number | null; performed_at?: string; created_by?: string | null }
        Update: { inventory_item_id?: string | null; type?: string | null; description?: string | null; cost?: number | null; performed_at?: string; created_by?: string | null }
        Relationships: R[]
      }
      delivery_orders: {
        Row: { id: string; booking_id: string | null; type: string; status: string; scheduled_date: string | null; scheduled_time_window: string | null; address: string | null; city: string | null; postal_code: string | null; notes: string | null; assigned_to: string | null; created_at: string }
        Insert: { id?: string; booking_id?: string | null; type?: string; status?: string; scheduled_date?: string | null; scheduled_time_window?: string | null; address?: string | null; city?: string | null; postal_code?: string | null; notes?: string | null; assigned_to?: string | null }
        Update: { booking_id?: string | null; type?: string; status?: string; scheduled_date?: string | null; scheduled_time_window?: string | null; address?: string | null; city?: string | null; postal_code?: string | null; notes?: string | null; assigned_to?: string | null }
        Relationships: R[]
      }
      notifications: {
        Row: { id: string; booking_id: string | null; customer_id: string | null; channel: string; type: string; status: string; sent_at: string | null; created_at: string }
        Insert: { id?: string; booking_id?: string | null; customer_id?: string | null; channel: string; type: string; status?: string; sent_at?: string | null }
        Update: { booking_id?: string | null; customer_id?: string | null; channel?: string; type?: string; status?: string; sent_at?: string | null }
        Relationships: R[]
      }
      reviews: {
        Row: { id: string; booking_id: string | null; customer_id: string | null; product_id: string | null; rating: number | null; comment: string | null; published: boolean; created_at: string }
        Insert: { id?: string; booking_id?: string | null; customer_id?: string | null; product_id?: string | null; rating?: number | null; comment?: string | null; published?: boolean }
        Update: { booking_id?: string | null; customer_id?: string | null; product_id?: string | null; rating?: number | null; comment?: string | null; published?: boolean }
        Relationships: R[]
      }
      discount_codes: {
        Row: { id: string; code: string; type: string; value: number; max_uses: number | null; used_count: number; expires_at: string | null; active: boolean; created_at: string }
        Insert: { id?: string; code: string; type?: string; value: number; max_uses?: number | null; used_count?: number; expires_at?: string | null; active?: boolean }
        Update: { code?: string; type?: string; value?: number; max_uses?: number | null; used_count?: number; expires_at?: string | null; active?: boolean }
        Relationships: R[]
      }
      stripe_events: {
        Row: { id: string; type: string; processed_at: string }
        Insert: { id: string; type: string; processed_at?: string }
        Update: { type?: string; processed_at?: string }
        Relationships: R[]
      }
      audit_logs: {
        Row: { id: string; actor_id: string | null; entity_type: string; entity_id: string | null; action: string; metadata: Json | null; created_at: string }
        Insert: { id?: string; actor_id?: string | null; entity_type: string; entity_id?: string | null; action: string; metadata?: Json | null }
        Update: { actor_id?: string | null; entity_type?: string; entity_id?: string | null; action?: string; metadata?: Json | null }
        Relationships: R[]
      }
    }
    Views: Record<string, never>
    Functions: {
      reserve_inventory_item: {
        Args: { p_product_id: string; p_location_id: string; p_start_date: string; p_end_date: string; p_booking_id: string }
        Returns: string | null
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
