import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExpenseData } from '../types/expense';

interface TransactionTableProps {
  data: ExpenseData[];
}

type SortField = keyof ExpenseData;
type SortDirection = 'asc' | 'desc';

const TransactionTable: React.FC<TransactionTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    category: '',
    mode: '',
    priority: '',
    avoidable: ''
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(expense => {
      const matchesSearch = Object.values(expense)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || expense.category === filters.category;
      const matchesMode = !filters.mode || expense.mode === filters.mode;
      const matchesPriority = !filters.priority || expense.priority === filters.priority;
      const matchesAvoidable = !filters.avoidable || expense.avoidable === filters.avoidable;

      return matchesSearch && matchesCategory && matchesMode && matchesPriority && matchesAvoidable;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortField === 'date') {
        aValue = new Date(aValue as string);
        bValue = new Date(bValue as string);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, filters, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const uniqueCategories = Array.from(new Set(data.map(expense => expense.category)));
  const uniqueModes = Array.from(new Set(data.map(expense => expense.mode)));
  const uniquePriorities = Array.from(new Set(data.map(expense => expense.priority)));

  const exportToCSV = () => {
    const headers = ['Date', 'Mode', 'Category', 'Sub Category', 'For', 'Amount', 'Description', 'Priority', 'Avoidable', 'Frequency'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map(expense => [
        expense.date,
        expense.mode,
        expense.category,
        expense.subCategory,
        expense.for,
        expense.amount,
        `"${expense.description}"`,
        expense.priority,
        expense.avoidable,
        expense.frequency
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="chart-container rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-xl font-semibold text-white mb-4 lg:mb-0 flex items-center gap-2">
          <div className="w-2 h-6 gradient-bg-danger rounded-full"></div>
          Transaction History
        </h3>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-3 btn-primary rounded-xl transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 input-dark rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-3 input-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={filters.mode}
          onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
          className="px-4 py-3 input-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Modes</option>
          {uniqueModes.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="px-4 py-3 input-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          {uniquePriorities.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>

        <select
          value={filters.avoidable}
          onChange={(e) => setFilters({ ...filters, avoidable: e.target.value })}
          className="px-4 py-3 input-dark rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Yes">Avoidable</option>
          <option value="No">Essential</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm table-dark">
          <thead>
            <tr className="border-b border-white/10">
              {[
                { key: 'date', label: 'Date' },
                { key: 'mode', label: 'Mode' },
                { key: 'category', label: 'Category' },
                { key: 'subCategory', label: 'Sub Category' },
                { key: 'amount', label: 'Amount' },
                { key: 'description', label: 'Description' },
                { key: 'priority', label: 'Priority' },
                { key: 'avoidable', label: 'Type' },
                { key: 'frequency', label: 'Frequency' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="text-left py-4 px-4 font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors duration-200"
                  onClick={() => handleSort(key as SortField)}
                >
                  <div className="flex items-center gap-2">
                    {label}
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((expense, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                <td className="py-4 px-4 text-gray-300">{expense.date}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 badge-info rounded-full text-xs font-medium">
                    {expense.mode}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                    {expense.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-300">{expense.subCategory}</td>
                <td className="py-4 px-4 text-white font-bold">₹{expense.amount.toLocaleString('en-IN')}</td>
                <td className="py-4 px-4 text-gray-300 max-w-xs truncate">{expense.description}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    expense.priority === 'High' 
                      ? 'badge-danger'
                      : expense.priority === 'Medium'
                      ? 'badge-warning'
                      : 'badge-success'
                  }`}>
                    {expense.priority}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    expense.avoidable === 'Yes' 
                      ? 'badge-danger'
                      : 'badge-success'
                  }`}>
                    {expense.avoidable === 'Yes' ? 'Avoidable' : 'Essential'}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-300">{expense.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-gray-400 text-sm">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;