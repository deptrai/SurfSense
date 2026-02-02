# Epic 1: Trợ lý Crypto AI trên Trình duyệt

**Trạng thái:** ✅ ĐÃ HOÀN THÀNH  
**Giai đoạn:** Phase 1  
**Thời gian:** 2 tuần  
**Mức độ ưu tiên:** P0 (Nghiêm trọng)

---

## Tổng quan Epic

Mang AI co-pilot của SurfSense vào trình duyệt, cho phép users chat với AI, nhận insights về token, và lưu thông tin quan trọng ngay khi đang browse các trang crypto.

**Giá trị cho User:**
- **Chat với AI ngay trong browser** - Không cần chuyển tab, hỏi AI về bất kỳ token nào đang xem.
- **Tự động hiểu context** - AI biết bạn đang xem token gì trên DexScreener và đưa ra insights phù hợp.
- **Lưu thông tin nhanh** - Một cú click để lưu trang, token, insights vào knowledge base.
- **Đồng bộ mọi nơi** - Cài đặt và lịch sử chat được đồng bộ giữa extension và web dashboard.

---

## Các phụ thuộc kỹ thuật (Technical Dependencies)

Epic này phụ thuộc vào các API bên ngoài và backend services. Tất cả các integrations phải đáp ứng tiêu chí Định nghĩa hoàn thành (DoD) bên dưới.

### 1. DexScreener API Integration [FR-DAT-01]

**Mục đích:** Trích xuất dữ liệu token thời gian thực cho tính năng hỗ trợ AI nhận biết ngữ cảnh.

**API Endpoints:**
```typescript
// Public API (no auth required)
GET https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}
GET https://api.dexscreener.com/latest/dex/pairs/{chainId}/{pairAddress}
GET https://api.dexscreener.com/latest/dex/search?q={query}
```

**Giới hạn tốc độ (Rate Limits):**
- **Free Tier:** 300 requests/phút
- **Xử lý:** Implement exponential backoff với tối đa 3 lần thử lại (retries)
- **Caching:** Cache token data trong 30 giây để giảm lượng API calls

**Xử lý lỗi (Error Handling):**
```typescript
// Retry logic
async function fetchDexScreenerData(tokenAddress: string, retries = 3) {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    
    if (response.status === 429) {
      // Rate limit exceeded
      if (retries > 0) {
        await sleep(2 ** (3 - retries) * 1000); // Exponential backoff
        return fetchDexScreenerData(tokenAddress, retries - 1);
      }
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Show user-friendly error
    showToast('Failed to fetch token data. Please try again.', 'error');
    throw error;
  }
}
```

**Định nghĩa hoàn thành (DoD):**
- [ ] Rate limiting được implement với exponential backoff
- [ ] Xử lý lỗi với thông báo thân thiện cho user
- [ ] Caching layer để giảm API calls
- [ ] Logic thử lại (tối đa 3 lần)
- [ ] Xử lý Timeout (tối đa 5 giây)
- [ ] Hỗ trợ chế độ Offline (hiện data đã cache)
- [ ] Unit tests cho các kịch bản lỗi

---

### 2. DefiLlama API Integration [FR-DAT-02]

**Mục đích:** TVL, protocol data, và các chỉ số DeFi để phân tích token toàn diện.

**API Endpoints:**
```typescript
// Public API (no auth required)
GET https://api.llama.fi/protocol/{protocol}
GET https://api.llama.fi/tvl/{protocol}
GET https://api.llama.fi/charts/{protocol}
```

**Giới hạn tốc độ (Rate Limits):**
- **Free Tier:** Không giới hạn (nhưng khuyến nghị tối đa 60 requests/phút)
- **Xử lý:** Implement rate limiting ở phía client
- **Caching:** Cache protocol data trong 5 phút

