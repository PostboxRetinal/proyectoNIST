export const GuestHome = () => {
  return (
    <div className="flex justify-center items-start min-h-screen pt-32 font-sans">
      <div className="max-w-4xl w-full bg-white p-12 rounded-xl shadow-lg flex flex-col items-center font-sans">

        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Bienvenido a la Plataforma de Auditoría
        </h1>
        <p className="text-xl text-gray-600 text-center mb-10">
          Gestiona tus auditorías internas con facilidad y ayuda a tu
          organización a crecer de manera estructurada y segura.
        </p>

        {/* Sección de beneficios */}
        <div className="w-full bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            ¿Por qué hacer auditorías?
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-4 text-lg">
            <li>
              Detecta errores y desviaciones antes de que se conviertan en
              problemas.
            </li>
            <li>
              Mejora los procesos internos y aumenta la eficiencia operativa.
            </li>
            <li>
              Fomenta la transparencia y la confianza dentro de la organización.
            </li>
            <li>Cumple con normativas y estándares de calidad.</li>
            <li>Permite tomar decisiones basadas en datos reales.</li>
          </ul>
        </div>

        <p className="text-base text-gray-400 mt-10 text-center">
          Empieza hoy a mejorar tu empresa con auditorías digitales.
        </p>
      </div>
    </div>
  );
};

export default GuestHome;