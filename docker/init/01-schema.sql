-- ACC-style broadLogRcp disposition model
CREATE TYPE disposition_status AS ENUM (
  'Ignored',
  'Sent',
  'Failed',
  'Prepared',
  'Transmitted'
);

CREATE TABLE deliveries (
  id SERIAL PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  internal_name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE broad_log_rcp (
  id BIGSERIAL PRIMARY KEY,
  delivery_id INTEGER NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  recipient_key VARCHAR(255) NOT NULL,
  status disposition_status NOT NULL DEFAULT 'Prepared',
  event_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT broad_log_rcp_delivery_recipient_unique UNIQUE (delivery_id, recipient_key)
);

CREATE INDEX idx_broad_log_rcp_delivery_status ON broad_log_rcp (delivery_id, status);
CREATE INDEX idx_broad_log_rcp_status ON broad_log_rcp (status);
