/**
 * Chat messages display component
 */
export function ChatMessages({ messages }: { messages: any[] }) {
    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Start a conversation...</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-[80%] rounded-lg p-3 ${message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                    >
                        <p className="text-sm">{message.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
