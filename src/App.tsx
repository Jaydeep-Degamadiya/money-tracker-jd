import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, TrendingUp, Filter, ChevronDown } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading your expense data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Expense Dashboard</h1>
                <p className="text-gray-600 text-sm">
                  Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm hover:bg-gray-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(parseISO(dateRange.start), 'MMM dd')} - {format(parseISO(dateRange.end), 'MMM dd, yyyy')}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} />
                </button>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
                    <div className="space-y-4">
                      {/* Quick Filters */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {quickFilters.map((filter) => (
                            <button
                              key={filter.label}
                              onClick={() => handleQuickFilter(filter)}
                              className="px-3 py-2 text-sm bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-200 text-left"
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Custom Date Range */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Range</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={dateRange.start}
                              onChange={(e) => handleDateRangeChange('start', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">End Date</label>
                            <input
                              type="date"
                              value={dateRange.end}
                              onChange={(e) => handleDateRangeChange('end', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Apply Button */}
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
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
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 btn-hover"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <SummaryCards stats={summaryStats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryDonutChart data={getCategoryData(filteredData)} />
          <PaymentModeChart data={getPaymentModeData(filteredData)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyStackedBarChart data={getDailySpendData(filteredData)} />
          <FrequencyChart data={getFrequencyData(filteredData)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 flex items-center justify-center card-shadow">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {filteredData.length}
              </div>
              <div className="text-gray-600">Total Transactions</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 card-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Array.from(new Set(filteredData.map(e => e.category))).length}
                </div>
                <div className="text-gray-600 text-sm">Categories</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Array.from(new Set(filteredData.map(e => e.mode))).length}
                </div>
                <div className="text-gray-600 text-sm">Payment Modes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable data={filteredData} />

        {/* Setup Instructions */}
        {filteredData.length <= 5 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">🚀 Connect Your Google Sheets</h3>
            <div className="text-gray-700 space-y-3">
              <p>You're currently viewing sample data. To connect your Google Sheets:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Open your Google Sheet with expense data</li>
                <li>Go to <strong>File → Share → Publish to web</strong></li>
                <li>Choose <strong>"Comma-separated values (.csv)"</strong> and <strong>"Entire Document"</strong></li>
                <li>Copy the generated URL</li>
                <li>Replace the <code className="bg-gray-200 px-2 py-1 rounded text-sm">SHEET_URL</code> in <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/utils/fetchSheetData.ts</code></li>
              </ol>
              <p className="text-sm text-gray-600 mt-4">
                Make sure your sheet has these columns: Date, Mode, Category, Sub Category, For, Amount, Description, Priority, Avoidable, Frequency
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 border-t border-gray-200/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>Built with React, TypeScript, and Chart.js • Hosted on GitHub Pages</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;