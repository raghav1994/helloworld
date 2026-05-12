import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api, formatApiErrorDetail } from "../lib/api";
import NavBar from "../components/NavBar";
import {
    ReputationScore,
    SentimentSplit,
    SentimentTrend,
    TopNarratives,
    AIRecommendations,
    TopComments,
    Demographics,
    CreatorHeader,
} from "../components/pulsay/Widgets";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const { data } = await api.get("/pulsay/report");
            setReport(data);
        } catch (e) {
            if (e.response?.status === 404) {
                navigate("/onboarding");
                return;
            }
            toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        load();
    }, [load]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const { data } = await api.post("/pulsay/refresh");
            setReport(data);
            toast.success("Perception refreshed");
        } catch (e) {
            toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
        } finally {
            setRefreshing(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center text-zinc-500" data-testid="dashboard-loading">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#00E5FF] pulse-ring" />
                    Loading your perception report…
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="min-h-screen grain pb-24" data-testid="dashboard">
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <CreatorHeader
                    profile={report.profile}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    onLogout={handleLogout}
                />
                <div className="mt-2 text-xs text-zinc-500 font-mono">
                    {report.comments_analysed} comments · {report.posts_analysed} posts ·{" "}
                    {new Date(report.generated_at).toLocaleString()} · engine {report.provider}/
                    {report.model}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 reveal">
                    <ReputationScore score={report.reputation_score} />
                    <SentimentSplit split={report.sentiment_split} />
                    <Demographics regions={report.regions} languages={report.languages} />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 reveal reveal-delay-1">
                    <SentimentTrend trend={report.sentiment_trend} spikeExplanation={report.spike_explanation} />
                    <AIRecommendations recommendations={report.ai_recommendations} summary={report.perception_summary} />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 reveal reveal-delay-2">
                    <TopNarratives narratives={report.top_narratives} />
                    <TopComments positive={report.top_positive_comments} negative={report.top_negative_comments} />
                </div>
            </div>
        </div>
    );
}
