import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Page context types
 */
export type PageType = "dexscreener" | "coingecko" | "twitter" | "generic";

export interface TokenData {
    chain: string;
    pairAddress: string;
    tokenSymbol?: string;
    price?: string;
    volume24h?: string;
    liquidity?: string;
}

export interface PageContext {
    url: string;
    title: string;
    pageType: PageType;
    tokenData?: TokenData;
}

interface PageContextValue {
    context: PageContext | null;
    updateContext: (context: PageContext) => void;
}

const PageContextContext = createContext<PageContextValue>({
    context: null,
    updateContext: () => { },
});

export function usePageContext() {
    return useContext(PageContextContext);
}

/**
 * Provider for page context detection
 * Listens to messages from content scripts
 */
export function PageContextProvider({ children }: { children: ReactNode }) {
    const [context, setContext] = useState<PageContext | null>(null);

    useEffect(() => {
        // Listen for page context updates from content script
        const handleMessage = (message: any) => {
            if (message.type === "PAGE_CONTEXT_UPDATE") {
                setContext(message.data);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        // Request initial context
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PAGE_CONTEXT" });
            }
        });

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    return (
        <PageContextContext.Provider value={{ context, updateContext: setContext }}>
            {children}
        </PageContextContext.Provider>
    );
}
