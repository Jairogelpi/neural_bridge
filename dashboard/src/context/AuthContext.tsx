"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, handle: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthResponse {
    success: boolean;
    author: any;
    token: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('nb_auth_token');
        const savedUser = localStorage.getItem('nb_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post<AuthResponse>('/v1/auth/login', { email, password });
        const { author, token } = res.data;
        setUser(author);
        setToken(token);
        localStorage.setItem('nb_auth_token', token);
        localStorage.setItem('nb_user', JSON.stringify(author));
        router.push('/dashboard');
    };

    const register = async (name: string, handle: string, email: string, password: string) => {
        const res = await api.post<AuthResponse>('/v1/auth/register', { name, handle, email, password });
        const { author, token } = res.data;
        setUser(author);
        setToken(token);
        localStorage.setItem('nb_auth_token', token);
        localStorage.setItem('nb_user', JSON.stringify(author));
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('nb_auth_token');
        localStorage.removeItem('nb_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
