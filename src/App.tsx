import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, TrendingUp, ChevronDown, Menu, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, subMonths, isWithinInterval, parseISO } from 'date-fns';

import { ExpenseData, SummaryStats } from './types/expense';
import { fetchExpenseData } from './utils/fetchSheetData';
import { 
  calculateSummaryStats, 
  getCategoryData, 
  getSubCategoryData,
  getPaymentModeData,
  getDailySpendData,
  getAvoidableComparisonData,
  getFrequencyData
} from './utils/dataProcessing';

import SummaryCards from './components/SummaryCards';
import CategoryDonutChart from './components/CategoryDonutChart';
import CategorySubcategoryChart from './components/CategorySubcategoryChart';
import DailyStackedBarChart from './components/DailyStackedBarChart';
import PaymentModeChart from './components/PaymentModeChart';
import FrequencyChart from './components/FrequencyChart';
import TransactionTable from './components/TransactionTable';

function App() {
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalSpend: 0,
    monthlySpend: 0,
    avoidableSpend: 0,
    nonAvoidableSpend: 0,
    topCategory: 'N/A',
    topPaymentMode: 'N/A'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [filteredData, setFilteredData] = useState<ExpenseData[]>([]);

  const quickFilters = [
    { 
      label: 'Current Month', 
      start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    },
    { 
      label: 'Last Month', 
      start: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
      end: format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
    },
    { 
      label: 'Last 3 Months', 
      start: format(startOfMonth(subMonths(new Date(), 2)), 'yyyy-MM-dd'),
      end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    },
    { 
      label: 'Current Year', 
      start: format(startOfYear(new Date()), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    }
  ];

  const applyDateFilter = (data: ExpenseData[], startDate: string, endDate: string) => {
    if (!startDate || !endDate) return data;

    return data.filter(expense => {
      try {
        const expenseDate = parseISO(expense.date);
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        return isWithinInterval(expenseDate, { start, end });
      } catch {
        return false;
      }
    });
  };

  const handleQuickFilter = (filter: { start: string; end: string }) => {
    setDateRange(filter);
    setShowDatePicker(false);
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExpenseData();
      setExpenseData(data);
      const filtered = applyDateFilter(data, dateRange.start, dateRange.end);
      setFilteredData(filtered);
      setSummaryStats(calculateSummaryStats(filtered));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (expenseData.length > 0) {
      const filtered = applyDateFilter(expenseData, dateRange.start, dateRange.end);
      setFilteredData(filtered);
      setSummaryStats(calculateSummaryStats(filtered));
    }
  }, [expenseData, dateRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner w-16 h-16 mx-auto mb-6"></div>
          <p className="text-gray-300 text-xl font-medium">Loading your financial data...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing your spending patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 gradient-bg-primary rounded-xl neon-glow">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Expense Dashboard
                </h1>
                <p className="text-gray-400 text-sm">
                  Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-3 px-4 py-3 glass-card rounded-xl text-white text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {format(parseISO(dateRange.start), 'MMM dd')} - {format(parseISO(dateRange.end), 'MMM dd, yyyy')}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} />
                </button>
                
                {showDatePicker && (
                  <div className="absolute top-full right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl z-50 p-6 animate-slide-in-up">
                    <div className="space-y-6">
                      {/* Quick Filters */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Filters</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {quickFilters.map((filter) => (
                            <button
                              key={filter.label}
                              onClick={() => handleQuickFilter(filter)}
                              className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 hover:text-blue-400 rounded-lg transition-all duration-200 text-left text-gray-300"
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Custom Date Range */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Custom Range</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={dateRange.start}
                              onChange={(e) => handleDateRangeChange('start', e.target.value)}
                              className="w-full px-3 py-2 input-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">End Date</label>
                            <input
                              type="date"
                              value={dateRange.end}
                              onChange={(e) => handleDateRangeChange('end', e.target.value)}
                              className="w-full px-3 py-2 input-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Apply Button */}
                      <div className="pt-3 border-t border-white/10">
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="w-full px-4 py-3 btn-primary rounded-xl text-sm font-semibold transition-all duration-200"
                        >
                          Apply Filter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 btn-primary rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 glass-card rounded-lg"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden mt-4 p-4 glass-card rounded-xl animate-slide-in-up">
              <div className="space-y-4">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full flex items-center justify-between px-4 py-3 glass-card rounded-xl text-white text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 btn-primary rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
              </div>

              {showDatePicker && (
                <div className="mt-4 p-4 glass-card rounded-xl">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {quickFilters.map((filter) => (
                        <button
                          key={filter.label}
                          onClick={() => {
                            handleQuickFilter(filter);
                            setShowMobileMenu(false);
                          }}
                          className="px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-gray-300"
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Summary Cards */}
        <div className="animate-slide-in-up">
          <SummaryCards stats={summaryStats} />
        </div>

        {/* Charts Grid */}
        <div className="space-y-6 lg:space-y-8">
          {/* Row 1: Category Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-left">
            <CategoryDonutChart data={getCategoryData(filteredData)} />
            <CategorySubcategoryChart data={getSubCategoryData(filteredData)} />
          </div>

          {/* Row 2: Payment & Daily Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-right">
            <PaymentModeChart data={getPaymentModeData(filteredData)} />
            <DailyStackedBarChart data={getDailySpendData(filteredData)} />
          </div>

          {/* Row 3: Frequency & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up">
            <FrequencyChart data={getFrequencyData(filteredData)} />
            <div className="space-y-6">
              <div className="card-dark rounded-2xl p-6 text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {filteredData.length}
                </div>
                <div className="text-gray-400 font-medium">Total Transactions</div>
              </div>
              <div className="card-dark rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Quick Insights</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 gradient-bg-primary rounded-xl">
                    <div className="text-2xl font-bold text-white">
                      {Array.from(new Set(filteredData.map(e => e.category))).length}
                    </div>
                    <div className="text-blue-100 text-sm">Categories</div>
                  </div>
                  <div className="text-center p-4 gradient-bg-secondary rounded-xl">
                    <div className="text-2xl font-bold text-white">
                      {Array.from(new Set(filteredData.map(e => e.mode))).length}
                    </div>
                    <div className="text-pink-100 text-sm">Payment Modes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="animate-fade-in">
          <TransactionTable data={filteredData} />
        </div>

        {/* Setup Instructions */}
        {filteredData.length <= 5 && (
          <div className="mt-8 glass-card rounded-2xl p-6 lg:p-8 border border-blue-500/20 neon-glow animate-pulse-slow">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">🚀 Connect Your Google Sheets</h3>
            <div className="text-gray-300 space-y-4">
              <p className="text-lg">You're currently viewing sample data. To connect your Google Sheets:</p>
              <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-400">
                <li>Open your Google Sheet with expense data</li>
                <li>Go to <strong className="text-white">File → Share → Publish to web</strong></li>
                <li>Choose <strong className="text-white">"Comma-separated values (.csv)"</strong> and <strong className="text-white">"Entire Document"</strong></li>
                <li>Copy the generated URL</li>
                <li>Replace the <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-400">SHEET_URL</code> in <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-400">src/utils/fetchSheetData.ts</code></li>
              </ol>
              <p className="text-sm text-gray-500 mt-6 p-4 bg-white/5 rounded-xl">
                <strong>Required columns:</strong> Date, Mode, Category, Sub Category, For, Amount, Description, Priority, Avoidable, Frequency
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with React, TypeScript, and Chart.js • Powered by modern web technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;