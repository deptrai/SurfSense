import { useState } from "react";
import { usePageContext } from "../context/PageContextProvider";
import { TokenInfoCard } from "../dexscreener/TokenInfoCard";
import { QuickCapture } from "./QuickCapture";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

/**
 * Main chat interface for side panel
 * Adapts UI based on page context (e.g., shows token card on DexScreener)
 */
export function ChatInterface() {
    const { context } = usePageContext();
    const [messages, setMessages] = useState<any[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const handleSendMessage = async (content: string) => {
        // TODO: Implement message sending with backend API
        console.log("Sending message:", content);
        setIsStreaming(true);

        // Add user message
        setMessages((prev) => [
            ...prev,
            {
                id: `msg-${Date.now()}`,
                role: "user",
                content,
                timestamp: new Date(),
            },
        ]);

        // TODO: Stream response from backend
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    role: "assistant",
                    content: "This is a placeholder response. Backend integration coming soon!",
                    timestamp: new Date(),
                },
            ]);
            setIsStreaming(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <ChatHeader />

            {/* Token info card (only on DexScreener) */}
            {context?.pageType === "dexscreener" && context.tokenData && (
                <TokenInfoCard tokenData={context.tokenData} />
            )}

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto">
                <ChatMessages messages={messages} />
            </div>

            {/* Chat input */}
            <ChatInput
                onSend={handleSendMessage}
                disabled={isStreaming}
                placeholder={
                    context?.pageType === "dexscreener"
                        ? "Ask about this token..."
                        : "Ask me anything..."
                }
            />

            {/* Quick capture button */}
            <QuickCapture />
        </div>
    );
}
