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

interface FrequencyChartProps {
  data: any;
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold' as const,
          size: 11
        },
        formatter: (value: number) => {
          return `₹${value}`;
        },
        anchor: 'end' as const,
        align: 'top' as const
      },
      legend: {
        display: false
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
            const value = context.parsed.y;
            return `Amount: ₹${value.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
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
        borderRadius: 8,
        borderSkipped: false,
      }
    }
  };

  // Enhanced data with gradient colors
  const enhancedData = {
    ...data,
    datasets: [{
      ...data.datasets[0],
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 2,
      hoverBackgroundColor: '#34D399',
      hoverBorderColor: '#10B981'
    }]
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Spend by Frequency</h3>
      <div className="h-80">
        <Bar data={enhancedData} options={options} />
      </div>
    </div>
  );
};

export default FrequencyChart;