/**
 * Mock data for testing SurfSense Extension UI
 * Remove or disable in production
 */

import type { TokenData } from "../context/PageContextProvider";
import type { WatchlistToken, WatchlistAlert } from "../crypto/WatchlistPanel";
import type { SafetyFactor } from "../crypto/SafetyScoreDisplay";
import type { AlertConfig } from "../crypto/AlertConfigModal";
import type { WhaleTransaction } from "../whale/WhaleActivityFeed";

// ============================================
// MOCK TOKEN DATA (DexScreener)
// ============================================

export const MOCK_TOKEN_DATA: TokenData & {
    priceChange24h: number;
    marketCap: string;
    tokenName: string;
} = {
    chain: "solana",
    pairAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    tokenSymbol: "BULLA",
    tokenName: "Bulla Token",
    price: "$0.00001234",
    priceChange24h: 156.7,
    volume24h: "$1.2M",
    liquidity: "$450K",
    marketCap: "$2.1M",
};

export const MOCK_TOKEN_DATA_BEARISH: TokenData & {
    priceChange24h: number;
    marketCap: string;
    tokenName: string;
} = {
    chain: "ethereum",
    pairAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenSymbol: "REKT",
    tokenName: "Rekt Token",
    price: "$0.00000042",
    priceChange24h: -78.5,
    volume24h: "$89K",
    liquidity: "$12K",
    marketCap: "$156K",
};

// ============================================
// MOCK SAFETY ANALYSIS
// ============================================

export const MOCK_SAFETY_SCORE = 72;

export const MOCK_SAFETY_FACTORS: SafetyFactor[] = [
    // Positive factors
    {
        category: "Liquidity",
        status: "positive",
        description: "Liquidity pool is locked for 12 months",
    },
    {
        category: "Contract",
        status: "positive",
        description: "Contract is verified on Solscan",
    },
    {
        category: "Age",
        status: "positive",
        description: "Token has been active for 45 days",
    },
    // Warning factors
    {
        category: "Holders",
        status: "warning",
        description: "Top 10 holders own 35% of supply",
    },
    {
        category: "Volume",
        status: "warning",
        description: "Trading volume decreased 40% in last 24h",
    },
    // Danger factors
    {
        category: "Mint Authority",
        status: "danger",
        description: "Mint authority is NOT revoked - tokens can be minted",
    },
];

export const MOCK_SAFETY_SOURCES = [
    "RugCheck.xyz",
    "GoPlus Security",
    "Solscan",
    "DexScreener",
];

// ============================================
// MOCK WATCHLIST
// ============================================

export const MOCK_WATCHLIST_TOKENS: WatchlistToken[] = [
    {
        id: "1",
        symbol: "BULLA",
        name: "Bulla Token",
        chain: "solana",
        contractAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        price: "$0.00001234",
        priceChange24h: 156.7,
        hasAlerts: true,
        alertCount: 2,
    },
    {
        id: "2",
        symbol: "BONK",
        name: "Bonk",
        chain: "solana",
        contractAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        price: "$0.00002156",
        priceChange24h: 12.3,
        hasAlerts: true,
        alertCount: 1,
    },
    {
        id: "3",
        symbol: "WIF",
        name: "dogwifhat",
        chain: "solana",
        contractAddress: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        price: "$2.45",
        priceChange24h: -5.2,
        hasAlerts: false,
    },
    {
        id: "4",
        symbol: "PEPE",
        name: "Pepe",
        chain: "ethereum",
        contractAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        price: "$0.00001089",
        priceChange24h: 8.7,
        hasAlerts: false,
    },
    {
        id: "5",
        symbol: "DEGEN",
        name: "Degen",
        chain: "base",
        contractAddress: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
        price: "$0.0156",
        priceChange24h: -15.3,
        hasAlerts: true,
        alertCount: 3,
    },
];

export const MOCK_WATCHLIST_ALERTS: WatchlistAlert[] = [
    {
        id: "alert-1",
        tokenSymbol: "BULLA",
        type: "price",
        message: "BULLA price increased above $0.00001 (+156%)",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        isRead: false,
    },
    {
        id: "alert-2",
        tokenSymbol: "BULLA",
        type: "whale",
        message: "Large transaction detected: 500M BULLA ($6,170) transferred",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        isRead: false,
    },
    {
        id: "alert-3",
        tokenSymbol: "DEGEN",
        type: "volume",
        message: "DEGEN volume spike: 5x average in last hour",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        isRead: true,
    },
    {
        id: "alert-4",
        tokenSymbol: "BONK",
        type: "liquidity",
        message: "BONK liquidity increased by 25% ($1.2M added)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: true,
    },
    {
        id: "alert-5",
        tokenSymbol: "DEGEN",
        type: "price",
        message: "DEGEN dropped below $0.02 (-15%)",
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        isRead: true,
    },
];

// ============================================
// MOCK WHALE TRANSACTIONS
// ============================================

