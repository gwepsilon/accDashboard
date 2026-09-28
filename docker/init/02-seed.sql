INSERT INTO deliveries (label, internal_name) VALUES
  ('Spring Promo Blast', 'spring_promo_blast_2026'),
  ('Onboarding Day 1', 'onboarding_d1_welcome'),
  ('Cart Abandonment', 'cart_abandon_72h'),
  ('VIP Re-engagement', 'vip_reengage_q3'),
  ('Product Launch Wave', 'product_launch_wave_a');

-- Spring Promo Blast
INSERT INTO broad_log_rcp (delivery_id, recipient_key, status) VALUES
  (1, 'rcp-1001', 'Sent'),
  (1, 'rcp-1002', 'Sent'),
  (1, 'rcp-1003', 'Failed'),
  (1, 'rcp-1004', 'Ignored'),
  (1, 'rcp-1005', 'Transmitted'),
  (1, 'rcp-1006', 'Prepared'),
  (1, 'rcp-1007', 'Sent'),
  (1, 'rcp-1008', 'Failed');

-- Onboarding Day 1
INSERT INTO broad_log_rcp (delivery_id, recipient_key, status) VALUES
  (2, 'rcp-2001', 'Prepared'),
  (2, 'rcp-2002', 'Prepared'),
  (2, 'rcp-2003', 'Sent'),
  (2, 'rcp-2004', 'Sent'),
  (2, 'rcp-2005', 'Transmitted'),
  (2, 'rcp-2006', 'Ignored');

-- Cart Abandonment
INSERT INTO broad_log_rcp (delivery_id, recipient_key, status) VALUES
  (3, 'rcp-3001', 'Failed'),
  (3, 'rcp-3002', 'Failed'),
  (3, 'rcp-3003', 'Sent'),
  (3, 'rcp-3004', 'Ignored'),
  (3, 'rcp-3005', 'Ignored'),
  (3, 'rcp-3006', 'Prepared'),
  (3, 'rcp-3007', 'Transmitted');

-- VIP Re-engagement
INSERT INTO broad_log_rcp (delivery_id, recipient_key, status) VALUES
  (4, 'rcp-4001', 'Transmitted'),
  (4, 'rcp-4002', 'Transmitted'),
  (4, 'rcp-4003', 'Sent'),
  (4, 'rcp-4004', 'Prepared');

-- Product Launch Wave
INSERT INTO broad_log_rcp (delivery_id, recipient_key, status) VALUES
  (5, 'rcp-5001', 'Ignored'),
  (5, 'rcp-5002', 'Prepared'),
  (5, 'rcp-5003', 'Prepared'),
  (5, 'rcp-5004', 'Failed'),
  (5, 'rcp-5005', 'Sent'),
  (5, 'rcp-5006', 'Sent'),
  (5, 'rcp-5007', 'Sent'),
  (5, 'rcp-5008', 'Transmitted'),
  (5, 'rcp-5009', 'Transmitted');
