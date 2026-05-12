import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { Mail, KeyRound, ArrowRight } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const res = await login(email, password);
        setBusy(false);
        if (res.ok) {
            const dest = res.user.instagram_username ? "/dashboard" : "/onboarding";
            navigate(location.state?.from || dest);
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen grain">
            <NavBar />
            <div className="max-w-md mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-32">
                <div className="reveal">
                    <span className="text-xs tracking-[0.22em] uppercase text-zinc-500">Welcome back</span>
                    <h1 className="font-display mt-3 text-4xl sm:text-5xl tracking-tighter font-light">
                        Open your dashboard.
                    </h1>
                </div>
                <form
                    onSubmit={submit}
                    className="glass-strong p-8 mt-10 space-y-5 reveal reveal-delay-1"
                    data-testid="login-form"
                >
                    <Field
                        icon={Mail}
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@creator.studio"
                        testId="login-email"
                        required
                    />
                    <Field
                        icon={KeyRound}
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••"
                        testId="login-password"
                        required
                    />
                    {error && (
                        <div
                            data-testid="login-error"
                            className="text-sm text-[#FF2A5F] bg-[#FF2A5F]/10 border border-[#FF2A5F]/30 rounded-lg px-3 py-2"
                        >
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={busy}
                        className="btn-primary w-full justify-center"
                        data-testid="login-submit"
                    >
                        {busy ? "Logging in…" : "Log in"} <ArrowRight className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-zinc-500 text-center">
                        New here?{" "}
                        <Link to="/signup" className="text-[#00E5FF] hover:underline" data-testid="link-signup">
                            Create your account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ icon: Icon, label, type = "text", value, onChange, placeholder, testId, required }) {
    return (
        <label className="block">
            <span className="text-[11px] tracking-[0.18em] uppercase text-zinc-500">{label}</span>
            <div className="relative mt-2">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="input-glass pl-10"
                    data-testid={testId}
                />
            </div>
        </label>
    );
}
