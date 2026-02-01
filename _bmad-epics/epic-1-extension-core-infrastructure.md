# Epic 1: Extension Core Infrastructure

**Status:** ✅ COMPLETED  
**Phase:** Phase 1  
**Duration:** 2 weeks  
**Priority:** P0 (Critical)

---

## Epic Overview

Xây dựng nền tảng cơ bản cho Chrome Extension với Side Panel architecture, tích hợp AI chat interface từ frontend, và context detection cho các trang crypto.

**Business Value:**
- Cho phép users chat với AI ngay trong browser
- Tự động detect và extract thông tin token từ DexScreener
- Tái sử dụng tối đa frontend components (giảm development time)
- Foundation cho tất cả features sau này

---

## User Stories

### Story 1.1: Side Panel Architecture
**[FR-EXT-01]**

**Là một** crypto trader,  
**Tôi muốn** mở AI assistant dưới dạng side panel (không phải popup nhỏ),  
**Để** tôi có thể chat với AI trong khi vẫn xem được DexScreener chart.

**Acceptance Criteria:**
- [ ] Extension icon click → Mở side panel bên phải màn hình
- [ ] Side panel width: 400px (default), resizable 300-600px
- [ ] Side panel không che khuất nội dung chính
- [ ] Side panel persist khi switch tabs
- [ ] Manifest có permission `sidePanel`

**Technical Notes:**
```typescript
// background/index.ts
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Failed to set side panel behavior:", error));
```

**Files:**
- `surfsense_browser_extension/sidepanel.tsx` ✅
- `surfsense_browser_extension/package.json` (add sidePanel permission) ✅

---

### Story 1.2: AI Chat Interface Integration
**[FR-EXT-02]**

**Là một** crypto trader,  
**Tôi muốn** chat với AI trong extension giống như trên web dashboard,  
**Để** tôi có trải nghiệm nhất quán và đầy đủ tính năng.

**Acceptance Criteria:**
- [ ] Tích hợp `@assistant-ui/react` Thread component
- [ ] Streaming responses hoạt động
- [ ] Thinking steps visualization hiển thị
- [ ] Tool UIs render đúng (images, links, scraping)
- [ ] Attachment handling (upload files/images)
- [ ] Chat history lưu vào Plasmo Storage
- [ ] Chat history sync với backend API

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

### Story 1.3: Page Context Detection
**[FR-EXT-03]**

**Là một** crypto trader đang xem DexScreener,  
**Tôi muốn** AI tự động hiểu tôi đang xem token nào,  
**Để** tôi không cần copy/paste token address mỗi lần.

**Acceptance Criteria:**
- [ ] Content script detect page type:
  - DexScreener → Extract token data
  - CoinGecko → Extract coin info
  - Twitter/X → Extract crypto discussions
  - Generic → Basic page info
- [ ] Token data extracted:
  - Token address
  - Chain (Solana, Ethereum, Base)
  - Price, volume, liquidity
  - Pair info
- [ ] Context injected vào chat: "You are viewing $TOKEN on Solana..."
- [ ] Context updates khi user navigate to different token

**Technical Implementation:**
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

### Story 1.4: DexScreener Smart Integration
**[FR-EXT-04]**

**Là một** crypto trader trên DexScreener,  
**Tôi muốn** thấy token info card ở top của side panel,  
**Để** tôi có thể nhanh chóng check safety hoặc xem holders.

**Acceptance Criteria:**
- [ ] Token Info Card hiển thị khi detect DexScreener page
- [ ] Card shows:
  - Token symbol/name
  - Current price
  - 24h change (%)
  - Volume 24h
  - Liquidity
- [ ] Quick action buttons:
  - "Is this token safe?" → Trigger safety check
  - "Show top holders" → Query blockchain
  - "Price prediction" → AI analysis
- [ ] Buttons trigger chat with pre-filled context
- [ ] Auto-context: "this token" = token đang xem

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

### Story 1.5: Quick Capture
**[FR-EXT-05]**

**Là một** crypto trader,  
**Tôi muốn** save current page vào search space,  
**Để** tôi có thể reference lại sau.

**Acceptance Criteria:**
- [ ] "📸 Save Current Page" button ở bottom của side panel
- [ ] Button sticky (luôn visible)
- [ ] Click → Capture page content
- [ ] Save vào selected search space
- [ ] Toast notification: "Page saved successfully"
- [ ] Reuse existing capture functionality

**Files:**
- `sidepanel/chat/QuickCapture.tsx` ✅

---

### Story 1.6: Settings Sync với Frontend
**[FR-EXT-06]**

**Là một** SurfSense user,  
**Tôi muốn** extension sử dụng cùng model và search space như web dashboard,  
**Để** tôi không phải config lại.

**Acceptance Criteria:**
- [ ] Settings dropdown trong extension header
- [ ] Dropdown shows:
  - Current model (read-only)
  - Current search space (read-only)
  - Links to frontend management
- [ ] Links:
  - "Manage Connectors" → Open frontend /settings/connectors
  - "View All Chats" → Open frontend /chats
  - "Full Settings" → Open frontend /settings
- [ ] State sync:
  - Extension reads from backend API
  - Model selection synced
  - Search space synced
  - Enabled connectors synced (read-only)
  - Chat history bidirectional sync

**API Endpoints Needed:**
```typescript
GET  /api/user/settings
POST /api/user/settings
GET  /api/models/available
GET  /api/search-spaces
GET  /api/connectors/enabled
```

**Plasmo Storage Structure:**
```typescript
interface ExtensionStorage {
  settings: {
    selectedModel: string;
    searchSpaceId: string;
    apiKey: string;
  };
  cachedSettings: UserSettings;
  lastSync: number;
}
```

**Files:**
- `sidepanel/chat/ChatHeader.tsx` (add settings dropdown)
- `lib/api/settings-sync.ts` (new)

---

## Technical Dependencies

### Frontend Components to Reuse
- `@assistant-ui/react` Thread
- Tool UIs (images, links, scraping)
- Thinking steps visualization
- Chat utilities

### Backend APIs Needed
- `/api/user/settings` - Get/update user settings
- `/api/models/available` - List available models
- `/api/search-spaces` - List search spaces
- `/api/connectors/enabled` - List enabled connectors
- `/api/chat/stream` - Chat streaming (existing)

### Chrome APIs Used
- `chrome.sidePanel` - Side panel management
- `chrome.storage` - Plasmo Storage
- `chrome.tabs` - Tab management
- `chrome.runtime` - Messaging

---

## Testing Strategy

### Unit Tests
- [ ] PageContextProvider state management
- [ ] Token data extraction from DexScreener
- [ ] Settings sync logic

### Integration Tests
- [ ] Side panel opens on icon click
- [ ] Chat streaming works
- [ ] Context detection works on DexScreener
- [ ] Token card displays correctly
- [ ] Quick capture saves page

### Manual Testing
- [ ] Test on DexScreener.com
- [ ] Test on CoinGecko
- [ ] Test on Twitter
- [ ] Test settings sync with frontend
- [ ] Test chat history persistence

---

## Definition of Done

- [ ] All 6 stories completed
- [ ] All acceptance criteria met
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Notes

**Phase 1 Status:** ✅ COMPLETED (as of 2026-02-01)

**Next Epic:** Epic 2 - Smart Monitoring & Alerts (Phase 2)
