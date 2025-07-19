export interface ExpenseData {
  date: string;
  mode: string;
  category: string;
  subCategory: string;
  for: string;
  amount: number;
  description: string;
  priority: string;
  avoidable: string;
  frequency: string;
}

export interface SummaryStats {
  totalSpend: number;
  monthlySpend: number;
  avoidableSpend: number;
  nonAvoidableSpend: number;
  topCategory: string;
  topPaymentMode: string;
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  category: string;
  mode: string;
  priority: string;
  avoidable: string;
}