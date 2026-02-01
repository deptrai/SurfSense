import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
	all_frames: true,
	world: "MAIN",
};

/**
 * Content script for page context detection
 * Extracts relevant data from crypto pages and sends to side panel
 */

type PageType = "dexscreener" | "coingecko" | "twitter" | "generic";

interface TokenData {
	chain: string;
	pairAddress: string;
	tokenSymbol?: string;
	price?: string;
	volume24h?: string;
	liquidity?: string;
}

interface PageContext {
	url: string;
	title: string;
	pageType: PageType;
	tokenData?: TokenData;
}

/**
 * Detect page type from URL
 */
function detectPageType(url: string): PageType {
	if (url.includes("dexscreener.com")) return "dexscreener";
	if (url.includes("coingecko.com")) return "coingecko";
	if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
	return "generic";
}

/**
 * Extract DexScreener token data from DOM
 */
function extractDexScreenerData(): TokenData | undefined {
	const url = window.location.href;
	const match = url.match(/dexscreener\.com\/([^\/]+)\/([^\/\?]+)/);

	if (!match) return undefined;

	const [, chain, pairAddress] = match;

	// Try to extract data from DOM
	// Note: DexScreener uses dynamic rendering, so selectors may need adjustment
	const tokenSymbol =
		document.querySelector('[data-test="token-symbol"]')?.textContent ||
		document.querySelector(".token-symbol")?.textContent ||
		undefined;

	const price =
		document.querySelector('[data-test="token-price"]')?.textContent ||
		document.querySelector(".token-price")?.textContent ||
		undefined;

	const volume24h =
		document.querySelector('[data-test="volume-24h"]')?.textContent ||
		document.querySelector(".volume-24h")?.textContent ||
		undefined;

	const liquidity =
		document.querySelector('[data-test="liquidity"]')?.textContent ||
		document.querySelector(".liquidity")?.textContent ||
		undefined;

	return {
		chain,
		pairAddress,
		tokenSymbol,
		price,
		volume24h,
		liquidity,
	};
}

/**
 * Extract page context based on page type
 */
function extractPageContext(): PageContext {
	const url = window.location.href;
	const title = document.title;
	const pageType = detectPageType(url);

	const context: PageContext = {
		url,
		title,
		pageType,
	};

	// Add page-specific data
	if (pageType === "dexscreener") {
		context.tokenData = extractDexScreenerData();
	}

	return context;
}

/**
 * Send context update to side panel
 */
function sendContextUpdate() {
	const context = extractPageContext();
	chrome.runtime.sendMessage({
		type: "PAGE_CONTEXT_UPDATE",
		data: context,
	});
}

// Send initial context after page load
if (document.readyState === "complete") {
	sendContextUpdate();
} else {
	window.addEventListener("load", sendContextUpdate);
}

// Listen for context requests from side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "GET_PAGE_CONTEXT") {
		sendContextUpdate();
	}
});

// Watch for DOM changes (for dynamic content like DexScreener)
const observer = new MutationObserver(() => {
	// Debounce updates
	clearTimeout((window as any).__contextUpdateTimeout);
	(window as any).__contextUpdateTimeout = setTimeout(sendContextUpdate, 1000);
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});
