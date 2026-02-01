import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/routes/ui/button";

interface ChatInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

/**
 * Chat input component with send button
 */
export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t p-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder || "Type a message..."}
                    disabled={disabled}
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" size="icon" disabled={disabled || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