**Error Handling:**
```typescript
async function fetchDefiLlamaData(protocol: string) {
  try {
    const response = await fetch(`https://api.llama.fi/protocol/${protocol}`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TimeoutError') {
      showToast('Request timed out. Please try again.', 'error');
    } else {
      showToast('Failed to fetch protocol data.', 'error');
    }
    throw error;
  }
}
```

**Định nghĩa hoàn thành (DoD):**
- [ ] Client-side rate limiting (tối đa 60 req/phút)
- [ ] Xử lý lỗi với timeout (5 giây)
- [ ] Caching layer (5 phút TTL)
- [ ] Logic thử lại cho các lỗi tạm thời (transient errors)
- [ ] Hỗ trợ chế độ Offline
- [ ] Unit tests cho các kịch bản lỗi

---

### 3. Backend APIs

**Authentication:**
```typescript
GET  /auth/google          // OAuth URL
POST /auth/callback        // OAuth callback
POST /auth/login           // Email/password login
POST /auth/refresh         // Refresh JWT
POST /auth/logout          // Invalidate token
GET  /auth/me              // Get current user
```

**Settings:**
```typescript
GET  /api/settings         // Get user settings (model, search space, connectors)
PUT  /api/settings         // Update settings
```

**Chat:**
```typescript
GET  /api/chat/messages    // Get chat history
POST /api/chat/messages    // Send message (streaming response)
POST /api/chat/save        // Save chat to backend
```

**Capture:**
```typescript
POST /api/capture          // Capture page content
GET  /api/captures         // List captured pages
```

**Định nghĩa hoàn thành (DoD):**
- [ ] Tất cả endpoints được document trong API spec
- [ ] Yêu cầu JWT authentication cho các protected endpoints
- [ ] Phản hồi lỗi tuân theo format chuẩn:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```
- [ ] Rate limiting trên backend (100 req/phút mỗi user)
- [ ] CORS được cấu hình cho extension origin
- [ ] Unit tests cho tất cả endpoints

---

### 4. Chrome APIs

**Required Permissions:**
```json
{
  "permissions": [
    "sidePanel",
    "storage",
    "tabs",
    "identity",
    "activeTab"
  ],
  "host_permissions": [
    "https://dexscreener.com/*",
    "https://api.dexscreener.com/*",
    "https://api.llama.fi/*"
  ]
}
```

**Chrome Identity API:**
```typescript
chrome.identity.launchWebAuthFlow({
  url: `${BACKEND_URL}/auth/google`,
  interactive: true,
}, (redirectUrl) => {
  // Handle OAuth callback
});
```

**Chrome Storage API:**
```typescript
// Plasmo Storage wrapper
import { Storage } from "@plasmohq/storage";

const storage = new Storage();
await storage.set("auth_token", encryptedJWT);
const token = await storage.get("auth_token");
```

**Định nghĩa hoàn thành (DoD):**
- [ ] Manifest permissions được cấu hình
- [ ] Host permissions cho tất cả external APIs
- [ ] Storage encryption cho dữ liệu nhạy cảm
- [ ] Xử lý lỗi khi permission bị từ chối
- [ ] Unit tests cho các interactions với Chrome API

---

## User Stories

### Story 1.0: Hệ thống Xác thực (Authentication System)
**[FR-EXT-00]** ⚠️ **P0 BLOCKER**

**Là một** SurfSense user,  
**Tôi muốn** đăng nhập vào extension với tài khoản SurfSense của tôi,  
**Để** extension có thể đồng bộ settings, lịch sử chat, và truy cập backend APIs.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.0.1: User Login Flow
**Given** user chưa đăng nhập vào extension  
**When** user click nút "Login" trong side panel header  
**Then** Chrome Identity API popup mở ra với các tùy chọn OAuth (Google, Email/Password)  
**And** user chọn Google OAuth  
**And** user hoàn tất quy trình OAuth  
**Then** extension nhận JWT token từ backend  
**And** extension chuyển hướng (redirects) về side panel  
**And** avatar/email của user hiển thị trong header

**Kịch bản lỗi (Error Scenario):**  
**Given** user đang trong quy trình OAuth  
**When** OAuth thất bại (user hủy hoặc lỗi mạng)  
**Then** extension hiển thị error toast "Login failed. Please try again."  
**And** user vẫn ở trạng thái chưa xác thực (unauthenticated state)

