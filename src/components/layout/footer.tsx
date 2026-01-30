import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">SwagChain</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Premium crypto merch. Pay with crypto via Kira-Pay.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/?category=Hoodies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=T-Shirts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Accessories"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=orders"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=cart"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Payment</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                Powered by{" "}
                <a
                  href="https://kira-pay.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Kira-Pay
                </a>
              </li>
              <li>ETH, USDC, USDT</li>
              <li>Secure & Fast</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SwagChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
