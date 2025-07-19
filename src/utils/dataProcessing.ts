import { ExpenseData, SummaryStats } from '../types/expense';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const calculateSummaryStats = (data: ExpenseData[]): SummaryStats => {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const totalSpend = data.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyData = data.filter(expense => {
    try {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    } catch {
      return false;
    }
  });

  const monthlySpend = monthlyData.reduce((sum, expense) => sum + expense.amount, 0);
  
  const avoidableSpend = data
    .filter(expense => expense.avoidable.toLowerCase() === 'yes')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const nonAvoidableSpend = totalSpend - avoidableSpend;

  const categorySpend = data.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const modeSpend = data.reduce((acc, expense) => {
    acc[expense.mode] = (acc[expense.mode] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpend)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const topPaymentMode = Object.entries(modeSpend)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  return {
    totalSpend,
    monthlySpend,
    avoidableSpend,
    nonAvoidableSpend,
    topCategory,
    topPaymentMode
  };
};

export const getCategoryData = (data: ExpenseData[]) => {
  const categorySpend = data.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(categorySpend),
    datasets: [{
      data: Object.values(categorySpend),
      backgroundColor: [
        '#8B5CF6', // purple
        '#10B981', // emerald
        '#F59E0B', // amber
        '#EF4444', // red
        '#3B82F6', // blue
        '#8B5A2B', // brown
        '#EC4899', // pink
        '#6B7280'  // gray
      ],
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: '#ffffff'
    }]
  };
};

export const getPaymentModeData = (data: ExpenseData[]) => {
  const modeSpend = data.reduce((acc, expense) => {
    acc[expense.mode] = (acc[expense.mode] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(modeSpend),
    datasets: [{
      label: 'Amount Spent',
      data: Object.values(modeSpend),
      backgroundColor: '#8B5CF6',
      borderColor: '#A78BFA',
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };
};

export const getDailySpendData = (data: ExpenseData[]) => {
  const dailySpend = data.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) {
      acc[date] = {};
    }
    acc[date][expense.category] = (acc[date][expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const sortedDates = Object.keys(dailySpend).sort();
  const allCategories = Array.from(new Set(data.map(expense => expense.category)));

  const datasets = allCategories.map((category, index) => ({
    label: category,
    data: sortedDates.map(date => dailySpend[date][category] || 0),
    backgroundColor: [
      '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', 
      '#3B82F6', '#8B5A2B', '#EC4899', '#6B7280'
    ][index % 8],
    borderRadius: 4,
    borderSkipped: false,
  }));

  return {
    labels: sortedDates.map(date => format(parseISO(date), 'MMM dd')),
    datasets
  };
};

export const getAvoidableComparisonData = (data: ExpenseData[]) => {
  const categoryData = data.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { avoidable: 0, nonAvoidable: 0 };
    }
    if (expense.avoidable.toLowerCase() === 'yes') {
      acc[expense.category].avoidable += expense.amount;
    } else {
      acc[expense.category].nonAvoidable += expense.amount;
    }
    return acc;
  }, {} as Record<string, { avoidable: number; nonAvoidable: number }>);

  return {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Avoidable',
        data: Object.values(categoryData).map(item => item.avoidable),
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Non-Avoidable',
        data: Object.values(categoryData).map(item => item.nonAvoidable),
        backgroundColor: '#10B981',
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };
};

export const getFrequencyData = (data: ExpenseData[]) => {
  const frequencySpend = data.reduce((acc, expense) => {
    acc[expense.frequency] = (acc[expense.frequency] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(frequencySpend),
    datasets: [{
      label: 'Amount Spent',
      data: Object.values(frequencySpend),
      backgroundColor: '#10B981',
      borderColor: '#34D399',
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };
};

export const getSubCategoryData = (data: ExpenseData[]) => {
  const subCategorySpend = data.reduce((acc, expense) => {
    acc[expense.subCategory] = (acc[expense.subCategory] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(subCategorySpend),
    datasets: [{
      data: Object.values(subCategorySpend),
      backgroundColor: [
        '#A78BFA', // light purple
        '#34D399', // light emerald
        '#FBBF24', // light amber
        '#F87171', // light red
        '#60A5FA', // light blue
        '#A78B5A', // light brown
        '#F472B6', // light pink
        '#9CA3AF'  // light gray
      ],
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: '#ffffff'
    }]
  };
};