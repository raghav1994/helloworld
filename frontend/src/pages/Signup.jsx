import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { User, Mail, Phone, KeyRound, ArrowRight } from "lucide-react";

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const update = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const res = await register(form);
        setBusy(false);
        if (res.ok) navigate("/onboarding");
        else setError(res.error);
    };

    return (
        <div className="min-h-screen grain">
            <NavBar />
            <div className="max-w-md mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-32">
                <div className="reveal">
                    <span className="text-xs tracking-[0.22em] uppercase text-zinc-500">
                        First 1,000 creators
                    </span>
                    <h1 className="font-display mt-3 text-4xl sm:text-5xl tracking-tighter font-light">
                        Make perception your superpower.
                    </h1>
                </div>
                <form
                    onSubmit={submit}
                    className="glass-strong p-8 mt-10 space-y-5 reveal reveal-delay-1"
                    data-testid="signup-form"
                >
                    <Field
                        icon={User}
                        label="Full name"
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Riya Kapoor"
                        testId="signup-name"
                        required
                    />
                    <Field
                        icon={Mail}
                        type="email"
                        label="Email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@creator.studio"
                        testId="signup-email"
                        required
                    />
                    <Field
                        icon={Phone}
                        type="tel"
                        label="Phone"
                        value={form.phone}
                        onChange={update("phone")}
                        placeholder="+91 98765 43210"
                        testId="signup-phone"
                        required
                    />
                    <Field
                        icon={KeyRound}
                        type="password"
                        label="Password"
                        value={form.password}
                        onChange={update("password")}
                        placeholder="At least 8 characters"
                        testId="signup-password"
                        required
                    />
                    {error && (
                        <div
                            data-testid="signup-error"
                            className="text-sm text-[#FF2A5F] bg-[#FF2A5F]/10 border border-[#FF2A5F]/30 rounded-lg px-3 py-2"
                        >
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={busy}
                        className="btn-primary w-full justify-center"
                        data-testid="signup-submit"
                    >
                        {busy ? "Creating account…" : "Create account"}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-zinc-500 text-center">
                        Already on Pulsay?{" "}
                        <Link to="/login" className="text-[#00E5FF] hover:underline" data-testid="link-login">
                            Log in
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
