# Epic 4: Content Creation & Productivity

**Status:** 📋 PLANNED  
**Phase:** Phase 4  
**Duration:** 2 weeks  
**Priority:** P2 (Medium - Nice to Have)

---

## Epic Overview

Tạo tools giúp users create content (charts, threads) và improve productivity (quick actions, notifications, shortcuts). Tập trung vào **content creators** và **power users**.

**Business Value:**
- **Content Creators:** Tools để tạo Twitter threads, chart screenshots
- **Power Users:** Keyboard shortcuts, quick actions để work faster
- **Viral Marketing:** Users share content → Free marketing
- **User Retention:** Productivity features → Sticky product

**Key Differentiator:** AI-powered content generation vs manual tools.

---

## User Stories

### Story 4.1: Chart Screenshot with Annotations
**[FR-EXT-13]**

**Là một** crypto content creator,  
**Tôi muốn** capture và annotate charts,  
**Để** tôi có thể share insights trên Twitter/Telegram.

**Acceptance Criteria:**
- [ ] One-click chart capture:
  - Capture from DexScreener page
  - Auto-detect chart area
  - High-resolution screenshot
- [ ] Auto-add metadata:
  - Token symbol/name
  - Current price
  - 24h change
  - Volume, liquidity
  - Timestamp
  - Watermark (optional)
- [ ] Drawing tools:
  - Lines (trend lines, support/resistance)
  - Arrows (direction indicators)
  - Text labels
  - Shapes (circles, rectangles)
  - Fibonacci retracement
- [ ] Template styles:
  - Dark mode (default)
  - Light mode
  - Neon (crypto aesthetic)
  - Custom colors
- [ ] Export options:
  - Twitter format (1200x675)
  - Telegram format (square)
  - Instagram format (1080x1080)
  - Custom size
  - Copy to clipboard
  - Save to file

**UI Design:**
```
┌─────────────────────────────┐
│ 📸 Chart Capture            │
├─────────────────────────────┤
│ [Capture Chart]             │
│                             │
│ Drawing Tools:              │
│ [Line] [Arrow] [Text] [Fib] │
│                             │
│ Style:                      │
│ ● Dark  ○ Light  ○ Neon     │
│                             │
│ Metadata:                   │
│ ☑ Token info                │
│ ☑ Price & change            │
│ ☑ Volume & liquidity        │
│ ☑ Timestamp                 │
│ ☐ Watermark                 │
│                             │
│ Export:                     │
│ [Twitter] [Telegram] [Copy] │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface ChartCapture {
  screenshot: Blob;
  metadata: {
    tokenSymbol: string;
    price: number;
    change24h: number;
    volume: number;
    liquidity: number;
    timestamp: number;
  };
  annotations: {
    type: 'line' | 'arrow' | 'text' | 'shape' | 'fibonacci';
    coordinates: { x: number; y: number }[];
    text?: string;
    color: string;
  }[];
  style: 'dark' | 'light' | 'neon';
}

async function captureChart(): Promise<Blob> {
  // Capture DexScreener chart area
  const chartElement = document.querySelector('.chart-container');
  const canvas = await html2canvas(chartElement);
  return canvas.toBlob();
}

function addAnnotations(canvas: HTMLCanvasElement, annotations: Annotation[]) {
  const ctx = canvas.getContext('2d');
  for (const annotation of annotations) {
    switch (annotation.type) {
      case 'line':
        drawLine(ctx, annotation);
        break;
      case 'arrow':
        drawArrow(ctx, annotation);
        break;
      // ...
    }
  }
}
```

**Files:**
- `lib/capture/chart-capture.ts` (new)
- `sidepanel/capture/ChartCapturePanel.tsx` (new)
- `sidepanel/capture/AnnotationTools.tsx` (new)

---

### Story 4.2: AI Thread Generator
**[FR-EXT-14]**

**Là một** crypto content creator,  
**Tôi muốn** AI generate Twitter threads,  
**Để** tôi có thể share insights nhanh chóng.

