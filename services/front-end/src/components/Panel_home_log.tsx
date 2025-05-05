export const Content = () => {
  return (
    <div className="flex justify-center items-start w-full min-h-screen pt-32 font-sans">
      <div className="max-w-4xl bg-white p-12 rounded-xl shadow-lg flex flex-col items-center font-sans">
        
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          BIENVENIDO DE NUEVO A LA PLATAFORMA DE AUDITORÍA       
        </h1>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full pt-10 mb-12">
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
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-700">
            Nueva Auditoría
          </button>
          <button className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-xl hover:bg-gray-300">
            Ver Auditorías
          </button>
        </div>

        {/* Tarjetas resumen */}
      </div>
    </div>
  );
};

export default Content;