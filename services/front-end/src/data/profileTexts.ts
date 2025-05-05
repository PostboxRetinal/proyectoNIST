// profileTexts.ts
export const profileTexts = {
    "businessProfile": {
      title: "Perfil de la Empresa",
      description: `Por favor, completa la siguiente información para crear el perfil de tu empresa. Esta información será utilizada para identificar tu organización dentro de la plataforma.`,
      inputs: [
        {
          type: "subtitle",
          label: "Información de la Empresa"
        },
        {
          type: "text",
          label: "Nombre de la Empresa",
          placeholder: "Ej: ACME S.A."
        },
        {
          type: "text",
          label: "NIT",
          placeholder: "Ej: 900123456-7"
        },
        {
          type: "email",
          label: "Email de la Compañía",
          placeholder: "Ej: contacto@acme.com"
        },
        {
          type: "text",
          label: "Teléfono",
          placeholder: "Ej: +57 3001234567"
        },
        {
          type: "text",
          label: "Dirección",
          placeholder: "Ej: Calle 123 #45-67, Bogotá"
        },
        {
          type: "text",
          label: "Area empresarial",
          placeholder: "Ej: Tecnología, Manufactura, Servicios"
        },
        {
          type: "radio",
          label: "Número de Empleados",
          options: ["Menos de 50", "Entre 50 y 149", "Entre 150 y 299", "Entre 300 y 399", "Entre 400 y 500", "Más de 500"]
        },
        {
          type: "password",
          label: "Contraseña",
          placeholder: "Ingresa tu contraseña"
        },
        {
          type: "password",
          label: "Confirmar Contraseña",
          placeholder: "Confirma tu contraseña"
        }
      ]
    }
};

  