---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 14
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-epics/epic-1-ai-powered-crypto-assistant.md
  - _bmad-epics/epic-2-smart-monitoring-alerts.md
  - _bmad-epics/epic-3-trading-execution-safety.md
  - _bmad-epics/epic-4-adaptive-learning-evolution.md
outputDocument: _bmad-output/planning-artifacts/ux-design-specification.md

# UX Design Specification: SurfSense v2

## 1. Design Strategy
**"Evolution, Not Revolution"**
- **Core Philosophy:** SurfSense v2 features will be "grafted" (injected) into the existing Research Dashboard rather than replacing it.
- **Goal:** Maintain the professional, clean utility of the current "SaaS-style" research tool while adding "Crypto-Native" signals only where critical (the "Intel Layer").
- **Visual Identity:** "Smart Cards" & "Traffic Lights" embedded in a Clean UI.

## 2. Core User Experience
**The "Intel Layer" Concept**
- **Problem:** Users have to switch contexts between Charts (DexScreener) and Safety Scans (Scanners/Twitter).
- **Solution:** A hybrid "Intel Layer" that sits *on top* of the chart or *inside* the research chat.
- **Mental Model:** "Traffic Light System" (Red/Green/Yellow).
    - 🔴 **Stop:** Scam/Rug/High Risk. (Immediate Action: Ignore)
    - 🟢 **Go:** Safe/Whale Buying. (Immediate Action: Ape in/Research)
    - 🟡 **Caution:** Mixed signals. (Action: Open Dashboard for Deep Dive)

**Key Mechanics:**
1.  **Initiation:** Extension detects Token URL -> Shows Traffic Light Badge.
2.  **Interaction:** Click Badge -> Opens Overlay (Summary).
3.  **Deep Dive:** "Ask SurfSense" -> Redirects to existing Web Dashboard (Port 3999).
4.  **Integration:** Inside the Chat Interface, AI answers are formatted as **Rich UI Cards**, not just text.

## 3. Visual Foundation (Confirmed Step 8 & 9)
**Tokens & Theming**
- **Source of Truth:** Inherited from existing `surfsense_web` (`globals.css` + Tailwind v4).
- **Base Theme:** Dark Mode (Deep Navy / `#0B1221`) to match crypto aesthetic but cleaner.
- **Typography:** Inter (Sans) for UI, Geist Mono for Data/Numbers.

**Color Palette Extension (The "Traffic Light" Overlay)**
*   **Success (Buy/Safe):** `#22c55e` (Green-500) - Solid, trustworthy.
*   **Danger (Scam/Sell):** `#f43f5e` (Rose-500) - Urgent, alarming.
*   **Warning (Volatility):** `#f59e0b` (Amber-500) - Cautionary.
*   **Whale (Institutional):** `#3b82f6` (Blue-500) - Consistent with brand.

## 4. Component Strategy (Smart Cards)
Instead of building a full trading terminal, we build **"Injectable Components"**:
1.  **Signal Card:** Used in Chat & Extension. Shows Risk Score + 3 Key Bullets.
2.  **Whale Alert Row:** Used in Lists & Notifications. Shows "Wallet X bought $50K".
3.  **Mini-Chart:** Sparklines only, for quick trend context.

## 5. Mobile & Responsive
- **Extension:** Fixed width (360px-400px), focused on "At-a-glance" data.
- **Web Dashboard:** Responsive, but optimized for Desktop Research. Mobile view converts Tables to Cards.

## 6. Implementation Notes
- **Frontend:** Next.js (Port 3999). Use standard Tailwind classes.
- **Backend:** FastAPI (Port 3998). Serves structured JSON for UI Cards.
- **Extension:** Chrome Side Panel API. Shares UI components with Web via Repo Monorepo/Shared Lib structure.

---
**Status:** ✅ APPROVED
**Next Steps:** Proceed to Architecture Design to map these UI components to Backend APIs.
