// authRoutes.ts - Ejemplo de rutas de API que utilizan nuestro manejo de errores
import { Elysia, t } from 'elysia';
import { AuthExampleService } from '../services/authExample';
import { createErrorResponse } from '../utils/firebaseErrors';

// Crea un grupo de rutas de autenticación
export const authRoutes = new Elysia({ prefix: "/auth" })
  // Ruta para iniciar sesión con Google
  .get("/google", async ({ error }) => {
    try {
      const user = await AuthExampleService.signInWithGoogle();
      return {
        success: true,
        message: "Inicio de sesión con Google exitoso",
        userId: user.uid
      };
    } catch (err) {
      const errorResponse = createErrorResponse(err, "Error al iniciar sesión con Google");
      return error(400, {
        success: false,
        message: errorResponse.message,
        errorCode: errorResponse.errorCode
      });
    }
  }, {
    detail: {
      summary: "Inicio de sesión con Google",
      description: "Inicia sesión usando proveedor de Google",
      tags: ["Autenticación"]
    }
  })
  
  // Ruta para iniciar sesión con GitHub
  .get("/github", async ({ error }) => {
    try {
      const user = await AuthExampleService.signInWithGithub();
      return {
        success: true,
        message: "Inicio de sesión con GitHub exitoso",
        userId: user.uid
      };
    } catch (err) {
      const errorResponse = createErrorResponse(err, "Error al iniciar sesión con GitHub");
      return error(400, {
        success: false,
        message: errorResponse.message,
        errorCode: errorResponse.errorCode
      });
    }
  }, {
    detail: {
      summary: "Inicio de sesión con GitHub",
      description: "Inicia sesión usando proveedor de GitHub",
      tags: ["Autenticación"]
    }
  })
  
  // Ruta para vincular cuentas
  .post("/link-email", async ({ body, error }) => {
    try {
      const { email, password } = body as any;
      const user = await AuthExampleService.linkEmailAccount(email, password);
      return {
        success: true,
        message: "Cuenta de correo vinculada exitosamente",
        userId: user.uid
      };
    } catch (err) {
      const errorResponse = createErrorResponse(err, "Error al vincular cuenta de correo");
      return error(400, {
        success: false,
        message: errorResponse.message,
        errorCode: errorResponse.errorCode
      });
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 })
    }),
    detail: {
      summary: "Vincular cuenta de correo",
      description: "Vincula una cuenta de correo electrónico al usuario actual",
      tags: ["Autenticación"]
    }
  })
  
  // Ruta para reautenticar usuario
  .post("/reauthenticate", async ({ body, error }) => {
    try {
      const { email, password } = body as any;
      await AuthExampleService.reauthenticateUser(email, password);
      return {
        success: true,
        message: "Usuario reautenticado exitosamente"
      };
    } catch (err) {
      const errorResponse = createErrorResponse(err, "Error al reautenticar usuario");
      return error(400, {
        success: false,
        message: errorResponse.message,
        errorCode: errorResponse.errorCode
      });
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    }),
    detail: {
      summary: "Reautenticar usuario",
      description: "Reautentica al usuario actual para operaciones sensibles",
      tags: ["Autenticación"]
    }
  })
  
  // Ruta para eliminar cuenta
  .delete("/account", async ({ error }) => {
    const result = await AuthExampleService.deleteAccount();
    
    if (!result.success) {
      // Si no fue exitoso, es un error
      return error(400, {
        success: false,
        message: result.message,
        errorCode: result.errorCode
      });
    }
    
    return {
      success: true,
      message: "Cuenta eliminada exitosamente"
    };
  }, {
    detail: {
      summary: "Eliminar cuenta",
      description: "Elimina la cuenta del usuario actual",
      tags: ["Autenticación"]
    }
  }); 