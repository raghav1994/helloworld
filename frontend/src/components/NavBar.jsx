import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Activity, LogOut } from "lucide-react";

export default function NavBar() {
    const { user, status, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const onAuthPage = pathname === "/login" || pathname === "/signup";

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav
            data-testid="navbar"
            className="sticky top-0 z-40 backdrop-blur-xl bg-[#05050A]/70 border-b border-white/[0.06]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group" data-testid="brand-link">
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                        <Activity className="h-4 w-4 text-[#00E5FF]" />
                        <span className="absolute inset-0 rounded-full pulse-ring border border-[#00E5FF]/40" />
                    </span>
                    <span className="font-display text-xl tracking-tight">Pulsay</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
                    <a href="/#features" className="hover:text-white transition-colors">
                        Features
                    </a>
                    <a href="/#how" className="hover:text-white transition-colors">
                        How it works
                    </a>
                    <a href="/#pricing" className="hover:text-white transition-colors">
                        Pricing
                    </a>
                </div>

                <div className="flex items-center gap-2">
                    {status === "authed" && user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="btn-glass text-sm"
                                data-testid="nav-dashboard"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn-glass text-sm"
                                data-testid="nav-logout"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        !onAuthPage && (
                            <>
                                <Link to="/login" className="btn-glass text-sm" data-testid="nav-login">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-primary text-sm"
                                    data-testid="nav-signup"
                                >
                                    Get early access
                                </Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}
