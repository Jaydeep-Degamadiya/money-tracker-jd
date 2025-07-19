import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface CategorySubcategoryChartProps {
  data: any;
}

const CategorySubcategoryChart: React.FC<CategorySubcategoryChartProps> = ({ data }) => {
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
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return percentage > 5 ? `${percentage}%` : '';
        }
      },
      legend: {
        position: 'right' as const,
        labels: {
          color: '#e5e7eb',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            family: 'Inter'
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            return data.labels.map((label: string, index: number) => {
              const value = data.datasets[0].data[index];
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[index],
                strokeStyle: '#1f2937',
                lineWidth: 2,
                hidden: false,
                index: index
              };
            });
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
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#1f2937',
        hoverBorderWidth: 3,
        hoverBorderColor: '#374151'
      }
    }
  };

  // Enhanced color palette for subcategories
  const enhancedData = {
    ...data,
    datasets: [{
      ...data.datasets[0],
      backgroundColor: [
        '#A855F7', // purple-500
        '#14B8A6', // teal-500
        '#F97316', // orange-500
        '#EF4444', // red-500
        '#3B82F6', // blue-500
        '#EC4899', // pink-500
        '#06B6D4', // cyan-500
        '#84CC16', // lime-500
        '#F59E0B', // amber-500
        '#8B5A2B', // brown
        '#6366F1', // indigo-500
        '#10B981'  // emerald-500
      ],
      borderColor: '#1f2937',
      borderWidth: 2
    }]
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Sub Category Breakdown</h3>
      <div className="h-80">
        <Doughnut data={enhancedData} options={options} />
      </div>
    </div>
  );
};

export default CategorySubcategoryChart;