---

#### AC 1.0.2: Quản lý JWT Token
**Given** backend trả về JWT token (hết hạn sau 7 ngày)  
**When** extension nhận được token  
**Then** extension lưu encrypted JWT trong Plasmo Storage  
**And** thời gian hết hạn của token được lưu

**Auto-Refresh:**  
**Given** JWT token còn < 1 ngày là hết hạn  
**When** extension kiểm tra token expiry (mỗi giờ)  
**Then** extension gọi API `/auth/refresh`  
**And** backend trả về JWT token mới  
**And** extension cập nhật token đã lưu

**Logout:**  
**Given** user click "Logout" trong settings dropdown  
**When** hành động logout được kích hoạt  
**Then** extension xóa JWT khỏi Plasmo Storage  
**And** extension gọi API `/auth/logout`  
**And** user chuyển hướng về màn hình welcome

---

#### AC 1.0.3: Authenticated API Requests
**Given** user đã đăng nhập (JWT đã lưu)  
**When** extension thực hiện API request (ví dụ: `/chat/messages`)  
**Then** request bao gồm header `Authorization: Bearer {JWT}`  
**And** backend xác thực chữ ký JWT  
**And** request thành công với status 200

**Expired Token:**  
**Given** JWT token đã hết hạn  
**When** extension thực hiện API request  
**Then** backend trả về lỗi 401 Unauthorized  
**And** extension cố gắng auto-refresh  
**And** nếu refresh thành công, thử lại request ban đầu  
**And** nếu refresh thất bại, chuyển hướng user đến trang login

---

#### AC 1.0.4: Xử lý Offline
**Given** user đã đăng nhập trước đó  
**And** user mất kết nối internet  
**When** extension cố gắng kết nối backend  
**Then** extension hiển thị chỉ báo "Offline" trong header  
**And** extension cache trạng thái auth gần nhất  
**And** hành động của user (ví dụ: tin nhắn chat) được đưa vào hàng đợi (queued)

**Khi có mạng trở lại (Back Online):**  
**Given** user đang offline với các hành động trong hàng đợi  
**When** kết nối internet được khôi phục  
**Then** extension đồng bộ các hành động trong hàng đợi với backend  
**And** chỉ báo "Offline" biến mất  
**And** user thấy toast thành công "Synced {N} actions"

