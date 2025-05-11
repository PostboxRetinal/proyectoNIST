import AuditForm from './AuditForm';

const NewAuditory = () => {
  // Esta función se activará cuando se envíe el formulario
  const handleAuditCreation = (formData: any) => {
    console.log("Nueva auditoría creada:", formData);
    // Aquí iría la lógica para enviar los datos al backend
  };

  return (
    <div className="flex flex-col min-h-screen">
               
      <div className="flex-1 p-6 overflow-y-auto font-sans bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Crear Nueva Evaluación</h1>
          <AuditForm onSubmit={handleAuditCreation} />
        </div>
      </div>
    </div>
  );
};

export default NewAuditory;