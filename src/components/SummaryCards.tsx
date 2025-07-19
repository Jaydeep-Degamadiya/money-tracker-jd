import React from 'react';
import { TrendingUp, TrendingDown, CreditCard, Target, Calendar, IndianRupee } from 'lucide-react';
import { SummaryStats } from '../types/expense';

interface SummaryCardsProps {
  stats: SummaryStats;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Spend',
      value: stats.totalSpend,
      icon: IndianRupee,
      gradient: 'gradient-bg-primary',
      prefix: '₹',
      glow: 'neon-glow'
    },
    {
      title: 'This Month',
      value: stats.monthlySpend,
      icon: Calendar,
      gradient: 'gradient-bg-success',
      prefix: '₹',
      glow: 'neon-glow-green'
    },
    {
      title: 'Avoidable Spend',
      value: stats.avoidableSpend,
      icon: TrendingDown,
      gradient: 'gradient-bg-danger',
      prefix: '₹',
      glow: 'neon-glow-red'
    },
    {
      title: 'Essential Spend',
      value: stats.nonAvoidableSpend,
      icon: TrendingUp,
      gradient: 'gradient-bg-warning',
      prefix: '₹',
      glow: 'neon-glow-green'
    },
    {
      title: 'Top Category',
      value: stats.topCategory,
      icon: Target,
      gradient: 'gradient-bg-info',
      prefix: '',
      glow: 'neon-glow'
    },
    {
      title: 'Preferred Mode',
      value: stats.topPaymentMode,
      icon: CreditCard,
      gradient: 'gradient-bg-secondary',
      prefix: '',
      glow: 'neon-glow-purple'
    }
  ];

  const formatValue = (value: number | string, prefix: string) => {
    if (typeof value === 'number') {
      return `${prefix}${value.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    return value;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`group relative card-dark rounded-2xl p-4 lg:p-6 hover:scale-105 transition-all duration-300 ${card.glow} glass-card-hover`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.gradient} p-3 rounded-xl shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className="text-white text-xl lg:text-2xl font-bold tracking-tight">
                  {formatValue(card.value, card.prefix)}
                </p>
              </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;