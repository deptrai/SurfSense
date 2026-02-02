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
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-epics/epic-1-ai-powered-crypto-assistant.md
  - _bmad-epics/epic-2-smart-monitoring-alerts.md
  - _bmad-epics/epic-3-trading-intelligence.md
  - _bmad-epics/epic-4-content-creation-productivity.md
---

# UX Design Specification SurfSense

**Author:** Luis
**Date:** 2026-02-02

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
SurfSense 2.0 transforms from a general-purpose tool into a **specialized AI Co-pilot for Crypto Traders**. The core value proposition shifts from passive data aggregation to **proactive intelligence**—providing "Smart Monitoring," "Trading Intelligence," and "Content Creation" tools that work seamlessly alongside the trader's workflow.

### Target Users
*   **Momentum Traders:** Need real-time, "hot" information (Whale alerts, Volume spikes) to catch rapid price movements. They prioritize speed and accessibility (Extension).
*   **Cautious Investors:** Prioritize safety and due diligence. They need tools to verify contracts, detect rug pulls, and analyze long-term metrics.
*   **Content Creators:** Use the platform to generate insights and share them (charts, threads) to build their audience.

### Key Design Challenges (Web-First)
*   **Data Density vs. Clarity:** The new features (Portfolio, Market Intelligence) introduce complex data (charts, tables, metrics) that must be displayed without overwhelming the user, distinguishing this from the chat-heavy v1.
*   **Navigation Scalability:** The current chat-centric sidebar is insufficient for a multi-module application. We must integrate new functional areas (Market, Portfolio, Alerts) without burying them or cluttering the interface.
*   **Hybrid Workflow:** Users will constantly switch between "Deep Dive" analysis on the Web Dashboard and "Quick Checks" via the Extension. The experience must be consistent and synchronized.

### Design Opportunities
*   **Hybrid Interface Structure:** Transitioning the Web Dashboard from a purely "Chat UI" to a **"Hybrid Interface"** that balances **App Modules** (for data/tools) with the **AI Assistant** (for query/support). This allows distinct spaces for "doing" (Trading/Monitoring) and "asking" (Chat).
*   **Unified Design System:** Leveraging the existing Web Design System (Tailwind/Shadcn) to rapidly build the Extension UI, ensuring a consistent look and feel while reducing development effort ($18K constraint).

## Core User Experience

### Defining Experience: "The Intel Layer"
SurfSense is not where users go to *see* price (they use DexScreener for that), but where they go to *see* **The Truth**. The defining interaction is an **"Instant Reality Check"**: while the chart shows hype (FOMO), SurfSense overlays the cold, hard data (Risk/Whale movement), allowing users to verify a trade in seconds. It acts as the "Verify" step in the "Detect → Verify → Act" loop.

### User Mental Model
*   **The Old Way:** See price spike → Check Twitter (hype) → Search Contract (manual) → Check Holders → Panic/FOMO → Buy blindly.
*   **The SurfSense Way:** See price spike → **Glance at Extension (Traffic Light)**:
    *   🔴 **Red:** Ignore immediately (Rug/Honeypot). Time saved: 10 mins.
    *   🟢 **Green:** Trade with confidence.
    *   🟡 **Yellow:** "Investigate" → One click to open Web Dashboard for deep reasoning (Whale behavior, Fresh wallet movement).

