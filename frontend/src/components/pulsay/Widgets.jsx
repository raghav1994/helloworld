import {
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceDot,
} from "recharts";
import { TrendingUp, TrendingDown, Heart, Flame, Quote, Globe2, Sparkles } from "lucide-react";

const COLORS = {
    cyan: "#00E5FF",
    coral: "#FF2A5F",
    violet: "#8B5CF6",
    amber: "#F59E0B",
};

export function ReputationScore({ score }) {
    const data = [{ name: "score", value: score, fill: "url(#repGrad)" }];
    return (
        <div className="glass p-6 sm:p-8" data-testid="reputation-score-widget">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                        Reputation Score
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">positivity · trust · stability</div>
                </div>
                <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full px-2 py-0.5">
                    LIVE
                </span>
            </div>
            <div className="relative h-56 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="78%"
                        outerRadius="100%"
                        data={data}
                        startAngle={210}
                        endAngle={-30}
                    >
                        <defs>
                            <linearGradient id="repGrad" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor={COLORS.coral} />
                                <stop offset="50%" stopColor={COLORS.amber} />
                                <stop offset="100%" stopColor={COLORS.cyan} />
                            </linearGradient>
                        </defs>
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={20} />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="font-mono text-6xl text-white score-glow" data-testid="reputation-score-value">
                        {score}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">/ 100</div>
                </div>
            </div>
        </div>
    );
}

