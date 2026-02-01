# Epic 2: Smart Monitoring & Alerts

**Status:** 📋 PLANNED  
**Phase:** Phase 2  
**Duration:** 2 weeks  
**Priority:** P0 (Critical - Risk Protection)

---

## Epic Overview

Xây dựng hệ thống monitoring và alerts thông minh để bảo vệ users khỏi rủi ro và giúp họ không bỏ lỡ cơ hội. Tập trung vào **risk protection** (rug pull detection) và **opportunity alerts** (whale activity, price movements).

**Business Value:**
- **Risk Protection:** Giúp users tránh mất tiền vào rug pulls
- **Opportunity Alerts:** Không bỏ lỡ whale movements và price spikes
- **Always-On Monitoring:** Background monitoring ngay cả khi browser đóng
- **Competitive Advantage:** Proactive alerts vs passive dashboards (DexScreener/DexTools)

**Key Differentiator:** AI-driven anomaly detection, không chỉ là threshold alerts.

---

## User Stories

### Story 2.1: Real-time Price Alerts
**[FR-EXT-07]**

**Là một** crypto trader,  
**Tôi muốn** set price alerts cho tokens trong watchlist,  
**Để** tôi được notify khi price hit target mà không cần stare vào chart cả ngày.

**Acceptance Criteria:**
- [ ] Watchlist management trong side panel
  - Add token to watchlist (from DexScreener page)
  - Remove token from watchlist
  - View all watchlist tokens
  - Edit token alerts
- [ ] Alert types:
  - Price above threshold (e.g., > $0.001)
  - Price below threshold (e.g., < $0.0005)
  - Price change % (e.g., +20% in 1h)
  - Volume spike (e.g., 3x average volume)
  - Liquidity change (e.g., -50% liquidity)
- [ ] Browser notifications:
  - Work even when tab closed
  - Show token symbol, price, change %
  - Click notification → Open DexScreener page
- [ ] Sound alerts (optional):
  - Enable/disable per alert
  - Different sounds for different alert types
- [ ] Alert history:
  - View past alerts
  - Mark as read/unread

**UI Design:**
```
┌─────────────────────────────┐
│ 📊 Watchlist (5 tokens)     │
├─────────────────────────────┤
│ BULLA/SOL    $0.0001  +15%  │
│ 🔔 Alert: Price > $0.00015  │
│ [Edit] [Remove]             │
├─────────────────────────────┤
│ PEPE/ETH     $0.000001 -5%  │
│ 🔕 No alerts                │
│ [Add Alert]                 │
├─────────────────────────────┤
│ [+ Add Token to Watchlist]  │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface PriceAlert {
  id: string;
  tokenAddress: string;
  chain: string;
  alertType: 'above' | 'below' | 'change_percent' | 'volume_spike' | 'liquidity_change';
  threshold: number;
  enabled: boolean;
  soundEnabled: boolean;
  lastTriggered?: number;
}

// Background service worker
chrome.alarms.create('checkPriceAlerts', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkPriceAlerts') {
    await checkAllPriceAlerts();
  }
});
```

**Backend API:**
```
POST /api/watchlist/add
DELETE /api/watchlist/:id
GET /api/watchlist
POST /api/alerts/create
GET /api/alerts/check  // Returns triggered alerts
```

**Files:**
- `background/alerts/price-alerts.ts` (new)
- `sidepanel/watchlist/WatchlistPanel.tsx` (new)
- `sidepanel/watchlist/AddAlertModal.tsx` (new)

---

### Story 2.2: Whale Activity Tracker
**[FR-EXT-08]**

**Là một** crypto trader,  
**Tôi muốn** được notify khi có whale buy/sell lớn,  
**Để** tôi có thể follow smart money và tránh bị dumped.

**Acceptance Criteria:**
- [ ] Monitor large transactions:
  - Configurable thresholds: $10K, $50K, $100K
  - Detect buy vs sell
  - Show transaction size in USD
- [ ] Wallet clustering detection:
  - Identify same entity (multiple wallets)
  - Show total holdings across wallets
- [ ] Smart money tracking:
  - Track specific wallet addresses
  - Alert on their activities
  - Show their historical performance
- [ ] Transaction details:
  - Wallet address
  - Transaction hash
  - Amount (tokens + USD)
  - Time
  - Link to explorer
- [ ] Notification:
  - Browser notification for whale activity
  - Show in side panel feed
  - Filter by token (only watchlist or all)

**UI Design:**
```
┌─────────────────────────────┐
│ 🐋 Whale Activity           │
├─────────────────────────────┤
│ 2 min ago                   │
│ 🟢 BUY $100K BULLA/SOL      │
│ Wallet: 0x1234...5678       │
│ Amount: 1B tokens           │
│ [View on Explorer]          │
├─────────────────────────────┤
│ 5 min ago                   │
│ 🔴 SELL $50K PEPE/ETH       │
│ Wallet: 0xabcd...ef01       │
│ ⚠️ Smart Money Wallet       │
│ [Track This Wallet]         │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface WhaleTransaction {
  id: string;
  tokenAddress: string;
  chain: string;
  type: 'buy' | 'sell';
  amountUSD: number;
  amountTokens: string;
  walletAddress: string;
  txHash: string;
  timestamp: number;
  isSmartMoney: boolean;
}

// Poll blockchain for large transactions
async function monitorWhaleActivity() {
  const watchlistTokens = await getWatchlistTokens();
  for (const token of watchlistTokens) {
    const largeTxs = await fetchLargeTransactions(token, threshold);
    for (const tx of largeTxs) {
      await notifyWhaleActivity(tx);
    }
  }
}
```

