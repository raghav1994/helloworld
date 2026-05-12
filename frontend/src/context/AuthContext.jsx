import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, tokenStore, formatApiErrorDetail } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("checking"); // checking | guest | authed

    const refresh = useCallback(async () => {
        const token = tokenStore.get();
        if (!token) {
            setUser(null);
            setStatus("guest");
            return null;
        }
        try {
            const { data } = await api.get("/auth/me");
            setUser(data);
            setStatus("authed");
            return data;
        } catch {
            tokenStore.clear();
            setUser(null);
            setStatus("guest");
            return null;
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            tokenStore.set(data.token);
            setUser(data.user);
            setStatus("authed");
            return { ok: true, user: data.user };
        } catch (e) {
            return { ok: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
        }
    };

    const register = async (payload) => {
        try {
            const { data } = await api.post("/auth/register", payload);
            tokenStore.set(data.token);
            setUser(data.user);
            setStatus("authed");
            return { ok: true, user: data.user };
        } catch (e) {
            return { ok: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            /* noop */
        }
        tokenStore.clear();
        setUser(null);
        setStatus("guest");
    };

    return (
        <AuthContext.Provider value={{ user, status, login, register, logout, refresh, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
