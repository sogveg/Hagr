-- Booking message thread: all communication tied to a booking
CREATE TABLE booking_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender      text NOT NULL CHECK (sender IN ('admin', 'customer')),
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX booking_messages_booking_id_idx ON booking_messages(booking_id, created_at);

-- RLS
ALTER TABLE booking_messages ENABLE ROW LEVEL SECURITY;

-- Customers can read messages for their own bookings
CREATE POLICY "customers_read_own_messages" ON booking_messages
  FOR SELECT USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN customers c ON c.id = b.customer_id
      WHERE c.user_id = auth.uid()
    )
  );

-- Service role (admin) bypasses RLS — no extra policy needed
