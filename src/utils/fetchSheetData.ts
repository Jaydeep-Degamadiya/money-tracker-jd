import Papa from 'papaparse';
import { parseISO, format, isValid } from 'date-fns';
import { ExpenseData } from '../types/expense';

// Replace with your Google Sheets CSV export URL
// Instructions: 
// 1. Open your Google Sheet
// 2. Go to File > Share > Publish to web
// 3. Choose "Comma-separated values (.csv)" and "Entire Document"
// 4. Copy the generated URL and replace the SHEET_URL below
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1fB0UFnkNs2Qx0QSJZUVO1LY82hJ2WubnF1oxmNXhFOc/export?format=csv&gid=0';

export const fetchExpenseData = async (): Promise<ExpenseData[]> => {
  // Check if the URL is still the placeholder
  if (SHEET_URL.includes('YOUR_SHEET_ID')) {
    console.log('Using sample data - please configure your Google Sheets URL');
    return getSampleData();
  }

  try {
    const response = await fetch(SHEET_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Check if we actually got CSV data
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Empty response from Google Sheets');
    }
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        quotes: true,
        quoteChar: '"',
        escapeChar: '"',
        transformHeader: (header: string) => {
          // Transform headers to match our interface
          const headerMap: { [key: string]: string } = {
            'Date': 'date',
            'Mode': 'mode',
            'Category': 'category',
            'Sub Category': 'subCategory',
            'For': 'for',
            'Amount': 'amount',
            'Description': 'description',
            'Priority': 'priority',
            'Avoidable': 'avoidable',
            'Frequency': 'frequency'
          };
          return headerMap[header] || header.toLowerCase().replace(/\s+/g, '');
        },
        transform: (value: string, header: string) => {
          if (header === 'date') {
            if (!value || value.trim() === '') return '';
            
            // Try to parse the date and reformat to consistent YYYY-MM-DD format
            try {
              const parsedDate = parseISO(value.trim());
              if (isValid(parsedDate)) {
                return format(parsedDate, 'yyyy-MM-dd');
              } else {
                // Try parsing other common date formats
                const dateFormats = [
                  // MM/DD/YYYY
                  /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
                  // DD/MM/YYYY
                  /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
                  // MM-DD-YYYY
                  /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
                  // DD-MM-YYYY
                  /^(\d{1,2})-(\d{1,2})-(\d{4})$/
                ];
                
                for (const formatRegex of dateFormats) {
                  const match = value.trim().match(formatRegex);
                  if (match) {
                    // Assume MM/DD/YYYY format for now
                    const [, month, day, year] = match;
                    const testDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (isValid(testDate)) {
                      return format(testDate, 'yyyy-MM-dd');
                    }
                  }
                }
                
                console.warn(`Invalid date format: ${value}`);
                return '';
              }
            } catch (error) {
              console.warn(`Error parsing date: ${value}`, error);
              return '';
            }
          }
          if (header === 'amount') {
            const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
            return isNaN(numValue) ? 0 : numValue;
          }
          return value?.trim() || '';
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
            // Only reject if there are critical errors, not just warnings
            const criticalErrors = results.errors.filter(error => 
              error.type === 'FieldMismatch' || error.type === 'TooFewFields'
            );
            if (criticalErrors.length > 0) {
              reject(new Error(`Critical CSV parsing errors: ${JSON.stringify(criticalErrors)}`));
              return;
            }
          }
          
          // Filter out any invalid rows
          const validData = (results.data as ExpenseData[]).filter(row => 
            row.date && row.date.trim() !== '' && row.amount && typeof row.amount === 'number'
          );
          
          resolve(validData);
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching expense data:', error);
    console.log('Falling back to sample data');
    // Return sample data for demo purposes
    return getSampleData();
  }
};

