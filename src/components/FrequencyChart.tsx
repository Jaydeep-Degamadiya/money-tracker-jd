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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FrequencyChartProps {
  data: any;
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
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
          color: '#f1f5f9',
          borderColor: '#e2e8f0'
        },
        ticks: {
          color: '#64748b',
          font: {
            family: 'Inter'
          }
        }
      },
      y: {
        grid: {
          color: '#f1f5f9',
          borderColor: '#e2e8f0'
        },
        ticks: {
          color: '#64748b',
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

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 card-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Spend by Frequency</h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FrequencyChart;