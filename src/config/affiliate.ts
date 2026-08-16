// ============================================================
// CENTRALIZED AFFILIATE CONFIGURATION
// ============================================================
// Tất cả các nút bấm, popup, bài viết trên website tĩnh đều trỏ về route "/go".
// Route "/go" (Cloudflare Pages Function) sẽ tự động bốc ngẫu nhiên 1 link
// đang kích hoạt (active = 1) từ Database Cloudflare D1 để chuyển hướng và đếm click.

export const AFFILIATE_REDIRECT_URL = "/go";
export const FALLBACK_SHOPEE_URL = "https://s.shopee.vn/4Vc2eObMTo";
