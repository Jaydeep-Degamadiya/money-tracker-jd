import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentModeChartProps {
  data: any;
}

const PaymentModeChart: React.FC<PaymentModeChartProps> = ({ data }) => {
  // Convert bar chart data to donut chart format
  const donutData = {
    labels: data.labels,
    datasets: [{
      data: data.datasets[0].data,
      backgroundColor: [
        '#8B5CF6', // purple
        '#10B981', // emerald
        '#F59E0B', // amber
        '#EF4444', // red
        '#3B82F6', // blue
        '#EC4899', // pink
        '#06B6D4', // cyan
        '#84CC16'  // lime
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#374151',
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
                strokeStyle: data.datasets[0].borderColor,
                lineWidth: data.datasets[0].borderWidth,
                hidden: false,
                index: index
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
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
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 card-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Mode Analysis</h3>
      <div className="h-80">
        <Doughnut data={donutData} options={options} />
      </div>
    </div>
  );
};

export default PaymentModeChart;