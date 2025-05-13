import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

interface LineChartProps {
  data: number[];
  labels: string[];
}

const LineReport: React.FC<LineChartProps> = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Datos de Línea',
        data,
        borderColor: 'rgb(59, 130, 246)', // Azul Tailwind
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineReport;
