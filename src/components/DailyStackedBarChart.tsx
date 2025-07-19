import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface DailyStackedBarChartProps {
  data: any;
}

const DailyStackedBarChart: React.FC<DailyStackedBarChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold' as const,
          size: 10
        },
        formatter: (value: number) => {
          return value > 20 ? `₹${value}` : '';
        },
        anchor: 'center' as const,
        align: 'center' as const
      },
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ₹${value.toLocaleString('en-IN')}`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: '#374151',
          borderColor: '#4b5563'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter'
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          color: '#374151',
          borderColor: '#4b5563'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter'
          },
          callback: (value: any) => `₹${value}`
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
      }
    }
  };

  // Enhanced data with better colors for dark theme
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset: any, index: number) => ({
      ...dataset,
      backgroundColor: [
        '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', 
        '#3B82F6', '#EC4899', '#06B6D4', '#84CC16'
      ][index % 8],
      borderColor: '#1f2937',
      borderWidth: 1
    }))
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Daily Spend by Category</h3>
      <div className="h-80">
        <Bar data={enhancedData} options={options} />
      </div>
    </div>
  );
};

export default DailyStackedBarChart;