# Epic 3: Trading Intelligence

**Status:** 📋 PLANNED  
**Phase:** Phase 3  
**Duration:** 2 weeks  
**Priority:** P1 (High - Value Add)

---

## Epic Overview

Cung cấp AI-powered trading insights để giúp users make better trading decisions. Tập trung vào **comprehensive analysis**, **entry/exit suggestions**, và **portfolio tracking**.

**Business Value:**
- **Better Decisions:** AI-generated insights giúp users trade smarter
- **Time Savings:** One-click analysis thay vì hours of research
- **Portfolio Management:** Track performance và optimize holdings
- **Competitive Advantage:** AI predictions vs static data (DexScreener/DexTools)

**Key Differentiator:** AI-first analysis với natural language explanations.

---

## User Stories

### Story 3.1: One-Click Token Analysis
**[FR-EXT-10]**

**Là một** crypto trader,  
**Tôi muốn** analyze token với một click,  
**Để** tôi có comprehensive insights mà không cần research thủ công.

**Acceptance Criteria:**
- [ ] "Analyze This Token" button trên Token Info Card
- [ ] Comprehensive analysis includes:
  - **Contract Analysis:**
    - Verified/unverified
    - Renounced ownership
    - Proxy contract detection
    - Source code availability
  - **Holder Distribution:**
    - Top 10 holders percentage
    - Holder count
    - Whale concentration
    - Distribution chart
  - **Liquidity Analysis:**
    - Total liquidity (USD)
    - LP lock status & duration
    - Liquidity history (7d, 30d)
    - Liquidity/Market cap ratio
  - **Trading Volume:**
    - 24h volume
    - Volume trend (increasing/decreasing)
    - Volume/Liquidity ratio
    - Unusual volume spikes
  - **Price History:**
    - All-time high/low
    - 7d, 30d performance
    - Price volatility
    - Support/resistance levels
  - **Social Sentiment:**
    - Twitter mentions
    - Telegram activity
    - Reddit discussions
    - Sentiment score (positive/negative/neutral)
- [ ] AI-Generated Summary:
  - 2-3 sentence summary
  - Key insights highlighted
  - Risk assessment
  - Trading recommendation
- [ ] Analysis caching:
  - Cache for 5 minutes
  - Show "Last updated" timestamp
  - Refresh button

**UI Design:**
```
┌─────────────────────────────┐
│ 📊 Token Analysis           │
├─────────────────────────────┤
│ AI Summary:                 │
│ "BULLA shows strong holder  │
│ distribution with verified  │
│ contract. Volume increasing │
│ 200% in 24h. Moderate risk."│
│                             │
│ Contract: ✅ Verified       │
│ Ownership: ✅ Renounced     │
│                             │
│ Holders: 1,234              │
│ Top 10: 35% (Good)          │
│                             │
│ Liquidity: $50K             │
│ LP Lock: 90 days            │
│                             │
│ Volume 24h: $100K (+200%)   │
│ Price: $0.0001 (+15%)       │
│                             │
│ Sentiment: 😊 Positive      │
│ Twitter: 500 mentions       │
│                             │
│ Recommendation: BUY         │
│ Confidence: 75%             │
│                             │
│ [View Full Report]          │
│ Last updated: 2 min ago     │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface TokenAnalysis {
  tokenAddress: string;
  chain: string;
  timestamp: number;
  
  contract: {
    verified: boolean;
    renounced: boolean;
    isProxy: boolean;
    sourceCode: boolean;
  };
  
  holders: {
    count: number;
    top10Percent: number;
    distribution: { address: string; percent: number }[];
  };
  
  liquidity: {
    totalUSD: number;
    lpLocked: boolean;
    lpLockDuration?: number;
    history7d: number[];
    liquidityMcapRatio: number;
  };
  
  volume: {
    volume24h: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    volumeLiquidityRatio: number;
    spikes: { timestamp: number; volume: number }[];
  };
  
  price: {
    current: number;
    ath: number;
    atl: number;
    change7d: number;
    change30d: number;
    volatility: number;
    supportLevels: number[];
    resistanceLevels: number[];
  };
  
  social: {
    twitterMentions: number;
    telegramActivity: number;
    redditDiscussions: number;
    sentimentScore: number; // -1 to 1
    sentiment: 'positive' | 'negative' | 'neutral';
  };
  
  aiSummary: string;
  recommendation: 'buy' | 'hold' | 'sell' | 'avoid';
  confidence: number; // 0-100
}

async function analyzeToken(tokenAddress: string, chain: string): Promise<TokenAnalysis> {
  // Parallel data fetching
  const [contract, holders, liquidity, volume, price, social] = await Promise.all([
    analyzeContract(tokenAddress, chain),
    analyzeHolders(tokenAddress, chain),
    analyzeLiquidity(tokenAddress, chain),
    analyzeVolume(tokenAddress, chain),
    analyzePrice(tokenAddress, chain),
    analyzeSocial(tokenAddress, chain),
  ]);
  
  // AI-generated summary
  const aiSummary = await generateAISummary({
    contract,
    holders,
    liquidity,
    volume,
    price,
    social,
  });
  
  return {
    tokenAddress,
    chain,
    timestamp: Date.now(),
    contract,
    holders,
    liquidity,
    volume,
    price,
    social,
    aiSummary,
    recommendation: getRecommendation(/* ... */),
    confidence: calculateConfidence(/* ... */),
  };
}
```

