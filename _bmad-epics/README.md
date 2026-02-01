# SurfSense 2.0 - Epics & Stories

**Project:** SurfSense Crypto Co-Pilot  
**Created:** 2026-02-01  
**Status:** Planning Complete

---

## Overview

Tài liệu này tổ chức tất cả epics và user stories cho SurfSense 2.0, được chia thành 4 phases dựa trên PRD.

---

## Epic Summary

| Epic | Phase | Stories | Status | Priority | Duration |
|------|-------|---------|--------|----------|----------|
| [Epic 1: Extension Core Infrastructure](./epic-1-extension-core-infrastructure.md) | Phase 1 | 6 | ✅ COMPLETED | P0 | 2 weeks |
| [Epic 2: Smart Monitoring & Alerts](./epic-2-smart-monitoring-alerts.md) | Phase 2 | 3 | 📋 PLANNED | P0 | 2 weeks |
| [Epic 3: Trading Intelligence](./epic-3-trading-intelligence.md) | Phase 3 | 3 | 📋 PLANNED | P1 | 2 weeks |
| [Epic 4: Content Creation & Productivity](./epic-4-content-creation-productivity.md) | Phase 4 | 3 | 📋 PLANNED | P2 | 2 weeks |

**Total:** 4 epics, 15 user stories, 8 weeks

---

## Phase 1: Extension Core Infrastructure ✅

**Epic 1** - Foundation cho tất cả features

### Stories:
1. **Story 1.1:** Side Panel Architecture (FR-EXT-01)
2. **Story 1.2:** AI Chat Interface Integration (FR-EXT-02)
3. **Story 1.3:** Page Context Detection (FR-EXT-03)
4. **Story 1.4:** DexScreener Smart Integration (FR-EXT-04)
5. **Story 1.5:** Quick Capture (FR-EXT-05)
6. **Story 1.6:** Settings Sync với Frontend (FR-EXT-06)

**Key Deliverables:**
- ✅ Chrome Side Panel working
- ✅ AI chat interface integrated
- ✅ Context detection for DexScreener
- ✅ Token info card
- ✅ Quick capture button
- ✅ Settings sync infrastructure

---

## Phase 2: Smart Monitoring & Alerts 📋

**Epic 2** - Risk protection & opportunity alerts

### Stories:
1. **Story 2.1:** Real-time Price Alerts (FR-EXT-07)
2. **Story 2.2:** Whale Activity Tracker (FR-EXT-08)
3. **Story 2.3:** Rug Pull Early Warning System (FR-EXT-09)

**Key Deliverables:**
- Watchlist management
- Price/volume/liquidity alerts
- Browser notifications
- Whale transaction monitoring
- Rug pull risk assessment
- Risk score display

**Business Value:** Risk protection = User trust

---

## Phase 3: Trading Intelligence 📋

**Epic 3** - AI-powered trading insights

### Stories:
1. **Story 3.1:** One-Click Token Analysis (FR-EXT-10)
2. **Story 3.2:** Smart Entry/Exit Suggestions (FR-EXT-11)
3. **Story 3.3:** Portfolio Tracker Integration (FR-EXT-12)

**Key Deliverables:**
- Comprehensive token analysis
- AI-generated summaries
- Entry/exit suggestions
- Risk/reward calculations
- Wallet connection
- Portfolio tracking
- P&L analytics

**Business Value:** Better decisions = Better results = Happy users

---

## Phase 4: Content Creation & Productivity 📋

**Epic 4** - Tools for creators & power users

### Stories:
1. **Story 4.1:** Chart Screenshot with Annotations (FR-EXT-13)
2. **Story 4.2:** AI Thread Generator (FR-EXT-14)
3. **Story 4.3:** Quick Actions & Productivity (FR-EXT-15, 16, 17)

**Key Deliverables:**
- Chart capture & annotation
- Drawing tools
- AI thread generation
- Context menu quick actions
- Smart notifications
- Keyboard shortcuts

**Business Value:** Content creation = Viral marketing

---

## Implementation Roadmap

### Week 1-2: Phase 1 ✅
- [x] Side panel architecture
- [x] Chat interface
- [x] Context detection
- [x] DexScreener integration
- [x] Quick capture
- [x] Settings sync

### Week 3-4: Phase 2 (Next)
- [ ] Watchlist & alerts
- [ ] Whale tracker
- [ ] Rug pull detection

### Week 5-6: Phase 3
- [ ] Token analysis
- [ ] Trading suggestions
- [ ] Portfolio tracker

### Week 7-8: Phase 4
- [ ] Chart capture
- [ ] Thread generator
- [ ] Productivity features

---

## Feature Responsibility Matrix

| Feature | Extension | Frontend | Sync |
|---------|-----------|----------|------|
| Model Selection | 📖 Read-only | ✏️ Full control | API |
| Search Space | 📖 Read-only | ✏️ Full control | API |
| Chat | ✅ Full UI | ✅ Full UI | API |
| Connectors | 📖 Use only | ✏️ Setup | API |
| Documents | 👁️ View | ✏️ Manage | API |
| Watchlist | ✏️ Add/Remove | ✏️ Full | Storage + API |
| Alerts | ✏️ Basic | ✏️ Full | API |
| Settings | 📖 Quick | ✏️ Full | API |

**Legend:**
- ✅ Full feature
- ✏️ Full control
- 📖 Read-only
- 👁️ View only

---

## Technical Stack

### Frontend (Extension)
- **Framework:** Plasmo (React + TypeScript)
- **UI:** @assistant-ui/react, shadcn/ui
- **State:** Plasmo Storage, React Context
- **APIs:** Chrome Extension APIs

### Backend
- **Framework:** FastAPI (Python)
- **AI:** Gemini 1.5 Flash / GPT-4o-mini
- **RAG:** Supabase (pgvector)
- **Cache:** Redis

### Data Sources
- DexScreener API
- DefiLlama API
- Helius (Solana)
- Alchemy (Ethereum)
- RugCheck API
- Token Sniffer

---

## Success Metrics

### Phase 1 (✅ COMPLETED)
- [x] Extension installable
- [x] Chat works
- [x] Context detection works
- [x] Token card displays

### Phase 2 (Target)
- [ ] 100+ tokens in watchlists
- [ ] 1000+ alerts set
- [ ] 0 false positive rug pull warnings

### Phase 3 (Target)
- [ ] 500+ token analyses
- [ ] 80%+ suggestion accuracy
- [ ] 50+ wallets connected

### Phase 4 (Target)
- [ ] 100+ charts captured
- [ ] 50+ threads generated
- [ ] 200+ daily shortcut uses

---

## Next Steps

1. ✅ **Epic 1 Complete** - Phase 1 infrastructure done
2. 🎯 **Start Epic 2** - Begin Phase 2 implementation
3. 📝 **Create Stories** - Break down Epic 2 into individual story files
4. 🚀 **Sprint Planning** - Plan 2-week sprint for Phase 2

---

## Related Documents

- [PRD](../_bmad-output/planning-artifacts/prd.md)
- [Extension UX Strategy](../.gemini/antigravity/brain/02a071c7-57fc-4f43-a2e8-516ac511579a/extension-ux-integration-strategy.md)
- [Extension Technical Spec](../.gemini/antigravity/brain/02a071c7-57fc-4f43-a2e8-516ac511579a/extension-sidepanel-technical-spec.md)
- [Feature Brainstorming](../.gemini/antigravity/brain/02a071c7-57fc-4f43-a2e8-516ac511579a/extension-features-brainstorming.md)
