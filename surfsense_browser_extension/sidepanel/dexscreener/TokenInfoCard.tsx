import type { TokenData } from "../context/PageContextProvider";
import { Button } from "@/routes/ui/button";
import { TrendingUp, Shield, Users } from "lucide-react";

interface TokenInfoCardProps {
    tokenData: TokenData;
}

/**
 * Token info card displayed when viewing DexScreener
 * Shows quick token stats and action buttons
 */
export function TokenInfoCard({ tokenData }: TokenInfoCardProps) {
    const handleQuickAction = (action: string) => {
        // TODO: Implement quick actions
        console.log("Quick action:", action, tokenData);
    };

    return (
        <div className="border-b p-4 bg-muted/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">🪙</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">
                        {tokenData.tokenSymbol || "Unknown Token"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {tokenData.chain} • {tokenData.pairAddress.slice(0, 8)}...
                    </p>
                </div>
            </div>

            {/* Token stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div>
                    <span className="text-muted-foreground block text-xs">Price</span>
                    <p className="font-medium">{tokenData.price || "—"}</p>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs">24h Vol</span>
                    <p className="font-medium">{tokenData.volume24h || "—"}</p>
                </div>
                <div>
                    <span className="text-muted-foreground block text-xs">Liquidity</span>
                    <p className="font-medium">{tokenData.liquidity || "—"}</p>
                </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 mt-3">
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleQuickAction("safety")}
                >
                    <Shield className="mr-1 h-3 w-3" />
                    Safety
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleQuickAction("holders")}
                >
                    <Users className="mr-1 h-3 w-3" />
                    Holders
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleQuickAction("prediction")}
                >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Predict
                </Button>
            </div>
        </div>
    );
}
