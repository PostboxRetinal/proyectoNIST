import axios from "axios";
import { Auditory, AuditoryResponse, AuditFormData } from "../components/crudAuditory/auditoryTypes.ts";

const API_BASE_URL = "http://localhost:3000/api";

export const auditoryService = {
  // Obtener todas las auditorías
  getAllAudits: async (): Promise<Auditory[]> => {
    const response = await axios.get<AuditoryResponse>(`${API_BASE_URL}/forms/getForms`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: false
    });
    
    if (response.data && response.data.success) {
      return response.data.forms;
    }
    
    throw new Error('El formato de respuesta no es el esperado');
  },
  
  // Eliminar una auditoría
  deleteAudit: async (auditId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/forms/deleteForm/${auditId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Subir una nueva auditoría
  uploadAudit: async (jsonData: AuditFormData): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}/forms/newForm`,
      jsonData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  }
};