**Triển khai kỹ thuật:**
```typescript
// Use Chrome Identity API for OAuth
chrome.identity.launchWebAuthFlow({
  url: `${BACKEND_URL}/auth/google`,
  interactive: true,
}, (redirectUrl) => {
  // Extract JWT from redirect URL
  const jwt = new URL(redirectUrl).searchParams.get('token');
  
  // Store encrypted JWT
  await storage.set('auth_token', encrypt(jwt));
});

// Auto-refresh token
setInterval(async () => {
  const token = await storage.get('auth_token');
  const decoded = decodeJWT(token);
  
  if (isExpiringSoon(decoded.exp, 1 * 24 * 60 * 60)) {
    const newToken = await refreshToken(token);
    await storage.set('auth_token', encrypt(newToken));
  }
}, 60 * 60 * 1000); // Check every hour

// Include JWT in all API requests
const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = await storage.get('auth_token');
    return fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${decrypt(token)}`,
      },
    });
  },
};
```

**Cân nhắc bảo mật (Security Considerations):**
- Không bao giờ lưu API keys trong extension code (hiển thị cho users)
- Mã hóa JWT trong Plasmo Storage
- Sử dụng HTTPS cho tất cả API calls
- Triển khai CSRF protection
- Validate chữ ký JWT trên backend

**Backend APIs Needed:**
```typescript
GET  /auth/google          // OAuth URL
POST /auth/callback        // OAuth callback
POST /auth/login           // Email/password login
POST /auth/refresh         // Refresh JWT
POST /auth/logout          // Invalidate token
GET  /auth/me              // Get current user
```

**Files:**
- `lib/auth/chrome-identity.ts` (new) - Chrome Identity API wrapper
- `lib/auth/jwt-manager.ts` (new) - JWT storage, refresh, validation
- `lib/auth/api-client.ts` (new) - Authenticated API client
- `sidepanel/auth/LoginButton.tsx` (new) - Login UI
- `sidepanel/auth/UserProfile.tsx` (new) - User avatar/menu

---

### Story 1.1: Kiến trúc Side Panel (Side Panel Architecture)
**[FR-EXT-01]**

**Là một** crypto trader,  
**Tôi muốn** mở AI assistant dưới dạng side panel (không phải popup nhỏ),  
**Để** tôi có thể chat với AI trong khi vẫn xem được DexScreener chart.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.1.1: Mở Side Panel khi Click Icon
**Given** user đã cài đặt extension  
**When** user click icon extension trong Chrome toolbar  
**Then** side panel mở ra bên phải màn hình  
**And** chiều rộng của side panel là 400px (mặc định)  
**And** side panel không che khuất nội dung chính

---

#### AC 1.1.2: Thay đổi kích thước Side Panel (Resizable)
**Given** side panel đang mở  
**When** user kéo cạnh trái của panel  
**Then** chiều rộng panel thay đổi  
**And** chiều rộng tối thiểu là 300px  
**And** chiều rộng tối đa là 600px  
**And** tùy chọn kích thước (resize preference) được lưu trong Plasmo Storage

---

#### AC 1.1.3: Side Panel Tồn tại qua các Tab
**Given** side panel đang mở trên tab A  
**When** user chuyển sang tab B  
**Then** side panel vẫn hiển thị trên tab B  
**And** nội dung panel reload với context của tab B (nếu có)

**Edge Case:**  
**Given** user đóng side panel trên tab A  
**When** user chuyển sang tab B  
**Then** side panel vẫn đóng trên tab B

---

#### AC 1.1.4: Manifest Permissions
**Given** extension được build  
**When** developer kiểm tra `manifest.json`  
**Then** `sidePanel` permission có trong manifest  
**And** `openPanelOnActionClick: true` được thiết lập trong background script

**Ghi chú kỹ thuật (Technical Notes):**
```typescript
// background/index.ts
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Failed to set side panel behavior:", error));
```

**Files:**
- `surfsense_browser_extension/sidepanel.tsx` ✅
- `surfsense_browser_extension/package.json` (thêm sidePanel permission) ✅

---

### Story 1.2: Tích hợp Giao diện AI Chat (AI Chat Interface Integration)
**[FR-EXT-02, FR-INT-01]** ⭐ **AI MOAT**

**Là một** crypto trader,  
**Tôi muốn** chat với AI trong extension giống như trên web dashboard,  
**Để** tôi có trải nghiệm nhất quán và đầy đủ tính năng.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.2.1: Tích hợp Giao diện Chat
**Given** user đã đăng nhập và mở side panel  
**When** user gõ tin nhắn "Is BULLA token safe?" và nhấn Enter  
**Then** tin nhắn hiển thị trong khung chat với avatar user  
**And** phản hồi của AI bắt đầu streaming  
**And** `@assistant-ui/react` Thread component renders chính xác

---

#### AC 1.2.2: Phản hồi Streaming
**Given** user đã gửi tin nhắn  
**When** AI bắt đầu phản hồi  
**Then** text phản hồi hiển thị từng từ (streaming)  
**And** hiển thị các bước suy nghĩ (thinking steps visualization) (nếu có)  
**And** user có thể cuộn trong khi AI đang phản hồi  
**And** tự động cuộn xuống dưới cùng khi có nội dung mới

**Kịch bản lỗi (Error Scenario):**  
**Given** kết nối streaming bị ngắt  
**When** lỗi mạng xảy ra  
**Then** extension hiển thị thông báo lỗi "Connection lost. Retrying..."  
**And** extension cố gắng kết nối lại (tối đa 3 lần thử lại)

---

#### AC 1.2.3: Rendering Tool UI
**Given** AI response bao gồm tool outputs  
**When** AI sử dụng tool `display_image`  
**Then** component `DisplayImageToolUI` render hình ảnh  
**And** hình ảnh có caption và metadata

**Link Preview:**  
**Given** AI response bao gồm tool `link_preview`  
**When** tool output renders  
**Then** `LinkPreviewToolUI` hiển thị tiêu đề, mô tả, thumbnail

**Scraping:**  
**Given** AI sử dụng tool `scrape_webpage`  
**When** quá trình scraping hoàn tất  
**Then** `ScrapeWebpageToolUI` hiển thị nội dung đã trích xuất  
**And** user có thể mở rộng/thu gọn nội dung

---

#### AC 1.2.4: Lưu trữ Lịch sử Chat
**Given** user đã chat với AI  
**When** user đóng extension  
**And** user mở lại extension  
**Then** lịch sử chat vẫn hiển thị (được load từ Plasmo Storage)  
**And** user có thể cuộn lên xem tin nhắn cũ

**Đồng bộ Backend (Backend Sync):**  
**Given** user đã đăng nhập  
**When** tin nhắn chat được gửi  
**Then** tin nhắn được đồng bộ với backend API (`POST /chat/messages`)  
**And** lịch sử chat có thể truy cập từ web dashboard

---

#### AC 1.2.5: Dịch Truy vấn Ngôn ngữ Tự nhiên (Natural Language Query Translation) ⭐ [FR-INT-01]
**Given** user đang xem DexScreener  
**When** user gõ "Show me trending Solana memes with >$10k liquidity"  
**Then** AI dịch truy vấn thành DexScreener API filters:
```json
{
  "chain": "solana",
  "category": "meme",
  "minLiquidity": 10000,
  "sort": "trending"
}
```
**And** AI giải thích: "I'm searching for meme tokens on Solana with liquidity above $10k, sorted by trending volume."  
**And** AI thực hiện tìm kiếm và trả về kết quả

**Truy vấn phức tạp (Complex Query):**  
**Given** user hỏi "Find tokens launched in last 24h with >50% price increase"  
**When** AI xử lý truy vấn  
**Then** AI dịch thành:
```json
{
  "minAge": 0,
  "maxAge": 86400,
  "minPriceChange24h": 50
}
```
**And** AI trả về kết quả đã lọc kèm lời giải thích

**Ví dụ Placeholder:**  
**Given** user focus vào ô chat input  
**When** input đang trống  
**Then** placeholder hiển thị các ví dụ xoay vòng:
- "Show me new Solana tokens with high volume"
- "Find tokens with locked liquidity >90%"
- "What are the top trending meme coins today?"

**Component Reuse:**
```typescript
// From frontend
import { Thread } from "@/components/assistant-ui/thread";
import { DisplayImageToolUI } from "@/components/tool-ui/display-image";
import { LinkPreviewToolUI } from "@/components/tool-ui/link-preview";
import { ScrapeWebpageToolUI } from "@/components/tool-ui/scrape-webpage";
```

**Files:**
- `sidepanel/chat/ChatInterface.tsx` ✅
- `sidepanel/chat/ChatMessages.tsx` ✅
- `sidepanel/chat/ChatInput.tsx` ✅
- `sidepanel/chat/ChatHeader.tsx` ✅

---

### Story 1.3: Phát hiện Ngữ cảnh Trang (Page Context Detection)
**[FR-EXT-03]**

**Là một** crypto trader đang xem DexScreener,  
**Tôi muốn** AI tự động hiểu tôi đang xem token nào,  
**Để** tôi không cần copy/paste địa chỉ token mỗi lần.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.3.1: Phát hiện Loại Trang (Page Type Detection)
**Given** user điều hướng đến trang DexScreener  
**When** content script chạy  
**Then** loại trang (page type) được phát hiện là `dexscreener`  
**And** logic trích xuất token được kích hoạt

**Các trang khác:**  
**Given** user điều hướng đến CoinGecko  
**When** content script chạy  
**Then** loại trang được phát hiện là `coingecko`

**Given** user điều hướng đến Twitter/X  
**Then** loại trang được phát hiện là `twitter`

**Given** user điều hướng đến trang không xác định  
**Then** loại trang được phát hiện là `generic`

---

#### AC 1.3.2: Trích xuất Dữ liệu Token (DexScreener)
**Given** user đang xem trang token: `dexscreener.com/solana/ABC123`  
**When** content script trích xuất dữ liệu  
**Then** các dữ liệu sau được trích xuất:
- Token address: `ABC123`
- Chain: `solana`
- Price: `$0.0001234`
- 24h Volume: `$10,234`
- Liquidity: `$5,123`
- Pair info: `BULLA/SOL`

**And** dữ liệu được gửi đến side panel qua `chrome.runtime.sendMessage`

---

#### AC 1.3.3: Context Injection vào Chat
**Given** dữ liệu token đã được trích xuất  
**When** user mở chat  
**Then** AI nhận được context: "You are viewing BULLA/SOL token on Solana. Address: ABC123. Current price: $0.0001234..."  
**And** user có thể hỏi "Is this safe?" mà không cần chỉ định token

**Cập nhật Context:**  
**Given** user điều hướng đến token khác  
**When** dữ liệu token mới được trích xuất  
**Then** chat context tự động cập nhật  
**And** AI nhận biết token mới trong các tin nhắn tiếp theo

**Triển khai kỹ thuật:**
```typescript
// content.ts
function detectPageType(): PageType {
  const hostname = window.location.hostname;
  if (hostname.includes('dexscreener.com')) return 'dexscreener';
  if (hostname.includes('coingecko.com')) return 'coingecko';
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
  return 'generic';
}

