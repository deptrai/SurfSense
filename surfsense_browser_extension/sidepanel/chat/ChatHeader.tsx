import { Settings } from "lucide-react";
import { Button } from "@/routes/ui/button";

/**
 * Chat header with branding and settings
 */
export function ChatHeader() {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <img
                    src="/assets/icon.png"
                    alt="SurfSense"
                    className="w-6 h-6"
                />
                <h1 className="font-semibold text-lg">SurfSense</h1>
            </div>

            <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
            </Button>
        </div>
    );
}
