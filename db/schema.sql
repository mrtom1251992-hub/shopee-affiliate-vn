-- ============================================================
-- CLOUDFLARE D1 SQL DATABASE SCHEMA FOR SHOPEEAFFVN
-- ============================================================

-- 1. Bảng quản lý tập trung các đường link Shopee Affiliate
-- Thiết kế mở rộng sẵn sàng cho: Xoay tua Random, Phân nhóm ngành hàng,
-- Trọng số A/B Testing, Mã coupon, và trường mở rộng meta_json không giới hạn.
CREATE TABLE IF NOT EXISTS affiliate_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                          -- Tên gợi nhớ (VD: 'Storefront Mẹ Miền', 'Deal Đồ Gia Dụng')
  url TEXT NOT NULL UNIQUE,                    -- Đường dẫn đích affiliate
  category TEXT DEFAULT 'general',             -- Ngành hàng ('me-be', 'gia-dung', 'thoi-trang', 'general'...)
  platform TEXT DEFAULT 'shopee',              -- Nền tảng ('shopee', 'tiktok', 'lazada'...)
  weight INTEGER DEFAULT 1,                    -- Trọng số phân phối A/B testing (1, 2, 5, 10...)
  clicks INTEGER NOT NULL DEFAULT 0,           -- Bộ đếm lượt click thực tế
  conversions INTEGER DEFAULT 0,               -- Bộ đếm lượt mua/chuyển đổi (dự phòng tương lai)
  commission_rate REAL DEFAULT 0.0,            -- % Hoa hồng dự kiến (VD: 15.5)
  coupon_code TEXT,                            -- Mã giảm giá đính kèm (nếu có)
  notes TEXT,                                  -- Ghi chú nội bộ cho bạn
  meta_json TEXT,                              -- Dữ liệu JSON mở rộng vô hạn (custom fields sau này)
  active INTEGER NOT NULL DEFAULT 1,           -- 1 = Đang bật, 0 = Tạm tắt
  created_at TEXT DEFAULT (datetime('now')),   -- Thời gian tạo
  updated_at TEXT DEFAULT (datetime('now'))    -- Thời gian cập nhật cuối
);

-- 2. Tracking Click Affiliate Link (Phân tích chuyển đổi & nguồn traffic)
CREATE TABLE IF NOT EXISTS click_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  affiliate_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  clicked_at TEXT DEFAULT (datetime('now'))
);

-- 3. Lượt xem bài viết theo slug
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 4. Bình luận bài viết
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

-- 5. Email đăng ký Newsletter
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website_sidebar',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for high performance query
CREATE INDEX IF NOT EXISTS idx_affiliate_links_active ON affiliate_links(active);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_category ON affiliate_links(category);
CREATE INDEX IF NOT EXISTS idx_click_tracks_clicked_at ON click_tracks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON page_views(slug);
CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug);