function extractDexScreenerData(): TokenData {
  // Extract from URL: /solana/address
  // Or from page DOM
}
```

**Files:**
- `content.ts` ✅
- `sidepanel/context/PageContextProvider.tsx` ✅

---

### Story 1.4: Tích hợp Thông minh với DexScreener
**[FR-EXT-04]**

**Là một** crypto trader trên DexScreener,  
**Tôi muốn** thấy thẻ thông tin token (token info card) ở đầu side panel,  
**Để** tôi có thể nhanh chóng kiểm tra độ an toàn hoặc xem các holders.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.4.1: Hiển thị Thẻ Thông tin Token
**Given** user điều hướng đến trang token DexScreener  
**When** side panel mở ra  
**Then** Token Info Card hiển thị ở đầu panel  
**And** thẻ hiển thị:
- Token symbol/name: "BULLA/SOL"
- Current price: "$0.0001"
- 24h change: "+15%" (xanh nếu dương, đỏ nếu âm)
- Volume 24h: "$10K"
- Liquidity: "$5K"

---

#### AC 1.4.2: Các nút Thao tác Nhanh (Quick Action Buttons)
**Given** Token Info Card đang hiển thị  
**When** user click nút "Is this token safe?"  
**Then** chat input được điền sẵn "Is BULLA/SOL safe?"  
**And** AI nhận đầy đủ token context  
**And** AI thực hiện phân tích an toàn

**Top Holders:**  
**Given** user click nút "Show top holders"  
**When** hành động kích hoạt  
**Then** chat được điền sẵn "Show top holders for BULLA/SOL"  
**And** AI truy vấn dữ liệu blockchain

**Dự đoán giá (Price Prediction):**  
**Given** user click nút "Price prediction"  
**Then** chat được điền sẵn "Predict price for BULLA/SOL"  
**And** AI thực hiện phân tích kỹ thuật

---

#### AC 1.4.3: Tự động Giải quyết Context (Auto-Context Resolution)
**Given** user gõ "Is this token safe?" (không chỉ định token)  
**When** tin nhắn được gửi  
**Then** AI giải quyết "this token" = token hiện tại trên DexScreener  
**And** AI thực hiện phân tích trên token chính xác

**UI Design:**
```
┌─────────────────────────────┐
│ 🪙 BULLA/SOL               │
│ $0.0001  📈 +15%           │
│ Vol: $10K | Liq: $5K       │
│ [Safety Check] [Holders]   │
└─────────────────────────────┘
```

**Files:**
- `sidepanel/dexscreener/TokenInfoCard.tsx` ✅
- `sidepanel/chat/ChatInterface.tsx` (integrate card) ✅

---

### Story 1.5: Lưu nhanh trang (Quick Capture)
**[FR-EXT-05]**

**Là một** crypto trader,  
**Tôi muốn** lưu trang hiện tại vào không gian tìm kiếm (search space),  
**Để** tôi có thể tham khảo lại sau.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.5.1: Nút Quick Capture
**Given** side panel đang mở  
**When** user cuộn trong panel  
**Then** nút "📸 Save Current Page" vẫn hiển thị (sticky footer)  
**And** nút không che khuất nội dung chat

---

#### AC 1.5.2: Quy trình Lưu Trang
**Given** user đang xem trang token DexScreener  
**When** user click nút "📸 Save Current Page"  
**Then** extension capture nội dung trang (HTML, metadata, screenshot)  
**And** nội dung được lưu vào search space đã chọn của user  
**And** thông báo toast hiển thị "Page saved successfully"  
**And** trang đã lưu có thể truy cập từ web dashboard

**Kịch bản lỗi (Error Scenario):**  
**Given** user chưa đăng nhập  
**When** user click nút capture  
**Then** extension hiển thị "Please login to save pages"  
**And** login modal mở ra

---

#### AC 1.5.3: Tái sử dụng Chức năng Capture
**Given** web dashboard có API capture hiện có  
**When** extension gọi capture  
**Then** extension tái sử dụng endpoint `/api/capture`  
**And** cùng một logic backend xử lý capture  
**And** không có implementation trùng lặp

**Files:**
- `sidepanel/chat/QuickCapture.tsx` ✅

---

### Story 1.6: Đồng bộ Cài đặt (Settings Sync) với Frontend
**[FR-EXT-06]**

**Là một** SurfSense user,  
**Tôi muốn** extension sử dụng cùng model và search space như web dashboard,  
**Để** tôi không phải cấu hình lại.

**Tiêu chí chấp nhận (Acceptance Criteria - BDD Format):**

#### AC 1.6.1: Hiển thị Dropdown Cài đặt
**Given** user đã đăng nhập  
**When** user click icon ⚙️ trong header  
**Then** settings dropdown mở ra  
**And** dropdown hiển thị:
- Current model: "GPT-4 Turbo" (chỉ xem, bị mờ)
- Current search space: "Crypto Research" (chỉ xem, bị mờ)
- Links đến web dashboard:
  - "🔗 Manage Connectors"
  - "💬 View All Chats"
  - "⚙️ Full Settings"
- Nút "🚪 Logout"

---

#### AC 1.6.2: Đồng bộ Cài đặt khi Đăng nhập
**Given** user hoàn tất đăng nhập  
**When** nhận được JWT token  
**Then** extension gọi `GET /api/settings`  
**And** backend trả về:
```json
{
  "model": "gpt-4-turbo",
  "searchSpace": "crypto-research",
  "connectors": ["dexscreener", "helius"]
}
```
**And** settings được lưu trong Plasmo Storage  
**And** settings hiển thị trong dropdown

---

#### AC 1.6.3: Tự động cập nhật Cài đặt
**Given** user thay đổi model trên web dashboard  
**When** extension phát hiện thay đổi (qua polling hoặc webhook)  
**Then** extension lấy settings đã cập nhật  
**And** dropdown phản ánh model mới  
**And** các cuộc chat tiếp theo sử dụng model mới

**Polling:**  
**Given** extension đang hoạt động  
**When** mỗi 5 phút  
**Then** extension polls `GET /api/settings`  
