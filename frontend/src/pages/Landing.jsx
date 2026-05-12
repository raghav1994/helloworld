import { Link } from "react-router-dom";
import {
    Activity,
    Sparkles,
    LineChart,
    Brain,
    Globe2,
    MessageSquareHeart,
    Gauge,
    ArrowRight,
} from "lucide-react";
import NavBar from "../components/NavBar";

export default function Landing() {
    return (
        <div className="grain min-h-screen">
            <NavBar />

            {/* Hero */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div
                        className="absolute -top-20 right-[-10%] h-[520px] w-[520px] rounded-full opacity-70 orb-float"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, rgba(0,229,255,0.35), rgba(139,92,246,0.18) 40%, transparent 70%)",
                            filter: "blur(20px)",
                        }}
                    />
                    <div
                        className="absolute bottom-[-10%] left-[-10%] h-[420px] w-[420px] rounded-full opacity-60 orb-float"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, rgba(255,42,95,0.25), transparent 70%)",
                            filter: "blur(30px)",
                            animationDelay: "2s",
                        }}
                    />
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 reveal">
                        <span
                            className="inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-[#00E5FF] border border-[#00E5FF]/30 rounded-full px-3 py-1 bg-[#00E5FF]/[0.04]"
                            data-testid="hero-eyebrow"
                        >
                            <Sparkles className="h-3 w-3" />
                            Perception Intelligence · for creators
                        </span>
                        <h1
                            className="font-display mt-6 text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.02] tracking-tighter"
                            data-testid="hero-title"
                        >
                            Most creator tools track
                            <span className="block text-zinc-500">numbers.</span>
                            <span className="block">
                                We track{" "}
                                <span className="italic text-[#00E5FF] score-glow">perception.</span>
                            </span>
                        </h1>
                        <p className="mt-6 text-zinc-400 text-lg max-w-xl leading-relaxed">
                            Pulsay listens to how your audience actually feels — sentiment, narratives,
                            spikes, regions — and turns it into an emotional intelligence dashboard for your
                            internet reputation.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-3">
                            <Link to="/signup" className="btn-primary" data-testid="hero-cta-primary">
                                Get your perception score
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a href="#features" className="btn-glass" data-testid="hero-cta-secondary">
                                See what you'll see
                            </a>
                        </div>
                        <div className="mt-10 flex items-center gap-6 text-xs text-zinc-500 font-mono">
                            <span>· No OAuth headache</span>
                            <span>· Public profiles only</span>
                            <span>· Updated monthly</span>
                        </div>
                    </div>

                    <div className="lg:col-span-5 reveal reveal-delay-2">
                        <div className="relative">
                            <div className="glass-strong p-6 sm:p-8 rounded-3xl">
                                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                                    <span>@yourhandle · live preview</span>
                                    <span className="flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] pulse-ring" />
                                        listening
                                    </span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="col-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                        <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                                            Reputation Score
                                        </div>
                                        <div className="mt-2 flex items-end gap-3">
                                            <div className="font-mono text-5xl text-white score-glow">
                                                82
                                            </div>
                                            <div className="text-[#00E5FF] text-sm mb-2">+4 vs last month</div>
                                        </div>
                                        <div className="mt-4 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                            <div className="h-full w-[82%] bg-gradient-to-r from-[#FF2A5F] via-[#F59E0B] to-[#00E5FF]" />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                        <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                                            Top narrative
                                        </div>
                                        <div className="mt-2 text-lg font-display">Authentic</div>
                                        <div className="text-xs text-zinc-500 mt-1">42% of mind</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                        <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">
                                            Sentiment
                                        </div>
                                        <div className="mt-2 flex h-2 rounded-full overflow-hidden">
                                            <div className="bg-[#00E5FF] w-[62%]" />
                                            <div className="bg-violet-500/70 w-[24%]" />
                                            <div className="bg-[#FF2A5F] w-[14%]" />
                                        </div>
                                        <div className="mt-2 flex justify-between text-[10px] text-zinc-500 font-mono">
                                            <span>62% +</span>
                                            <span>24% =</span>
                                            <span>14% −</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute -bottom-6 -right-6 hidden md:flex glass px-4 py-3 items-center gap-3 reveal reveal-delay-3"
                            >
                                <Brain className="h-4 w-4 text-[#00E5FF]" />
                                <div className="text-xs">
                                    <div className="text-white">Your audience loves BTS reels.</div>
                                    <div className="text-zinc-500">AI recommendation · 2h ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features bento */}
            <section
                id="features"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24"
            >
                <div className="max-w-2xl">
                    <span className="text-xs tracking-[0.22em] uppercase text-zinc-500">The dashboard</span>
                    <h2 className="font-display mt-3 text-4xl sm:text-5xl tracking-tighter font-light">
                        Built like a feeling, not a spreadsheet.
                    </h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
                    <Feature
                        className="md:col-span-6 lg:col-span-7"
                        icon={Gauge}
                        title="Reputation Score"
                        body="A single 0–100 number capturing positivity, toxicity, consistency, controversy and audience trust. Your hook. Your virality engine."
                        accent="cyan"
                    />
                    <Feature
                        className="md:col-span-6 lg:col-span-5"
                        icon={LineChart}
                        title="Sentiment trend & spike detection"
                        body="See the day your audience flipped — and why. Anomaly markers explain every dip."
                    />
                    <Feature
                        className="md:col-span-3 lg:col-span-4"
                        icon={Brain}
                        title="Top Narratives"
                        body="‘Authentic’, ‘funny’, ‘money-minded’. How your audience would describe you in three words."
                        accent="violet"
                    />
                    <Feature
                        className="md:col-span-3 lg:col-span-4"
                        icon={Globe2}
                        title="Regions & languages"
                        body="Inferred from comment language, emoji and posting times — without OAuth."
                    />
                    <Feature
                        className="md:col-span-6 lg:col-span-4"
                        icon={MessageSquareHeart}
                        title="AI recommendations"
                        body="Specific, brand-safe moves that actually move sentiment. Not vibes."
                        accent="cyan"
                    />
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <span className="text-xs tracking-[0.22em] uppercase text-zinc-500">
                            How it works
                        </span>
                        <h2 className="font-display mt-3 text-4xl sm:text-5xl tracking-tighter font-light">
                            Sign up. Type your handle. Watch yourself through your fans' eyes.
                        </h2>
                        <p className="mt-6 text-zinc-400 leading-relaxed">
                            We fetch only public posts &amp; comments — no OAuth, no permissions, no waiting on
                            Meta app review. Pulsay clusters them into perception themes, scores reputation,
                            detects sentiment spikes, and generates a refresh every month.
                        </p>
                    </div>
                    <ol className="space-y-4">
                        {[
                            ["01", "Create your account", "Name, email, phone. 30 seconds."],
                            [
                                "02",
                                "Connect your @username",
                                "Public profile only. We fetch posts &amp; comments.",
                            ],
                            [
                                "03",
                                "AI analyses perception",
                                "Sentiment, narratives, spikes, regions, recommendations.",
                            ],
                            [
                                "04",
                                "Your dashboard is ready",
                                "Refresh monthly. History gets richer as you stay.",
                            ],
                        ].map(([n, t, d]) => (
                            <li key={n} className="glass p-5 flex gap-5 items-start">
                                <div className="font-mono text-[#00E5FF] text-sm">{n}</div>
                                <div>
                                    <div className="text-white font-medium">{t}</div>
                                    <div className="text-zinc-500 text-sm mt-1">{d}</div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="glass-strong p-10 sm:p-14 text-center">
                    <h3 className="font-display text-3xl sm:text-4xl tracking-tighter font-light">
                        Wow this understands my internet reputation.
                    </h3>
                    <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                        That's the only review we want. Free during beta — be one of the first 1,000.
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/signup"
                            className="btn-primary"
                            data-testid="footer-cta"
                        >
                            Get your score now <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/[0.06] py-10 text-center text-xs text-zinc-600 font-mono">
                <div className="flex items-center justify-center gap-2">
                    <Activity className="h-3 w-3 text-[#00E5FF]" />
                    Pulsay · perception intelligence for creators
                </div>
            </footer>
        </div>
    );
}

function Feature({ className, icon: Icon, title, body, accent }) {
    const accentColor =
        accent === "cyan"
            ? "text-[#00E5FF]"
            : accent === "violet"
              ? "text-violet-300"
              : "text-zinc-300";
    return (
        <div className={`glass p-7 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 ${className}`}>
            <Icon className={`h-5 w-5 ${accentColor}`} />
            <h3 className="font-display mt-5 text-2xl tracking-tight">{title}</h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{body}</p>
        </div>
    );
}
