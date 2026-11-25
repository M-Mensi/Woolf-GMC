INSERT OR IGNORE INTO listings
  (id, title, category, total_portions, portions_remaining, neighborhood, pickup_at, notes, status)
VALUES
  ('demo-produce-001', 'Market day veg boxes', 'produce', 12, 12, 'North Market', '2027-01-15T17:30:00.000Z', 'Mixed seasonal vegetables. Bring a reusable bag.', 'available'),
  ('demo-bakery-001', 'End-of-day sourdough', 'bakery', 8, 8, 'Riverside', '2027-01-15T18:00:00.000Z', 'Contains wheat and may contain traces of sesame.', 'available'),
  ('demo-prepared-001', 'Garden soup portions', 'prepared', 6, 6, 'Old Town', '2027-01-15T16:45:00.000Z', 'Chilled vegetable soup. Keep refrigerated; ask provider about ingredients.', 'available'),
  ('demo-pantry-001', 'Community pantry bundle', 'pantry', 10, 10, 'East Park', '2027-01-16T15:00:00.000Z', 'Sealed dry goods with labels intact.', 'available');
