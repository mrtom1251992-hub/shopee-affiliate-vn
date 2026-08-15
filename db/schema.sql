-- ============================================================
-- CLOUDFLARE D1 SQL DATABASE SCHEMA FOR SHOPEEAFFVN
-- ============================================================

-- 1. Lượt xem bài viết theo slug
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Bình luận bài viết
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  author TEXT NOT NULL,
  email TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 3. Email đăng ký Newsletter
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website_sidebar',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 4. Tracking Click Affiliate Link (Phân tích chuyển đổi & nguồn traffic)
CREATE TABLE IF NOT EXISTS click_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  affiliate_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  clicked_at TEXT DEFAULT (datetime('now'))
);

-- 5. Deal Hot / Mã Giảm Giá Shopee (Cập nhật realtime)
CREATE TABLE IF NOT EXISTS affiliate_deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  discount_rate TEXT NOT NULL,
  category TEXT NOT NULL,
  deal_url TEXT NOT NULL,
  coupon_code TEXT,
  expires_at TEXT,
  is_featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for high performance query
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON page_views(slug);
CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_click_tracks_slug ON click_tracks(slug);
