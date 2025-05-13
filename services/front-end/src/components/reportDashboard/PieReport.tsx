import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
  labels: string[];
}

const PieReport: React.FC<PieChartProps> = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Datos de Pastel',
        data,
        backgroundColor: [
          'rgb(59, 130, 246)',  // Azul
          'rgb(16, 185, 129)',  // Verde
          'rgb(239, 68, 68)',   // Rojo
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieReport;