**Files:**
- `lib/analysis/token-analyzer.ts` (new)
- `sidepanel/analysis/TokenAnalysisPanel.tsx` (new)
- `sidepanel/analysis/AnalysisSummary.tsx` (new)

---

### Story 3.2: Smart Entry/Exit Suggestions
**[FR-EXT-11]**

**Là một** crypto trader,  
**Tôi muốn** AI suggest entry/exit points,  
**Để** tôi maximize profits và minimize losses.

**Acceptance Criteria:**
- [ ] Technical analysis:
  - Support/Resistance levels (3 levels each)
  - Fibonacci retracement levels
  - Volume profile analysis
  - Moving averages (20, 50, 200)
- [ ] AI predictions:
  - Predicted price targets (3 levels)
  - Time horizon (1h, 4h, 24h)
  - Confidence score per prediction
- [ ] Risk/Reward calculation:
  - Suggested entry range
  - Stop loss level
  - Take profit levels (3 targets)
  - Risk/Reward ratio
- [ ] Visual representation:
  - Price chart with levels marked
  - Entry/exit zones highlighted
  - Risk/reward visualization
- [ ] Explanation:
  - Why these levels?
  - What signals support this?
  - What could invalidate this?

**UI Design:**
```
┌─────────────────────────────┐
│ 💡 AI Trading Suggestion    │
├─────────────────────────────┤
│ Current Price: $0.00010     │
│                             │
│ Entry Zone: 🟢              │
│ $0.00010 - $0.00012         │
│                             │
│ Targets:                    │
│ 🎯 Target 1: $0.00015 (+25%)│
│ 🎯 Target 2: $0.00018 (+50%)│
│ 🎯 Target 3: $0.00022 (+83%)│
│                             │
│ Stop Loss: 🔴               │
│ $0.00008 (-20%)             │
│                             │
│ Risk/Reward: 1:3.3 (Good)   │
│ Confidence: 75%             │
│                             │
│ Why?                        │
│ • Strong support at $0.0001 │
│ • Volume increasing         │
│ • Fibonacci 0.618 at $0.00015│
│                             │
│ [View Chart] [Set Alerts]   │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface TradingSuggestion {
  tokenAddress: string;
  chain: string;
  currentPrice: number;
  timestamp: number;
  
  entry: {
    min: number;
    max: number;
    reasoning: string;
  };
  
  targets: {
    level: number;
    price: number;
    percentGain: number;
    confidence: number;
  }[];
  
  stopLoss: {
    price: number;
    percentLoss: number;
    reasoning: string;
  };
  
  riskReward: number;
  overallConfidence: number;
  
  technicalLevels: {
    support: number[];
    resistance: number[];
    fibonacci: { level: number; price: number }[];
    movingAverages: { period: number; price: number }[];
  };
  
  reasoning: string[];
  invalidationConditions: string[];
}
```

