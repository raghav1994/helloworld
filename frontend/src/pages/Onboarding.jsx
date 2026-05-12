import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Sparkles, ArrowRight, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api, formatApiErrorDetail } from "../lib/api";
import NavBar from "../components/NavBar";

const SCAN_STEPS = [
    "Fetching public profile…",
    "Pulling latest 30 posts…",
    "Reading recent comments…",
    "Scoring sentiment per comment…",
    "Detecting spikes & anomalies…",
    "Clustering perception narratives…",
    "Generating AI recommendations…",
];

export default function Onboarding() {
    const { user, refresh } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [provider, setProvider] = useState("anthropic");
    const [scanning, setScanning] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.instagram_username) navigate("/dashboard");
    }, [user, navigate]);

    useEffect(() => {
        if (!scanning) return;
        const id = setInterval(() => {
            setStepIndex((i) => (i < SCAN_STEPS.length - 1 ? i + 1 : i));
        }, 1100);
        return () => clearInterval(id);
    }, [scanning]);

    const submit = async (e) => {
        e.preventDefault();
        if (!username) return;
        setError("");
        setScanning(true);
        setStepIndex(0);
        try {
            await api.post("/pulsay/connect", { username, provider });
            await refresh();
            navigate("/dashboard");
        } catch (e) {
            setError(formatApiErrorDetail(e.response?.data?.detail) || e.message);
            setScanning(false);
        }
    };

    return (
        <div className="min-h-screen grain">
            <NavBar />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-32">
                <div className="reveal">
                    <span className="text-xs tracking-[0.22em] uppercase text-zinc-500">
                        Step 2 · Connect Instagram
                    </span>
                    <h1 className="font-display mt-3 text-4xl sm:text-5xl tracking-tighter font-light">
                        Type your @handle. <span className="text-zinc-500">We'll do the rest.</span>
                    </h1>
                    <p className="mt-4 text-zinc-400">
                        Pulsay only reads public posts &amp; comments. No OAuth, no permissions, no DMs.
                    </p>
                </div>

                {!scanning ? (
                    <form
                        onSubmit={submit}
                        className="glass-strong p-8 mt-10 space-y-5 reveal reveal-delay-1"
                        data-testid="connect-ig-form"
                    >
                        <label className="block">
                            <span className="text-[11px] tracking-[0.18em] uppercase text-zinc-500">
                                Instagram username
                            </span>
                            <div className="relative mt-2">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                <input
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-glass pl-10"
                                    placeholder="@username"
                                    data-testid="connect-ig-input"
                                    required
                                />
                            </div>
                        </label>

                        <fieldset>
                            <legend className="text-[11px] tracking-[0.18em] uppercase text-zinc-500">
                                AI engine
                            </legend>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {[
                                    { id: "anthropic", label: "Claude 4.5" },
                                    { id: "openai", label: "GPT-5.2" },
                                    { id: "gemini", label: "Gemini 3" },
                                ].map((p) => (
                                    <button
                                        type="button"
                                        key={p.id}
                                        onClick={() => setProvider(p.id)}
                                        data-testid={`provider-${p.id}`}
                                        className={`px-3 py-2 rounded-lg text-sm border transition ${
                                            provider === p.id
                                                ? "bg-[#00E5FF]/10 border-[#00E5FF]/40 text-white"
                                                : "bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:text-white"
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        {error && (
                            <div
                                data-testid="connect-error"
                                className="text-sm text-[#FF2A5F] bg-[#FF2A5F]/10 border border-[#FF2A5F]/30 rounded-lg px-3 py-2"
                            >
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn-primary w-full justify-center"
                            data-testid="connect-ig-submit"
                        >
                            <Sparkles className="h-4 w-4" /> Analyse my perception{" "}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <div className="text-[11px] text-zinc-600 font-mono text-center">
                            We never post on your behalf · public data only
                        </div>
                    </form>
                ) : (
                    <ScanningCard username={username} stepIndex={stepIndex} />
                )}
            </div>
        </div>
    );
}

function ScanningCard({ username, stepIndex }) {
    return (
        <div
            className="glass-strong p-10 mt-10 reveal reveal-delay-1 relative overflow-hidden"
            data-testid="scanning-card"
        >
            <div className="absolute inset-0 -z-10 opacity-50">
                <div
                    className="absolute -top-1/3 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 50%, rgba(0,229,255,0.25), transparent 70%)",
                        filter: "blur(40px)",
                    }}
                />
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="relative h-32 w-32 grid place-items-center">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className={`absolute inset-0 rounded-full border border-[#00E5FF]/40 pulse-ring ${
                                i === 1 ? "delay-1" : i === 2 ? "delay-2" : ""
                            }`}
                        />
                    ))}
                    <div className="h-16 w-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/40 grid place-items-center">
                        <Activity className="h-7 w-7 text-[#00E5FF]" />
                    </div>
                </div>
                <div className="mt-6 font-mono text-zinc-500 text-sm">@{username}</div>
                <h2 className="font-display mt-2 text-2xl sm:text-3xl tracking-tight">
                    Listening to your audience…
                </h2>

                <ul className="mt-8 w-full max-w-md space-y-2 text-left">
                    {SCAN_STEPS.map((s, i) => (
                        <li
                            key={s}
                            className={`flex items-center gap-3 text-sm ${
                                i <= stepIndex ? "text-white" : "text-zinc-600"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    i < stepIndex
                                        ? "bg-[#00E5FF]"
                                        : i === stepIndex
                                          ? "bg-[#00E5FF] pulse-ring"
                                          : "bg-zinc-700"
                                }`}
                            />
                            {s}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
