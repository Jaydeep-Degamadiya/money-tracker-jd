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
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      prefix: '₹'
    },
    {
      title: 'This Month',
      value: stats.monthlySpend,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      prefix: '₹'
    },
    {
      title: 'Avoidable Spend',
      value: stats.avoidableSpend,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      prefix: '₹'
    },
    {
      title: 'Essential Spend',
      value: stats.nonAvoidableSpend,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      prefix: '₹'
    },
    {
      title: 'Top Category',
      value: stats.topCategory,
      icon: Target,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      prefix: ''
    },
    {
      title: 'Preferred Mode',
      value: stats.topPaymentMode,
      icon: CreditCard,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      prefix: ''
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white transition-all duration-300 hover:transform hover:scale-105 card-shadow card-shadow-hover"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-gray-900 text-2xl font-bold tracking-tight">
                  {formatValue(card.value, card.prefix)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;