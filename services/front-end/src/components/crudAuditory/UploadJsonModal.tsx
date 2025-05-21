import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { validateAuditoryJson } from "./auditoryValidation";
import { AuditFormData, AxiosError } from "./auditoryTypes";

interface UploadJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (jsonData: AuditFormData) => Promise<void>;
}

export const UploadJsonModal: React.FC<UploadJsonModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'application/json') {
      setUploadError('El archivo debe ser de tipo JSON (.json)');
      return;
    }
    
    setUploadedFile(file);
  };
  
  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadError('No se ha seleccionado ningún archivo');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Read file content
      const fileContent = await uploadedFile.text();
      let jsonData;
      
      // Parse JSON and validate structure
      try {
        jsonData = JSON.parse(fileContent);
        validateAuditoryJson(jsonData);
      } catch (err) {
        const error = err as Error;
        setUploadError(`Error en el formato JSON: ${error.message}`);
        setIsUploading(false);
        return;
      }
      
      // Submit to API via parent component
      await onUpload(jsonData);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadedFile(null);
      
    } catch (err) {
      console.error("Error al subir auditoría:", err);
      const error = err as AxiosError;
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error desconocido';
      setUploadError(`Error al subir la auditoría: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Subir Auditoría (JSON)</h2>
        
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Estructura requerida del JSON:</h3>
          <pre className="text-xs overflow-x-auto p-2 bg-white border border-blue-100 rounded">
{`{
  "program": "Nombre del programa de auditoría",
  "sections": [
    {
      "section": "1",
      "title": "Título de la sección",
      "subsections": [
        {
          "subsection": "1.1",
          "title": "Título de la subsección",
          "questions": [
            {
              "id": "1.1.1",
              "text": "Texto de la pregunta",
              "options": [
                { "value": "yes", "label": "Sí", "description": "Descripción de la opción" },
                { "value": "partial", "label": "Parcialmente", "description": "Descripción de la opción" },
                { "value": "no", "label": "No", "description": "Descripción de la opción" },
                { "value": "na", "label": "No aplica", "description": "Descripción de la opción" }
              ],
              "response": null,
              "observations": "",
              "evidence_url": ""
            }
          ]
        }
      ]
    }
  ]
}`}
          </pre>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Archivo JSON:
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center"
              type="button"
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar archivo
            </button>
            <span className="text-gray-600 text-sm">
              {uploadedFile ? uploadedFile.name : 'Ningún archivo seleccionado'}
            </span>
          </div>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
          {uploadedFile && (
            <p className="mt-2 text-sm text-green-600">
              Archivo seleccionado correctamente
            </p>
          )}
        </div>
        
        {uploadError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {uploadError}
          </div>
        )}
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            disabled={!uploadedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir Auditoría
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};