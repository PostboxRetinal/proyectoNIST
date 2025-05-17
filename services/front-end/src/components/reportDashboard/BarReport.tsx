import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  data: number[];
  labels: string[];
  backgroundColor?: string | string[];
  title?: string;
}

const BarReport: React.FC<BarChartProps> = ({ data, labels, backgroundColor = 'rgb(16, 185, 129)', title = 'Resultados por Sección' }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: Array.isArray(backgroundColor) 
          ? backgroundColor.map(color => color.replace(')', ', 0.8)').replace('rgb', 'rgba'))
          : backgroundColor.replace(')', ', 0.8)').replace('rgb', 'rgba'),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: any) => value + '%'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + context.raw + '%';
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BarReport;