export const MOCK_WHALE_TRANSACTIONS: WhaleTransaction[] = [
    {
        id: "whale-1",
        tokenSymbol: "BULLA",
        tokenName: "Bulla Token",
        chain: "solana",
        type: "buy",
        amountUSD: 100000,
        amountTokens: "8.1B",
        walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        txHash: "5Kn8WqXZKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqYqKqYq",
        timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
        isSmartMoney: true,
        isInWatchlist: true,
    },
    {
        id: "whale-2",
        tokenSymbol: "BONK",
        tokenName: "Bonk",
        chain: "solana",
        type: "sell",
        amountUSD: 50000,
        amountTokens: "2.3B",
        walletAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        txHash: "3Hn7WpXZKpYpKpYpKpYpKpYpKpYpKpYpKpYpKpYpKpYp",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        isSmartMoney: false,
        isInWatchlist: true,
    },
    {
        id: "whale-3",
        tokenSymbol: "PEPE",
        tokenName: "Pepe",
        chain: "ethereum",
        type: "buy",
        amountUSD: 250000,
        amountTokens: "23B",
        walletAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
        isSmartMoney: true,
        isInWatchlist: true,
    },
    {
        id: "whale-4",
        tokenSymbol: "WIF",
        tokenName: "dogwifhat",
        chain: "solana",
        type: "buy",
        amountUSD: 75000,
        amountTokens: "30.6K",
        walletAddress: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        txHash: "4Jm6VoXYJoXoJoXoJoXoJoXoJoXoJoXoJoXoJoXoJoXo",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        isSmartMoney: false,
        isInWatchlist: true,
    },
    {
        id: "whale-5",
        tokenSymbol: "DEGEN",
        tokenName: "Degen",
        chain: "base",
        type: "sell",
        amountUSD: 35000,
        amountTokens: "2.2M",
        walletAddress: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
        txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
        isSmartMoney: false,
        isInWatchlist: true,
    },
    {
        id: "whale-6",
        tokenSymbol: "SOL",
        tokenName: "Solana",
        chain: "solana",
        type: "buy",
        amountUSD: 500000,
        amountTokens: "5K",
        walletAddress: "So11111111111111111111111111111111111111112",
        txHash: "6Lp7XqYZLqZqLqZqLqZqLqZqLqZqLqZqLqZqLqZqLqZq",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        isSmartMoney: true,
        isInWatchlist: false,
    },
    {
        id: "whale-7",
        tokenSymbol: "MATIC",
        tokenName: "Polygon",
        chain: "ethereum",
        type: "buy",
        amountUSD: 150000,
        amountTokens: "200K",
        walletAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        txHash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        isSmartMoney: false,
        isInWatchlist: false,
    },
];

// ============================================
// MOCK ALERT CONFIGS
// ============================================

export const MOCK_ALERT_CONFIGS: AlertConfig[] = [
    { type: "price_above", threshold: 0.00002, enabled: true },
    { type: "price_below", threshold: 0.000005, enabled: true },
    { type: "price_change", threshold: 20, enabled: false },
    { type: "volume", threshold: 3, enabled: true },
    { type: "whale", threshold: 10000, enabled: false },
    { type: "liquidity", threshold: 30, enabled: false },
    { type: "holder_concentration", threshold: 50, enabled: false },
];

// ============================================
// MOCK SEARCH SPACES
// ============================================

export const MOCK_SEARCH_SPACES = [
    { id: "crypto", name: "Crypto", icon: "🪙" },
    { id: "general", name: "General", icon: "📚" },
    { id: "research", name: "Research", icon: "🔬" },
    { id: "defi", name: "DeFi", icon: "💰" },
    { id: "nft", name: "NFT", icon: "🖼️" },
];

// ============================================
// MOCK CHAT MESSAGES
// ============================================

export const MOCK_CHAT_MESSAGES = [
    {
        id: "msg-1",
        role: "user" as const,
        content: "Is BULLA token safe to invest?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: "msg-2",
        role: "assistant" as const,
        content: `Based on my analysis of BULLA token, here's what I found:

**Safety Score: 72/100** ⚠️ Medium Risk

**✅ Positive Signals:**
- Liquidity is locked for 12 months
- Contract is verified
- Active for 45 days

**⚠️ Warnings:**
- Top 10 holders own 35% of supply
- Volume decreased 40% recently

**🚨 Red Flags:**
- Mint authority is NOT revoked

**Recommendation:** Proceed with caution. The unlocked mint authority is a significant risk factor.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        thinkingSteps: [
            { id: "1", type: "thinking" as const, title: "Understanding your question...", isComplete: true },
            { id: "2", type: "searching" as const, title: "Fetching token data from DexScreener...", isComplete: true },
            { id: "3", type: "analyzing" as const, title: "Running safety analysis...", isComplete: true },
            { id: "4", type: "complete" as const, title: "Analysis complete", isComplete: true },
        ],
    },
];

// ============================================
// FEATURE FLAGS
// ============================================

export const MOCK_MODE = {
    /** Enable mock data for development/testing */
    enabled: true,
    /** Simulate DexScreener page context */
    simulateDexScreener: true,
    /** Show mock watchlist data */
    showWatchlist: true,
    /** Show mock alerts */
    showAlerts: true,
};