export function SentimentSplit({ split }) {
    const data = [
        { name: "Positive", value: split.positive, color: COLORS.cyan },
        { name: "Neutral", value: split.neutral, color: COLORS.violet },
        { name: "Negative", value: split.negative, color: COLORS.coral },
    ];
    return (
        <div className="glass p-6 sm:p-8" data-testid="sentiment-split-widget">
            <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                Sentiment Split
            </div>
            <div className="grid grid-cols-2 gap-4 items-center mt-2">
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={48}
                                outerRadius={72}
                                paddingAngle={3}
                                stroke="none"
                            >
                                {data.map((d, i) => (
                                    <Cell key={i} fill={d.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <ul className="space-y-3">
                    {data.map((d) => (
                        <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
                            <span className="flex items-center gap-2 text-zinc-300">
                                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                                {d.name}
                            </span>
                            <span className="font-mono text-white">{d.value}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export function SentimentTrend({ trend, spikeExplanation }) {
    const data = trend.map((t) => ({ ...t }));
    const spike = data.find((d) => d.spike);
    return (
        <div className="glass p-6 sm:p-8 col-span-1 md:col-span-2" data-testid="sentiment-trend-widget">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                        Sentiment trend · spike detection
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">12-week reputation pulse</div>
                </div>
                {spike && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#FF2A5F]">
                        <TrendingDown className="h-3 w-3" /> spike @ {spike.week}
                    </div>
                )}
            </div>
            <div className="h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.45} />
                                <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="b" />
                                <feMerge>
                                    <feMergeNode in="b" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <XAxis dataKey="week" tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                            contentStyle={{
                                background: "rgba(10,10,16,0.95)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12,
                                fontSize: 12,
                            }}
                            labelStyle={{ color: "#a1a1aa" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke={COLORS.cyan}
                            strokeWidth={2}
                            fill="url(#trendGrad)"
                            filter="url(#glow)"
                        />
                        {spike && (
                            <ReferenceDot
                                x={spike.week}
                                y={spike.score}
                                r={6}
                                fill={COLORS.coral}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {spikeExplanation && (
                <div className="mt-4 text-sm text-zinc-400 border-l-2 border-[#FF2A5F]/60 pl-3">
                    <span className="text-[#FF2A5F]">Spike insight · </span>
                    {spikeExplanation}
                </div>
            )}
        </div>
    );
}

export function TopNarratives({ narratives = [] }) {
    if (!narratives.length) return null;
    return (
        <div className="glass p-6 sm:p-8" data-testid="top-narratives-widget">
            <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500">Top Narratives</div>
            <div className="text-xs text-zinc-500 mt-1">how your audience describes you</div>
            <div className="mt-5 flex flex-wrap gap-2">
                {narratives.map((n) => (
                    <span key={n.label} className={`narrative-chip ${n.sentiment}`} data-testid={`narrative-${n.label}`}>
                        <Flame className="h-3 w-3" />
                        {n.label}
                        {typeof n.percent === "number" && (
                            <span className="font-mono text-[11px] opacity-70">· {n.percent}%</span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function AIRecommendations({ recommendations = [], summary }) {
    return (
        <div className="recommend-glow p-6 sm:p-8 rounded-2xl glass" data-testid="ai-recommendations-card">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[#00E5FF]">
                <Sparkles className="h-3 w-3" /> AI Recommendations
            </div>
            {summary && <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{summary}</p>}
            <ul className="mt-5 space-y-4">
                {recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3" data-testid={`recommendation-${i}`}>
                        <span className="font-mono text-[#00E5FF] text-xs mt-0.5">0{i + 1}</span>
                        <div>
                            <div className="text-white font-medium text-sm">{r.title}</div>
                            <div className="text-zinc-400 text-sm mt-1 leading-relaxed">{r.detail}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function TopComments({ positive = [], negative = [] }) {
    return (
        <div className="glass p-6 sm:p-8 col-span-1 md:col-span-2" data-testid="top-comments-widget">
            <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500">Top comments</div>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                <CommentColumn title="Fan love" icon={Heart} accent="cyan" comments={positive} testId="positive-comments" />
                <CommentColumn title="Tough love" icon={Quote} accent="coral" comments={negative} testId="negative-comments" />
            </div>
        </div>
    );
}

function CommentColumn({ title, icon: Icon, accent, comments, testId }) {
    const color = accent === "cyan" ? "#00E5FF" : "#FF2A5F";
    return (
        <div data-testid={testId}>
            <div className="flex items-center gap-2 text-sm" style={{ color }}>
                <Icon className="h-4 w-4" />
                {title}
            </div>
            <ul className="mt-3 space-y-3">
                {comments.slice(0, 4).map((c, i) => (
                    <li key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                        <div className="text-sm text-zinc-200 leading-relaxed">"{c.text}"</div>
                        <div className="mt-2 flex justify-between text-[11px] font-mono text-zinc-500">
                            <span>@{c.user}</span>
                            <span>♥ {c.likes}</span>
                        </div>
                    </li>
                ))}
                {!comments.length && (
                    <li className="text-xs text-zinc-600 italic">No comments in this bucket yet.</li>
                )}
            </ul>
        </div>
    );
}

export function Demographics({ regions = [], languages = [] }) {
    const total = regions.reduce((s, r) => s + (r.share || 0), 0) || 1;
    return (
        <div className="glass p-6 sm:p-8" data-testid="demographics-widget">
            <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500 flex items-center gap-2">
                <Globe2 className="h-3 w-3" />
                Audience geography
            </div>
            <div className="text-xs text-zinc-500 mt-1">inferred from comment language &amp; emoji</div>
            <ul className="mt-5 space-y-3">
                {regions.map((r) => (
                    <li key={r.name}>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-200">{r.name}</span>
                            <span className="font-mono text-zinc-400 text-xs">{r.share}%</span>
                        </div>
                        <div className="mt-1 h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]"
                                style={{ width: `${(r.share / total) * 100}%` }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            {languages.length > 0 && (
                <div className="mt-5">
                    <div className="text-[10px] tracking-[0.22em] uppercase text-zinc-500">Languages</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {languages.map((l) => (
                            <span
                                key={l.code}
                                className="text-xs font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.06] rounded-full px-2.5 py-1"
                            >
                                {l.label} · {l.share}%
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function CreatorHeader({ profile, onRefresh, refreshing, onLogout }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-center gap-4">
                <img
                    src={profile.profile_pic_url}
                    alt={profile.username}
                    className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                />
                <div>
                    <div className="font-mono text-zinc-500 text-xs">@{profile.username}</div>
                    <h1 className="font-display text-3xl sm:text-4xl tracking-tight" data-testid="creator-name">
                        {profile.full_name}
                    </h1>
                    <div className="flex gap-4 mt-1 text-xs font-mono text-zinc-500">
                        <span>{formatNumber(profile.followers)} followers</span>
                        <span>{profile.posts_count} posts</span>
                        {profile.is_verified && <span className="text-[#00E5FF]">verified</span>}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="btn-glass text-sm"
                    data-testid="refresh-button"
                >
                    <TrendingUp className="h-4 w-4" />
                    {refreshing ? "Refreshing…" : "Refresh perception"}
                </button>
                <button onClick={onLogout} className="btn-glass text-sm" data-testid="dashboard-logout">
                    Logout
                </button>
            </div>
        </div>
    );
}

function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
}