**Acceptance Criteria:**
- [ ] Input:
  - Token address (auto-filled if on DexScreener)
  - Thread topic (optional)
  - Thread length (5-10 tweets)
  - Tone (bullish/neutral/bearish)
- [ ] AI generation:
  - Analyze token data
  - Generate thread structure
  - Include key stats
  - Add charts/screenshots
  - Optimize for engagement
- [ ] Thread structure:
  - Tweet 1: Hook (attention grabber)
  - Tweets 2-4: Analysis (data, insights)
  - Tweets 5-7: Implications (what it means)
  - Tweet 8-9: Conclusion (summary, CTA)
  - Tweet 10: Disclaimer (optional)
- [ ] Editing:
  - Edit each tweet
  - Reorder tweets
  - Add/remove tweets
  - Preview thread
- [ ] Export:
  - Copy all tweets
  - Copy individual tweet
  - Tweet directly (Twitter API)
  - Save as draft

**UI Design:**
```
┌─────────────────────────────┐
│ 🧵 AI Thread Generator      │
├─────────────────────────────┤
│ Token: BULLA/SOL            │
│ Topic: [Auto]               │
│ Length: [7 tweets] ▼        │
│ Tone: ● Bullish ○ Neutral   │
│                             │
│ [Generate Thread]           │
│                             │
│ Preview:                    │
│ ┌─────────────────────────┐ │
│ │ 1/ 🧵 BULLA is showing  │ │
│ │ massive volume spike... │ │
│ │ [Edit]                  │ │
│ ├─────────────────────────┤ │
│ │ 2/ Contract analysis:   │ │
│ │ ✅ Verified ✅ Renounced│ │
│ │ [Edit]                  │ │
│ └─────────────────────────┘ │
│                             │
│ [Copy All] [Tweet Now]      │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface ThreadRequest {
  tokenAddress: string;
  chain: string;
  topic?: string;
  length: number;
  tone: 'bullish' | 'neutral' | 'bearish';
}

interface GeneratedThread {
  tweets: {
    number: number;
    content: string;
    type: 'hook' | 'analysis' | 'implication' | 'conclusion' | 'disclaimer';
    includeChart?: boolean;
  }[];
  metadata: {
    tokenSymbol: string;
    keyStats: Record<string, any>;
  };
}

async function generateThread(request: ThreadRequest): Promise<GeneratedThread> {
  // Analyze token
  const analysis = await analyzeToken(request.tokenAddress, request.chain);
  
  // Generate thread with AI
  const prompt = `
    Generate a ${request.length}-tweet thread about ${analysis.symbol}.
    Tone: ${request.tone}
    Include: price, volume, holders, liquidity, sentiment
    Structure: Hook → Analysis → Implications → Conclusion
  `;
  
  const thread = await callAI(prompt, { analysis });
  
  return thread;
}
```

**Files:**
- `lib/content/thread-generator.ts` (new)
- `sidepanel/content/ThreadGeneratorPanel.tsx` (new)

---

### Story 4.3: Quick Actions & Productivity
**[FR-EXT-15, FR-EXT-16, FR-EXT-17]**

**Là một** power user,  
**Tôi muốn** quick actions và shortcuts,  
**Để** tôi có thể work faster.

**Acceptance Criteria:**

#### Quick Actions Context Menu (FR-EXT-15)
- [ ] Right-click on token address → Context menu
- [ ] Menu items:
  - "Add to Watchlist"
  - "Analyze Token"
  - "Check Safety"
  - "Copy Address"
  - "View on Explorer"
  - "View on DexScreener"
- [ ] Works on any webpage (not just DexScreener)
- [ ] Auto-detect token address format

#### Smart Notifications (FR-EXT-16)
- [ ] Notification priority levels:
  - High: Rug pull warnings, whale dumps
  - Medium: Price alerts, volume spikes
  - Low: General updates
- [ ] Quiet hours:
  - Set sleep schedule (e.g., 11pm - 7am)
  - No notifications during quiet hours
  - Emergency alerts only (rug pulls)
- [ ] Grouped notifications:
  - Group by token
  - Group by type
  - Collapse similar notifications
- [ ] Smart batching:
  - 5+ alerts → 1 summary notification
  - "5 price alerts triggered"
  - Click to expand
