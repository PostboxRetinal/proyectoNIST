import { Link } from "react-router-dom";

export const Content = () => {
  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-32 font-sans">
      <div className="max-w-3xl bg-white p-10 rounded-xl shadow-lg flex flex-col items-center font-sans">
        
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          BIENVENIDO DE NUEVO A LA PLATAFORMA DE AUDITORÍA       
        </h1>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full pt-8 mb-10">
          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg text-center min-h-[180px]">
            <p className="text-9xl font-bold text-blue-600">4</p>
            <p className="text-3xl text-gray-600">Auditorías Activas</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg text-center min-h-[180px]">
            <p className="text-9xl font-bold text-yellow-600">2</p>
            <p className="text-3xl text-gray-600">Pendientes por Aprobar</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl shadow-lg text-center min-h-[180px]">
            <p className="text-9xl font-bold text-green-600">1</p>
            <p className="text-3xl text-gray-600">Programadas este Mes</p>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 text-center mb-8">
          Gestiona, revisa y controla auditorías internas de manera eficiente para el constante 
          mejoramiento de la empresa y la optimización de sus procesos.
        </p>


        {/* Botones de acción rápida */}
        <div className="flex gap-8 mb-8">
        <Link to="/newauditory" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-xl ">
            Nueva Auditoría
          </Link>
          <Link to="/iso27001" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-xl hover:bg-gray-300">
            Ver Auditorías
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Content;
