import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  data: number[];
  labels: string[];
}

const BarReport: React.FC<BarChartProps> = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Datos de Barras',
        data,
        backgroundColor: 'rgb(16, 185, 129)', // Verde Tailwind
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarReport;
