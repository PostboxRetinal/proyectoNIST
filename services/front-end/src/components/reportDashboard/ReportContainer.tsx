import LineChart from './LineReport';
import BarChart from './BarReport';
import PieChart from './PieReport';

const ReportContainer: React.FC = () => {
  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril'];
  const data = [65, 59, 80, 81];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Gráfica de Líneas</h2>
        <LineChart data={data} labels={labels} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Gráfica de Barras</h2>
        <BarChart data={data} labels={labels} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Gráfica de Pastel</h2>
        <PieChart data={data} labels={labels} />
      </div>
    </div>
  );
};

export default ReportContainer;
