import React from 'react';
import { Card } from './ui/Card';
import { formatCurrency } from '../utils/format';
import {
    TrendingUp, TrendingDown, Activity, Target,
    Lightbulb, Zap, Award, ArrowRight, Wallet
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const MiniStatsStrip = ({ data }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-none shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Avg. Daily Spend</p>
            <div className="flex items-end justify-between mt-2">
                <h4 className="text-lg font-bold text-text">{formatCurrency(data.avgDaily)}</h4>
                <Activity size={16} className="text-primary/50 mb-1" />
            </div>
        </Card>
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-none shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Biggest Purchase</p>
            <div className="flex items-end justify-between mt-2">
                <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-bold text-text">{formatCurrency(data.biggestTx.amount)}</h4>
                    <span className="text-xs font-small mt-0.5 text-text-muted">{data.biggestTx.category}</span>
                </div>
                <Zap size={16} className="text-amber-500/50 mb-1" />
            </div>
        </Card>
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-none shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Lowest Purchase</p>
            <div className="flex items-end justify-between mt-2">
                <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-bold text-text">{formatCurrency(data.lowestTx.amount)}</h4>
                    <span className="text-xs font-small mt-0.5 text-text-muted">{data.lowestTx.category}</span>
                </div>
                <TrendingDown size={16} className="text-emerald-500/50 mb-1" />
            </div>
        </Card>
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-none shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Total Transactions</p>
            <div className="flex items-end justify-between mt-2">
                <h4 className="text-lg font-bold text-text">{data.txCount}</h4>
                <Wallet size={16} className="text-blue-500/50 mb-1" />
            </div>
        </Card>
    </div>
);

export const HealthScoreWidget = ({ score }) => {
    const getColor = (s) => {
        if (s >= 80) return 'text-emerald-500';
        if (s >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getLabel = (s) => {
        if (s >= 80) return 'Excellent';
        if (s >= 50) return 'Good';
        return 'Needs Attention';
    };

    return (
        <Card className="h-full flex flex-col items-center justify-center p-6 bg-white border-none shadow-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 opacity-50"></div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Financial Health</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                    <circle
                        cx="64" cy="64" r="56"
                        stroke="currentColor" strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={351.86}
                        strokeDashoffset={351.86 - (351.86 * score) / 100}
                        className={`${getColor(score)} transition-all duration-1000 ease-out`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getColor(score)}`}>{Math.round(score)}</span>
                    <span className="text-xs text-text-muted font-medium">{getLabel(score)}</span>
                </div>
            </div>
        </Card>
    );
};

export const HealthBarWidget = ({ score }) => {
    const getColor = (s) => {
        if (s >= 80) return 'text-emerald-500';
        if (s >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getBgColor = (s) => {
        if (s >= 80) return 'bg-emerald-500';
        if (s >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    const getLightBgColor = (s) => {
        if (s >= 80) return 'bg-emerald-100/50';
        if (s >= 50) return 'bg-amber-100/50';
        return 'bg-rose-100/50';
    };

    const getLabel = (s) => {
        if (s >= 80) return 'Excellent';
        if (s >= 50) return 'Good';
        return 'Needs Attention';
    };

    const colorClass = getColor(score);
    const bgClass = getBgColor(score);
    const lightBgClass = getLightBgColor(score);

    return (
        <Card hover className="bg-gradient-to-br from-white to-indigo-50/50 border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-3 ${lightBgClass} rounded-2xl ${colorClass}`}>
                    <Activity size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${lightBgClass} ${colorClass}`}>
                    {getLabel(score)}
                </span>
            </div>
            <div>
                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider">Financial Health</p>
                <div className="flex items-end gap-2 mt-1 mb-2">
                    <h3 className="text-2xl font-bold text-text">{Math.round(score)}</h3>
                    <span className="text-sm text-text-muted mb-1">/ 100</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${bgClass}`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </Card>
    );
};

export const SmartInsightsWidget = ({ insight }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <TrendingDown size={20} className="text-rose-500" />;
            case 'success': return <TrendingUp size={20} className="text-emerald-500" />;
            default: return <Lightbulb size={20} className="text-amber-500" />;
        }
    };

    return (
        <Card className="h-full p-6 bg-gradient-to-br from-indigo-50 to-white border-none shadow-soft flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getIcon(insight.type)}
                </div>
                <h3 className="font-bold text-indigo-900">Smart Insight</h3>
            </div>
            <p className="text-sm text-indigo-800/80 font-medium leading-relaxed">
                {insight.message}
            </p>
            <div className="mt-auto pt-4">
                <button className="text-xs font-bold text-indigo-600 flex items-center hover:gap-2 transition-all">
                    View Details <ArrowRight size={12} className="ml-1" />
                </button>
            </div>
        </Card>
    );
};

export const GoalTrackerWidget = ({ current, target, onUpdateGoal }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [goalValue, setGoalValue] = React.useState(target);
    const percentage = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

    React.useEffect(() => {
        setGoalValue(target);
    }, [target]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (goalValue >= 0 && onUpdateGoal) {
            onUpdateGoal(goalValue);
            setIsModalOpen(false);
        }
    };

    const handleCancel = () => {
        setGoalValue(target);
        setIsModalOpen(false);
    };

    return (
        <>
            <Card className="h-full p-6 bg-white border-none shadow-soft flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-primary" />
                        <h3 className="font-bold text-text">Monthly Savings Goal</h3>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{Math.round(percentage)}%</span>
                </div>
                <div className="mb-4">
                    <div className="flex justify-between text-md text-text-muted mb-1">
                        <span>{formatCurrency(current)}</span>
                        <span>Target: {formatCurrency(target)}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
                <p className="text-xs text-text-muted mb-3">
                    {target === 0 ? "Set a goal to track your savings!" : percentage >= 100 ? "🎉 Goal reached! Great job!" : `You need ${formatCurrency(target - current)} more to reach your goal.`}
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2 px-4 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Set Goal
                </button>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleCancel}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-text">Set Monthly Savings Goal</h3>
                            <button onClick={handleCancel} className="text-text-muted hover:text-text transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-text-muted mb-2">
                                    Goal Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={goalValue === 0 ? '' : goalValue}
                                    onChange={(e) => setGoalValue(e.target.value === '' ? 0 : Number(e.target.value))}
                                    onFocus={(e) => e.target.select()}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                    placeholder="Enter your savings goal"
                                    autoFocus
                                    min="0"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 px-4 border border-gray-200 text-text-muted font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Save Goal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export const WeeklyActivityWidget = ({ data }) => (
    <Card className="h-full p-6 bg-white border-none shadow-soft">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
            <Activity size={18} className="text-gray-400" />
            Weekly Activity
        </h3>
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="expense" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#cbd5e1' : '#94a3b8'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
);

export const CategoryHighlightWidget = ({ category }) => {
    if (!category) return null;

    return (
        <Card className="h-full p-6 bg-gradient-to-br from-orange-50 to-white border-none shadow-soft flex flex-col justify-center items-center text-center">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600 mb-3">
                <Award size={24} />
            </div>
            <h3 className="text-xs font-bold text-orange-900/60 uppercase tracking-wider mb-1">Top Category</h3>
            <p className="text-lg font-bold text-orange-900 mb-1">{category.name}</p>
            <p className="text-2xl font-black text-orange-600">{formatCurrency(category.amount)}</p>
        </Card>
    );
};