- [ ] Per-token settings:
  - Enable/disable notifications
  - Set priority level
  - Custom quiet hours

#### Keyboard Shortcuts (FR-EXT-17)
- [ ] Global shortcuts:
  - `Cmd+Shift+S` → Open side panel
  - `Cmd+Shift+H` → Hide side panel
  - `Cmd+Shift+N` → New chat
- [ ] Context shortcuts (when on DexScreener):
  - `Cmd+Shift+A` → Analyze current token
  - `Cmd+Shift+W` → Add to watchlist
  - `Cmd+Shift+C` → Capture chart
  - `Cmd+Shift+T` → Generate thread
- [ ] Portfolio shortcuts:
  - `Cmd+Shift+P` → Open portfolio
  - `Cmd+Shift+R` → Refresh portfolio
- [ ] Customizable shortcuts:
  - User can remap shortcuts
  - No conflicts with browser shortcuts

**UI Design - Settings:**
```
┌─────────────────────────────┐
│ ⚙️ Productivity Settings    │
├─────────────────────────────┤
│ Notifications:              │
│ Priority: [High] [Med] [Low]│
│ Quiet Hours: 11pm - 7am     │
│ ☑ Group notifications       │
│ ☑ Smart batching            │
│                             │
│ Keyboard Shortcuts:         │
│ Open panel: Cmd+Shift+S     │
│ Analyze: Cmd+Shift+A        │
│ Watchlist: Cmd+Shift+W      │
│ [Customize]                 │
│                             │
│ Quick Actions:              │
│ ☑ Context menu enabled      │
│ ☑ Auto-detect addresses     │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
// Context menu
chrome.contextMenus.create({
  id: 'analyze-token',
  title: 'Analyze Token',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyze-token') {
    const address = extractTokenAddress(info.selectionText);
    analyzeToken(address);
  }
});

// Keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'open-panel':
      chrome.sidePanel.open();
      break;
    case 'analyze-token':
      analyzeCurrentToken();
      break;
    // ...
  }
});

// Smart notifications
interface NotificationSettings {
  priority: 'high' | 'medium' | 'low';
  quietHours: { start: string; end: string };
  grouping: boolean;
  batching: boolean;
  perToken: Record<string, {
    enabled: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
}

function shouldShowNotification(notification: Notification, settings: NotificationSettings): boolean {
  // Check quiet hours
  if (isQuietHours(settings.quietHours) && notification.priority !== 'high') {
    return false;
  }
  
  // Check per-token settings
  const tokenSettings = settings.perToken[notification.tokenAddress];
  if (tokenSettings && !tokenSettings.enabled) {
    return false;
  }
  
  return true;
}
```

**Files:**
- `background/context-menu.ts` (new)
- `background/keyboard-shortcuts.ts` (new)
- `background/notifications/smart-notifications.ts` (new)
- `sidepanel/settings/ProductivitySettings.tsx` (new)

---

## Technical Dependencies

### Chrome APIs
- `chrome.contextMenus` - Context menu
- `chrome.commands` - Keyboard shortcuts
- `chrome.notifications` - Notifications
- `chrome.alarms` - Quiet hours

### External Libraries
- `html2canvas` - Chart capture
- `fabric.js` - Drawing tools (optional)

---

## Testing Strategy

### Unit Tests
- [ ] Token address detection
- [ ] Notification priority logic
- [ ] Quiet hours calculation

### Integration Tests
- [ ] Chart capture works
- [ ] Thread generation works
- [ ] Context menu appears
- [ ] Shortcuts trigger actions

### Manual Testing
- [ ] Capture chart and annotate
- [ ] Generate thread for live token
- [ ] Test all keyboard shortcuts
- [ ] Verify quiet hours work

---

## Definition of Done

- [ ] All 3 stories completed
- [ ] All acceptance criteria met
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Code reviewed
- [ ] Documentation updated

---

## Notes

**Target Users:** Content creators và power users.

**Marketing Opportunity:** User-generated content (threads, charts) → Free viral marketing.

**All Epics Complete!** 🎉
