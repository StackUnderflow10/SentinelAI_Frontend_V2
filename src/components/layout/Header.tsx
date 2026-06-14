import { useState } from "react";
import {
  ScanSearch,
  Wallet,
  LogIn,
  LogOut,
  X,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { login, logout, getToken } from "../../api/scanner";
import type { AuthUser } from "../../types";

// ---------------------------------------------------------------------------
// Login Modal
// ---------------------------------------------------------------------------

function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await login({ username: username.trim(), password });
      onSuccess(user);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bgMain/80 backdrop-blur-sm px-4">
      <div className="bg-bgRaised border border-line rounded-2xl w-full max-w-sm p-6 flex flex-col gap-5 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-inkDim hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accentAmber mb-2">
            Sentinel AI
          </p>
          <h2 className="font-display font-extrabold text-xl text-ink">
            Sign in
          </h2>
          <p className="text-inkDim text-sm mt-1">
            Use your Sentinel account credentials.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-inkDim tracking-widest uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your_username"
              className="bg-bgMain border border-line rounded-lg px-4 py-2.5 text-ink text-sm font-mono outline-none focus:border-accentAmber transition-colors placeholder:text-inkDim"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-inkDim tracking-widest uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-bgMain border border-line rounded-lg px-4 py-2.5 text-ink text-sm font-mono outline-none focus:border-accentAmber transition-colors placeholder:text-inkDim pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-inkDim hover:text-ink transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="font-mono text-xs text-errorRed border border-errorBg bg-errorRed/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-accentAmber text-bgMain font-mono font-bold text-sm px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in…
            </>
          ) : (
            <>
              <LogIn size={16} /> Sign in
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wallet pill (Solana — UI shell)
// ---------------------------------------------------------------------------

function WalletPill() {
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-full border transition-colors ${
          connected
            ? "text-accentCyan border-accentCyan"
            : "text-inkDim border-line hover:border-accentAmber"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <Wallet size={13} />
        {connected ? "8fK3…qP2x" : "Connect wallet"}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-bgRaised border border-line rounded-xl p-4 z-30 flex flex-col gap-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-inkDim">
            API credits
          </p>
          <p className="text-xs text-inkDim leading-relaxed">
            Link a Solana wallet to pay for Sentinel API usage in SOL or USDC.
            Pay-as-you-go, no subscription.
          </p>
          {!connected ? (
            <button
              className="w-full bg-accentAmber text-bgMain font-mono font-bold text-xs py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => {
                setConnected(true);
                setOpen(false);
              }}
            >
              Connect Phantom
            </button>
          ) : (
            <div className="flex justify-between items-center font-mono text-sm border-t border-line pt-3">
              <span className="text-inkDim">Balance</span>
              <strong className="text-accentCyan">12.4 USDC</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(
    // Rehydrate from localStorage on mount
    getToken() ? { username: "User", token: getToken()! } : null
  );

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <>
      <header className="flex items-center justify-between px-5 py-4 border-b border-line bg-bgMain z-40 sticky top-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center bg-accentAmber text-bgMain rounded-md">
            <ScanSearch size={17} strokeWidth={2.5} />
          </div>
          <span className="font-mono font-bold tracking-widest text-[13px] text-ink">
            SENTINEL
          </span>
          <span className="font-mono text-[10px] text-inkDim tracking-widest border border-line rounded px-1.5 py-0.5">
            AI
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <WalletPill />

          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-inkDim hidden sm:block">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-mono text-xs border border-line text-inkDim px-3 py-2 rounded-full hover:text-errorRed hover:border-errorBg transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={13} />
                <span className="hidden sm:block">Sign out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-1.5 font-mono text-xs border border-line text-inkDim px-4 py-2 rounded-full hover:border-accentAmber hover:text-ink transition-colors"
            >
              <LogIn size={13} />
              Sign in
            </button>
          )}
        </div>
      </header>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(u) => {
            setUser(u);
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
}