const getSampleData = (): ExpenseData[] => {
  return [
    {
      date: '2024-01-15',
      mode: 'Credit Card',
      category: 'Food',
      subCategory: 'Restaurant',
      for: 'Dinner',
      amount: 45.50,
      description: 'Italian restaurant',
      priority: 'Medium',
      avoidable: 'Yes',
      frequency: 'Weekly'
    },
    {
      date: '2024-01-14',
      mode: 'Cash',
      category: 'Transport',
      subCategory: 'Petrol',
      for: 'Car',
      amount: 60.00,
      description: 'Gas station',
      priority: 'High',
      avoidable: 'No',
      frequency: 'Weekly'
    },
    {
      date: '2024-01-13',
      mode: 'Debit Card',
      category: 'Shopping',
      subCategory: 'Grocery',
      for: 'Food',
      amount: 120.75,
      description: 'Weekly groceries',
      priority: 'High',
      avoidable: 'No',
      frequency: 'Weekly'
    },
    {
      date: '2024-01-12',
      mode: 'UPI',
      category: 'Entertainment',
      subCategory: 'Cinema',
      for: 'Leisure',
      amount: 25.00,
      description: 'Movie tickets',
      priority: 'Low',
      avoidable: 'Yes',
      frequency: 'Monthly'
    },
    {
      date: '2024-01-11',
      mode: 'Credit Card',
      category: 'Bills',
      subCategory: 'Electricity',
      for: 'Electricity',
      amount: 85.30,
      description: 'Monthly electricity bill',
      priority: 'High',
      avoidable: 'No',
      frequency: 'Monthly'
    },
    {
      date: '2024-01-10',
      mode: 'Debit Card',
      category: 'Food',
      subCategory: 'Delivery',
      for: 'Lunch',
      amount: 18.75,
      description: 'Thai food delivery',
      priority: 'Medium',
      avoidable: 'Yes',
      frequency: 'Daily'
    },
    {
      date: '2024-01-09',
      mode: 'Cash',
      category: 'Transport',
      subCategory: 'Bus',
      for: 'Commute',
      amount: 12.50,
      description: 'Bus fare',
      priority: 'High',
      avoidable: 'No',
      frequency: 'Daily'
    },
    {
      date: '2024-01-08',
      mode: 'Credit Card',
      category: 'Shopping',
      subCategory: 'Clothes',
      for: 'Personal',
      amount: 89.99,
      description: 'Winter jacket',
      priority: 'Medium',
      avoidable: 'No',
      frequency: 'Yearly'
    },
    {
      date: '2024-01-07',
      mode: 'UPI',
      category: 'Health',
      subCategory: 'Medicine',
      for: 'Medicine',
      amount: 32.40,
      description: 'Prescription medication',
      priority: 'High',
      avoidable: 'No',
      frequency: 'Monthly'
    },
    {
      date: '2024-01-06',
      mode: 'Debit Card',
      category: 'Entertainment',
      subCategory: 'Netflix',
      for: 'Subscription',
      amount: 15.99,
      description: 'Netflix subscription',
      priority: 'Low',
      avoidable: 'Yes',
      frequency: 'Monthly'
    },
    {
      date: '2024-01-05',
      mode: 'Cash',
      category: 'Food',
      subCategory: 'Cafe',
      for: 'Beverage',
      amount: 4.50,
      description: 'Morning coffee',
      priority: 'Low',
      avoidable: 'Yes',
      frequency: 'Daily'
    },
    {
      date: '2024-01-04',
      mode: 'Credit Card',
      category: 'Bills',
      subCategory: 'Broadband',
      for: 'Utilities',
      amount: 49.99,
      description: 'Monthly internet bill',
      priority: 'High',
      avoidable: 'No',
      frequency: 'Monthly'
    },
    {
      date: '2024-01-03',
      mode: 'UPI',
      category: 'Transport',
      subCategory: 'Uber',
      for: 'Travel',
      amount: 22.30,
      description: 'Uber ride',
      priority: 'Medium',
      avoidable: 'Yes',
      frequency: 'Weekly'
    },
    {
      date: '2024-01-02',
      mode: 'Debit Card',
      category: 'Shopping',
      subCategory: 'Toiletries',
      for: 'Hygiene',
      amount: 28.75,
      description: 'Shampoo and soap',
      priority: 'Medium',
      avoidable: 'No',
      frequency: 'Monthly'
    },
    {
      date: '2024-01-01',
      mode: 'Cash',
      category: 'Entertainment',
      subCategory: 'Restaurant',
      for: 'Celebration',
      amount: 75.00,
      description: 'New Year dinner',
      priority: 'Low',
      avoidable: 'Yes',
      frequency: 'Yearly'
    }
  ];
};