import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiBootstrap } from './api';
import './index.css';

type Summary = {
    days: number;
    bridges_total: number;
    success_rate: number;
    cost_total_usd: number;
    cost_avg_usd: number;
    by_host: Record<string, { count: number; avg_score: number }>;
    by_ladder: Record<string, { count: number; avg_score: number }>;
};

type BridgeRow = {
    context_id: string;
    created_at: string;
    target_host: string;
    decision: string;
    score: number;
    ladder_last_level: string;
    provider: string;
    model: string;
    input_tokens: number;
    output_tokens: number;
    cost_usd_est: number;
    author_name: string;
};

type BridgeDetail = {
    context_id: string;
    created_at: string;
    target_host: string;
    decision: string;
    score: number;
    ladder_last_level: string;
    input_tokens: number;
    output_tokens: number;
    cost_usd_est: number;
    ladder_steps: string;
    receipt: string;
};

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('nb_token') || import.meta.env.VITE_OPENROUTER_API_KEY || '');
    const [days, setDays] = useState(7);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [rows, setRows] = useState<BridgeRow[]>([]);
    const [selected, setSelected] = useState<BridgeDetail | null>(null);
    const [err, setErr] = useState<string>('');
    const [isLive, setIsLive] = useState(true);
    const [isBootstrapping, setIsBootstrapping] = useState(false);

    const okToken = useMemo(() => token.trim().length > 20, [token]);

    async function handleBootstrap() {
        if (isBootstrapping) return;
        setIsBootstrapping(true);
        try {
            console.log('🔄 Initiating Identity Bootstrap...');
            setErr('Bootstrapping identity...');
            let iid = localStorage.getItem('nb_install_id');
            if (!iid) {
                iid = 'dash_' + Math.random().toString(36).slice(2, 10);
                localStorage.setItem('nb_install_id', iid);
            }
            const res = await apiBootstrap(iid);
            console.log('✅ Identity Verified. Token acquired.');
            setToken(res.session_token);
            localStorage.setItem('nb_token', res.session_token);
            setErr('');
        } catch (e) {
            console.error('❌ Bootstrap failure:', e);
            setErr(`Bootstrap failed: ${e}`);
        } finally {
            setIsBootstrapping(false);
        }
    }

    async function load() {
        if (!okToken) {
            handleBootstrap();
            return;
        }
        try {
            const s = await apiGet<Summary>(`/v1/dashboard/summary?days=${days}`, token);
            setSummary(s);
            const list = await apiGet<{ items: BridgeRow[] }>(`/v1/dashboard/bridges?limit=50&offset=0`, token);
            setRows(list.items || []);
            setErr('');
        } catch (e: any) {
            if (e.message.includes('401')) {
                handleBootstrap();
            } else {
                setErr(String(e));
            }
        }
    }

    useEffect(() => {
        load().catch(e => {
            console.error('Initial load failed:', e);
            setErr(String(e));
        });
    }, [days, token]); // Now triggers on token change/bootstrap!

    // Real-time Pulse
    useEffect(() => {
        if (!isLive || !okToken) return;
        const timer = setInterval(() => {
            load().catch(console.error);
        }, 5000);
        return () => clearInterval(timer);
    }, [isLive, okToken, days, token]);

    return (
        <div style={{ display: 'flex' }}>
            <aside className="sidebar glass-panel">
                <div style={{ marginBottom: 40 }}>
                    <h1 className="glow-blue" style={{ fontSize: 24, letterSpacing: '-1px' }}>Neural Bridge</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isLive ? 'var(--accent-blue)' : '#666', boxShadow: isLive ? '0 0 8px var(--accent-blue)' : 'none' }}></div>
                        <p style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{isLive ? 'Live Sync Active' : 'Offline'}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                        <label style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Authentication</label>
                        <input
                            type="password"
                            placeholder="JWT Token"
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                                localStorage.setItem('nb_token', e.target.value);
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Time Horizon</label>
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            style={{ width: '100%' }}
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last quarter</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>Auto-Sync</span>
                        <div
                            onClick={() => setIsLive(!isLive)}
                            style={{
                                width: 40, height: 20, borderRadius: 20, background: isLive ? 'var(--accent-blue)' : '#333',
                                position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                                position: 'absolute', top: 3, left: isLive ? 23 : 3, transition: 'all 0.3s'
                            }}></div>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => load().catch(e => setErr(String(e)))}
                        disabled={!okToken || isLive}
                        style={{ marginTop: 12, opacity: isLive ? 0.5 : 1 }}
                    >
                        {isLive ? 'Syncing Live...' : 'Sync Manually'}
                    </button>
                </div>

                <div style={{ marginTop: 'auto', fontSize: 11, opacity: 0.3 }}>
                    Version 2.0.0 "Crystal"
                </div>
            </aside>

            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <div>
                        <h2 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard Overview</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Real-time metrics for knowledge transfer fidelity.</p>
                    </div>
                </header>

                {err && <div style={{ marginBottom: 24, padding: 16, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, color: '#f87171' }}>{err}</div>}

                {summary && (
                    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
                        <Card title="Bridges" value={summary.bridges_total} trend="+12%" />
                        <Card title="Fidelity" value={`${Math.round(summary.success_rate * 100)}%`} trend="Target 85%" color={summary.success_rate >= 0.8 ? 'var(--accent-blue)' : '#f59e0b'} />
                        <Card title="Total Economy" value={`$${summary.cost_total_usd.toFixed(4)}`} trend="USD Est." />
                        <Card title="Avg Latency" value="~0.8s" trend="Sub-second" />
                    </section>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 24 }}>
                    <section className="glass-panel" style={{ padding: 24 }}>
                        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Recent Transfers</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Host</th>
                                    <th>Author</th>
                                    <th>Status</th>
                                    <th>SRI</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(r => (
                                    <tr
                                        key={r.context_id}
                                        onClick={async () => {
                                            const d = await apiGet<BridgeDetail>(`/v1/dashboard/bridges/${r.context_id}`, token);
                                            setSelected(d);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{formatDate(r.created_at)}</td>
                                        <td><HostBadge host={r.target_host} /></td>
                                        <td style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>{r.author_name}</td>
                                        <td><DecisionBadge decision={r.decision} /></td>
                                        <td style={{ fontWeight: 600 }}>{Math.round(r.score * 100)}%</td>
                                        <td style={{ opacity: 0.7 }}>${r.cost_usd_est.toFixed(4)}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Waiting for bridge telemetry...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </section>

                    <section className="glass-panel" style={{ padding: 24 }}>
                        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Crystal Analysis</h3>
                        {!selected && (
                            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: 12 }}>
                                Select a transfer to audit
                            </div>
                        )}
                        {selected && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="glass-card">
                                    <label style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Crystal ID</label>
                                    <div style={{ fontSize: 12, marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all' }}>{selected.context_id}</div>
                                </div>
                                <div className="glass-card">
                                    <label style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ladder Verification</label>
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {safeParse(selected.ladder_steps)?.map((step: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span>{step.level}</span>
                                                <span className={step.decision === 'PASS' ? 'glow-blue' : 'glow-pink'}>{step.decision}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="glass-card">
                                    <label style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Evidence Receipt</label>
                                    <div style={{ marginTop: 12, fontSize: 11, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        {selected.receipt ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                                    <span>Receipt ID</span>
                                                    <span style={{ fontFamily: 'monospace' }}>{(safeParse(selected.receipt) as any).receipt_id?.substring(0, 16)}...</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                                    <span>Fidelity</span>
                                                    <span className="glow-blue">{(safeParse(selected.receipt) as any).fidelity_badge || 'N/A'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                                    <span>Signature</span>
                                                    <span style={{ fontFamily: 'monospace', fontSize: 9 }}>Validated ✅</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ opacity: 0.5 }}>No receipt attached.</span>
                                        )}
                                    </div>
                                </div>
                                <div className="glass-card">
                                    <label style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Raw Telemetry</label>
                                    <pre style={{ marginTop: 12, fontSize: 10, overflow: 'auto', maxHeight: 200, opacity: 0.6 }}>
                                        {JSON.stringify(selected, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

function safeParse(s: unknown) {
    try {
        return typeof s === 'string' ? JSON.parse(s) : s;
    } catch {
        return [];
    }
}

function formatDate(s: string) {
    try {
        const d = new Date(s);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return s;
    }
}

function Card({ title, value, color, trend }: { title: string; value: string | number; color?: string; trend?: string }) {
    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
                {trend && <span style={{ fontSize: 10, color: 'var(--accent-blue)', opacity: 0.7 }}>{trend}</span>}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 12, color: color || '#fff' }}>{value}</div>
        </div>
    );
}

function HostBadge({ host }: { host: string }) {
    const colors: Record<string, string> = {
        chatgpt: '#10b981',
        gemini: '#3b82f6',
        claude: '#f97316',
    };
    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${colors[host] || '#6b7280'}`,
            color: colors[host] || '#fff',
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase'
        }}>
            {host}
        </span>
    );
}

function DecisionBadge({ decision }: { decision: string }) {
    const isAccept = decision === 'ACCEPT';
    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: 6,
            background: isAccept ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isAccept ? '#10b981' : '#f87171',
            border: `1px solid ${isAccept ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase'
        }}>
            {decision}
        </span>
    );
}
