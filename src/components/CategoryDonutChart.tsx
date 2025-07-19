import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface CategoryDonutChartProps {
  data: any;
}

const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold' as const,
          size: 12
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
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
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
                strokeStyle: data.datasets[0].borderColor || '#1f2937',
                lineWidth: data.datasets[0].borderWidth || 2,
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

  // Enhanced color palette for dark theme
  const enhancedData = {
    ...data,
    datasets: [{
      ...data.datasets[0],
      backgroundColor: [
        '#8B5CF6', // purple
        '#10B981', // emerald
        '#F59E0B', // amber
        '#EF4444', // red
        '#3B82F6', // blue
        '#EC4899', // pink
        '#06B6D4', // cyan
        '#84CC16', // lime
        '#F97316', // orange
        '#8B5A2B'  // brown
      ],
      borderColor: '#1f2937',
      borderWidth: 2
    }]
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Spend by Category</h3>
      <div className="h-80">
        <Doughnut data={enhancedData} options={options} />
      </div>
    </div>
  );
};

export default CategoryDonutChart;