**Data Sources:**
- Solana: Helius API / QuickNode
- Ethereum: Etherscan API / Alchemy
- Base: BaseScan API

**Files:**
- `background/alerts/whale-tracker.ts` (new)
- `sidepanel/whale/WhaleActivityFeed.tsx` (new)
- `lib/blockchain/transaction-monitor.ts` (new)

---

### Story 2.3: Rug Pull Early Warning System
**[FR-EXT-09]**

**Là một** crypto trader,  
**Tôi muốn** được cảnh báo sớm về rug pull risks,  
**Để** tôi không mất tiền vào scam tokens.

**Acceptance Criteria:**
- [ ] Risk indicators monitored:
  - LP removal (liquidity pulled)
  - Mint authority changes (can mint more tokens)
  - Suspicious holder patterns (top 10 holders > 80%)
  - Contract ownership (not renounced)
  - Honeypot detection (can't sell)
- [ ] Risk score calculation:
  - 0-3: Low risk (green)
  - 4-6: Medium risk (yellow)
  - 7-10: High risk (red)
- [ ] Risk score display:
  - Show on Token Info Card
  - Update in real-time
  - Explain each risk factor
- [ ] Recommendations:
  - SAFE: "Low risk, proceed with caution"
  - CAUTION: "Medium risk, do your own research"
  - AVOID: "High risk, likely scam"
- [ ] Alerts:
  - Notify when risk score increases
  - Notify on LP removal
  - Notify on mint authority changes

**UI Design:**
```
┌─────────────────────────────┐
│ ⚠️ RUG PULL WARNING         │
├─────────────────────────────┤
│ Risk Score: 7/10 (High)     │
│                             │
│ 🔴 LP unlocked (High Risk)  │
│ 🟡 Top holder owns 40%      │
│ 🟢 Contract verified        │
│ 🟢 Mint authority renounced │
│                             │
│ Recommendation: AVOID       │
│ This token shows signs of   │
│ potential rug pull.         │
│                             │
│ [View Full Analysis]        │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface RiskAssessment {
  tokenAddress: string;
  chain: string;
  riskScore: number; // 0-10
  riskLevel: 'low' | 'medium' | 'high';
  indicators: {
    lpLocked: boolean;
    lpLockDuration?: number; // days
    mintAuthority: 'renounced' | 'active' | 'unknown';
    topHolderPercent: number;
    contractVerified: boolean;
    isHoneypot: boolean;
  };
  recommendation: 'safe' | 'caution' | 'avoid';
  explanation: string;
  timestamp: number;
}

async function assessRugPullRisk(tokenAddress: string, chain: string): Promise<RiskAssessment> {
  // Check LP lock status
  const lpLocked = await checkLPLock(tokenAddress, chain);
  
  // Check mint authority
  const mintAuthority = await checkMintAuthority(tokenAddress, chain);
  
  // Check holder distribution
  const holders = await getTopHolders(tokenAddress, chain);
  const topHolderPercent = calculateTopHolderPercent(holders);
  
  // Check contract verification
  const contractVerified = await isContractVerified(tokenAddress, chain);
  
  // Check honeypot
  const isHoneypot = await checkHoneypot(tokenAddress, chain);
  
  // Calculate risk score
  const riskScore = calculateRiskScore({
    lpLocked,
    mintAuthority,
    topHolderPercent,
    contractVerified,
    isHoneypot,
  });
  
  return {
    tokenAddress,
    chain,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    indicators: {
      lpLocked,
      mintAuthority,
      topHolderPercent,
      contractVerified,
      isHoneypot,
    },
    recommendation: getRecommendation(riskScore),
    explanation: generateExplanation(riskScore, indicators),
    timestamp: Date.now(),
  };
}
```

**Data Sources:**
- LP Lock: RugCheck API, Token Sniffer
- Mint Authority: On-chain data (Solana/Ethereum)
- Holders: Blockchain explorers
- Contract Verification: Etherscan, Solscan
- Honeypot: Honeypot.is API

**Files:**
- `lib/risk/rug-pull-detector.ts` (new)
- `sidepanel/risk/RiskScoreCard.tsx` (new)
- `background/alerts/risk-monitor.ts` (new)

---

## Technical Dependencies

### Backend APIs
```
POST /api/watchlist/add
GET  /api/watchlist
POST /api/alerts/create
GET  /api/alerts/check
GET  /api/whale/transactions
GET  /api/risk/assess
```

### External APIs
- **Helius API** (Solana transactions)
- **Alchemy** (Ethereum transactions)
- **RugCheck API** (LP lock status)
- **Token Sniffer** (Contract analysis)
- **Honeypot.is** (Honeypot detection)

### Chrome APIs
- `chrome.alarms` - Periodic checks
- `chrome.notifications` - Browser notifications
- `chrome.storage` - Watchlist persistence

---

## Testing Strategy

### Unit Tests
- [ ] Risk score calculation
- [ ] Whale transaction detection
- [ ] Alert triggering logic

### Integration Tests
- [ ] Price alerts trigger correctly
- [ ] Whale activity notifications work
- [ ] Risk assessment updates in real-time

### Manual Testing
- [ ] Add token to watchlist
- [ ] Set price alert and verify notification
- [ ] Monitor whale activity on live token
- [ ] Check rug pull warning on known scam token

---

## Definition of Done

- [ ] All 3 stories completed
- [ ] All acceptance criteria met
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] External API integrations working
- [ ] Code reviewed
- [ ] Documentation updated

---

## Notes

**Priority Justification:** Risk protection (rug pull detection) is CRITICAL for user trust. Users will not use the product if they lose money to scams.

**Next Epic:** Epic 3 - Trading Intelligence (Phase 3)