**Files:**
- `lib/analysis/trading-suggestions.ts` (new)
- `sidepanel/analysis/TradingSuggestionPanel.tsx` (new)

---

### Story 3.3: Portfolio Tracker Integration
**[FR-EXT-12]**

**Là một** crypto trader,  
**Tôi muốn** track portfolio trong extension,  
**Để** tôi biết P&L real-time mà không cần mở nhiều tabs.

**Acceptance Criteria:**
- [ ] Wallet connection:
  - Support MetaMask, Phantom, Coinbase Wallet
  - Multi-wallet support
  - Auto-detect holdings
- [ ] Portfolio overview:
  - Total value (USD)
  - 24h P&L ($ and %)
  - All-time P&L
  - Asset allocation chart
- [ ] Holdings list:
  - Token symbol/name
  - Amount held
  - Current value
  - 24h change
  - P&L per token
  - Entry price (if available)
- [ ] Performance analytics:
  - Best/worst performers
  - Win rate
  - Average hold time
  - Total trades
- [ ] Quick actions:
  - Analyze token
  - Set price alert
  - View on DexScreener
  - Sell (link to DEX)

**UI Design:**
```
┌─────────────────────────────┐
│ 💼 Portfolio                │
├─────────────────────────────┤
│ Total Value: $5,234         │
│ 24h P&L: +$234 (+4.7%) 📈   │
│                             │
│ Holdings (5 tokens):        │
│                             │
│ BULLA/SOL                   │
│ 1,000,000 tokens            │
│ $1,234 (+15%) 📈            │
│ [Analyze] [Alert] [Sell]    │
│                             │
│ PEPE/ETH                    │
│ 500,000,000 tokens          │
│ $2,100 (-5%) 📉             │
│ [Analyze] [Alert] [Sell]    │
│                             │
│ [+ Add Manual Position]     │
│                             │
│ Performance:                │
│ Best: BULLA (+15%)          │
│ Worst: PEPE (-5%)           │
│ Win Rate: 60%               │
└─────────────────────────────┘
```

**Technical Implementation:**
```typescript
interface Portfolio {
  wallets: {
    address: string;
    chain: string;
    type: 'metamask' | 'phantom' | 'coinbase';
  }[];
  
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  
  holdings: {
    tokenAddress: string;
    chain: string;
    symbol: string;
    name: string;
    amount: string;
    currentPrice: number;
    currentValue: number;
    change24h: number;
    change24hPercent: number;
    entryPrice?: number;
    pnl?: number;
    pnlPercent?: number;
  }[];
  
  analytics: {
    bestPerformer: { symbol: string; change: number };
    worstPerformer: { symbol: string; change: number };
    winRate: number;
    avgHoldTime: number;
    totalTrades: number;
  };
}
```

**Files:**
- `lib/wallet/wallet-connector.ts` (new)
- `lib/portfolio/portfolio-tracker.ts` (new)
- `sidepanel/portfolio/PortfolioPanel.tsx` (new)

---

## Technical Dependencies

### Backend APIs
```
POST /api/analysis/token
GET  /api/analysis/suggestions
POST /api/portfolio/connect
GET  /api/portfolio/holdings
GET  /api/portfolio/analytics
```

### External APIs
- **Blockchain Data:** Helius, Alchemy, QuickNode
- **Price Data:** DexScreener API
- **Social Data:** Twitter API, LunarCrush
- **Technical Analysis:** TradingView indicators

### Wallet Integration
- MetaMask SDK
- Phantom SDK
- Coinbase Wallet SDK

---

## Testing Strategy

### Unit Tests
- [ ] Token analysis calculation
- [ ] Trading suggestion algorithm
- [ ] Portfolio P&L calculation

### Integration Tests
- [ ] Wallet connection flow
- [ ] Portfolio data fetching
- [ ] Analysis generation

### Manual Testing
- [ ] Analyze live token
- [ ] Connect wallet and view portfolio
- [ ] Verify trading suggestions accuracy

---

## Definition of Done

- [ ] All 3 stories completed
- [ ] All acceptance criteria met
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Wallet integrations working
- [ ] Code reviewed
- [ ] Documentation updated

---

## Notes

**Next Epic:** Epic 4 - Content Creation & Productivity (Phase 4)
