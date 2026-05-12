import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiresOnboarding = false }) {
    const { user, status } = useAuth();
    if (status === "checking") {
        return (
            <div
                data-testid="auth-checking"
                className="min-h-screen grid place-items-center text-zinc-500"
            >
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#00E5FF] pulse-ring" />
                    Loading…
                </div>
            </div>
        );
    }
    if (status !== "authed" || !user) return <Navigate to="/login" replace />;
    if (requiresOnboarding && !user.instagram_username)
        return <Navigate to="/onboarding" replace />;
    return children;
}