### Platform Strategy
*   **Web Dashboard (Master):** The "Command Center" for Portfolio, Alert Management, and Deep Intelligence Analysis. Focuses on **textual/numerical insights** over graphical charts.
*   **Extension (Satellite):** The "Tactical" tool for instant context. Smartly advises the user based on their current active tab using the **"Symbiotic Side-Panel"** pattern (lives alongside the chart, doesn't block it).

### Experience Mechanics
1.  **Initiation:** User navigates to a token on DexScreener/Twitter.
2.  **Interaction:** Extension Badge updates color (Red/Green). User clicks for Summary Overlay.
3.  **Cross-Over:** User clicks "Open Dashboard" for deep dive (if needed). Web App opens to the exact token context.
4.  **Completion:** User executes trade on DexScreener (or bot) with full confidence.

### Success Criteria
*   **Time-to-Truth < 5s:** User determines safety (SCAM vs LEGIT) within 5 seconds of landing on a chart.
*   **"Savior" Frequency:** User experiences a "saved me from a rug" moment at least once per week.
*   **Zero-Context Switching:** User never manually copies a contract address; the system auto-detects context.

### Novel UX Patterns
*   **"Evidence-First" AI:** Insights are always coupled with proof (e.g., "Bullish *because* 3 whales bought" with links to txns), avoiding "Black Box" trust issues.
*   **Traffic Light Risk Coding:** Universal color cues (Green=Safe, Yellow=Caution, Red=Danger) for Risk Scores allow scanning in < 1 second.

## Desired Emotional Response

### Primary Emotional Goals
*   **Confidence (Tự tin):** Users feel they possess "Insider Intelligence" that others missing by relying solely on charts. The AI provides the "Why" behind the price action.
*   **Calm (Bình tĩnh):** In a chaotic market (FOMO, rapid candles), SurfSense acts as a stabilizing anchor, providing "Cold Hard Data" (Risk Scores, On-chain metrics) to rationalize decision-making.
*   **Clarity (Sự rõ ràng):** Cutting through the noise of social media and complex charts to show the simple truth about a token's safety and potential.

### Emotional Journey Mapping
*   **Trigger (Alert):** **Urgency & Curiosity.** "Whale Accumulating" alert sparks immediate interest but balanced with a need to know *why*.
*   **Action (Verify):** **Reassurance.** Opening the dashboard confirms safety (Verified Contract) and validates the trend (AI Sentiment). Confusion turns into clarity.
*   **Result (Decision):** **Superiority & Relief.** User feels smarter than the herd ("I avoided a rug pull" or "I caught a trend early").

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
*   **DexScreener (Crypto):** Excellent **Data Density**. They maximize screen real estate to show price, txns, and liquidity simultaneously without clutter. *Inspiration: High-density layouts using color coding (Green/Red) to direct attention.*
*   **GMGN.ai (Crypto):** Strong **Risk Visualization**. They surface hidden risks (dev dumping, high holder concentration) prominently. *Inspiration: "Warning Badges" and "Risk Clusters" that are impossible to ignore.*
*   **Perplexity AI (Non-Crypto):** Mastering **Trust & Citations**. Every AI claim is backed by a source link. *Inspiration: SurfSense AI insights should link back to source data (e.g., "Whale bought" -> Link to Txn).*
*   **Linear (Productivity):** **Keyboard-First Navigation** and speed. *Inspiration: Power user shortcuts (Cmd+K) for quick search and navigation between modules.*

### Key Takeaways
*   **Terminal-Style Efficiency:** Use a dense, tabular view for the "Market Intelligence" module (Web Dashboard) to allow sorting/filtering of 50+ tokens instantly.
*   **No Chart, Just Intel:** Don't replicate DexScreener. Provide the "Why" (Insights) behind the "What" (Price).

## Design System Foundation

### 1.1 Design System Choice
**Shadcn/UI + Tailwind CSS** (Confirmed Existing Stack).

### Rationale for Selection
*   **Consistency:** The existing `surfsense_web` frontend already utilizes Tailwind CSS (v4) and Shadcn/UI components (Radix primitives). Maintaining this stack ensures zero friction between the current codebase and new v2 features.
*   **Inheritance:** The Extension (Slave) will directly inherit color tokens and typography from the Web Dashboard's `tailwind.config.js`, ensuring a unified brand experience with minimal effort.

### Implementation Approach
*   **Web-First Truth:** The Web Dashboard remains the "Master" for design tokens and component definitions.
*   **Dark Mode Native:** The system is already optimized for Dark Mode, which aligns perfectly with the crypto trading persona.
*   **Customization:** Extend default Shadcn theme with "Signal Colors" (Neon Green, Alert Red) for financial data visualization.

## Visual Design Foundation

### Color System
*   **Core Palette (Inherited):** Maintain established `globals.css` structure (OKLCH variables) for 100% implementation speed.
    *   Background: `oklch(0.145 0 0)` (Dark Gray) for enterprise-grade stability.
    *   Foreground: `oklch(0.985 0 0)` (White).
*   **Signal Colors (New):** High-saturation "Neon" variants for "Traffic Light" indicators in Dark Mode.
    *   🟢 **Success:** `oklch(0.6 0.18 145)` (Neon Green) - Use for "Safe", "Verified", "Buy Signal".
    *   🔴 **Danger:** `oklch(0.6 0.2 25)` (Neon Red) - Use for "Scam", "Rug Risk", "Sell Signal".
    *   🟡 **Warning:** `oklch(0.8 0.15 85)` (Amber) - Use for "Caution", "Low Liquidity".

### Typography System
*   **Primary Font:** **Geist Sans** (Inherited).
    *   *Rationale:* Optimized for Vercel/Next.js stack, zero layout shift, and includes excellent **tabular figures** for price data.
    *   *Usage:* All UI text, headers, and especially data tables.
*   **Tone:** Professional, direct, data-first. No decorative serifs.

### Spacing & Layout Foundation
*   **Base Unit:** `0.25rem` (4px). Standard Tailwind grid.
*   **Radius:** `0.625rem` (Default) for cards/inputs to match existing Web UI.
*   **Density Strategy:**
    *   **Extension:** "Standard" density for touch/click friendliness.
    *   **Market Intelligence (Web):** "Compact" density to maximize rows per screen (Terminal feel).

### Accessibility Considerations
*   **High Contrast Signals:** Prioritize distinctive colors for status indicators (Red/Green) but ensure they are accompanied by text/icon labels (not color-only) to support color-blind users.
*   **Dark Mode Optimization:** Ensure text contrast remains high (AA standard) against the dark gray background.
