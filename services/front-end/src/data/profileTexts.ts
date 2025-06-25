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
          placeholder: "Ej: ACME S.A.",
          required: true
        },
        {
          type: "text",
          label: "NIT",
          placeholder: "Ej: 900123456-7",
          required: true
        },
        {
          type: "email",
          label: "Email de la Compañía",
          placeholder: "Ej: contacto@acme.com",
          required: true
        },
        {
          type: "phone",
          label: "Teléfono",
          placeholder: "Ej: +57 3001234567",
          required: true
        },
        {
          type: "text",
          label: "Dirección",
          placeholder: "Ej: Calle 123 #45-67, Bogotá",
          required: true
        },        {
          type: "select",
          label: "Área empresarial",
          options: ['Tecnología',
                    'Finanzas',
                    'Salud',
                    'Educación',
                    'Manufactura',
                    'Comercio',
                    'Servicios',
                    'Construcción',
                    'Transporte',
                    'Entretenimiento',
                    'Agricultura',
                    'Otro',],
          required: true
        },
        {
          type: "radio",
          label: "Número de Empleados",
          options: ["Menos de 50", "Entre 50 y 149", "Entre 150 y 299", "Entre 300 y 399", "Entre 400 y 500", "Más de 500"],
          required: true
        }        
      ]
    },
    "userProfile": {
      title: "Perfil de Usuario",
      description: `Por favor, completa la siguiente información para crear tu perfil de usuario. Esta información será utilizada para identificarte dentro de la plataforma.`,
      inputs: [
        {
          type: "subtitle",
          label: "Información Personal"
        },
        {
          type: "text",
          label: "Email",
          placeholder: "Ej: Sebastian@gmail.com",
          required: true
        },
        {
          type: "password",
          label: "Contraseña",
          placeholder: "Ej: ********",
          required: true
        },
        {
          type: "select",
          label: "Rol",
          options: ['Administrador',
                    'Auditor'],
          required: true
        },
      ]
    }
};

  