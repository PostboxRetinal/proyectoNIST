import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
  labels: string[];
  backgroundColor?: string | string[];
  title?: string;
}

// Definición de tipo para el tooltip en ChartJS
interface ChartTooltipItem extends TooltipItem<'pie'> {
  parsed: number;
  label: string;
}

const PieReport: React.FC<PieChartProps> = ({ 
  data, 
  labels, 
  backgroundColor = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)'
  ], 
  title = 'Resultados por Sección' 
}) => {
  
  // Asegurarse de que haya suficientes colores para todos los datos
  let bgColors = backgroundColor;
  if (typeof backgroundColor === 'string') {
    // Si solo se proporciona un color, creamos un array del tamaño necesario
    bgColors = Array(data.length).fill(backgroundColor);
  } else if (backgroundColor.length < data.length) {
    // Si no hay suficientes colores, repetimos los disponibles
    const originalColors = [...backgroundColor];
    while (bgColors.length < data.length) {
      bgColors = [...bgColors, ...originalColors];
    }
    bgColors = bgColors.slice(0, data.length);
  }
  
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: bgColors,
        borderColor: Array.isArray(bgColors) 
          ? bgColors.map(color => color.replace(')', ', 1)').replace('rgb', 'rgba'))
          : bgColors.replace(')', ', 1)').replace('rgb', 'rgba'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          boxWidth: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: ChartTooltipItem) {
            // Ahora usamos un tipo específico en lugar de any
            const value = tooltipItem.parsed || 0;
            return `${tooltipItem.label}: ${value}%`;
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default PieReport;