import { useState } from "react";
import controlTexts from "../../../public/locales/es/translation.json"



type ControlTextSection = {
  title: string;
  description: string;
  inputs: ControlInput[];
};
const controlTextsTyped = (controlTexts as any).controlTexts  as Record<string, ControlTextSection>;


type InputType = "radio" | "text" | "subtitle" | "conditional";

type BaseInput = {
  id: string;
  type: InputType;
  label: string;
};

type RadioOption = {
  value: string;
  label: string;
};

type RadioInput = BaseInput & {
  type: "radio";
  options: RadioOption[];
};

type SubtitleInput = BaseInput & {
  type: "subtitle";
};

type ConditionalInput = BaseInput & {
  type: "conditional";
  condition: string;
  inputs: (RadioInput | SubtitleInput)[];
};

type ControlInput = RadioInput | SubtitleInput | ConditionalInput;

type ControlrendererProps = {
  controlId: string;
};

export default function Controlrenderer({ controlId }: ControlrendererProps) {
  

  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Usar un ID por defecto si no se proporciona
  const useControlId = controlId || "seccionA";
  
  // Obtener los datos desde las traducciones
  const title = controlTextsTyped[useControlId]?.title;
const description = controlTextsTyped[useControlId]?.description;
const inputs = controlTextsTyped[useControlId]?.inputs;

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const evaluateCondition = (condition: string) => {
    const expressions = condition.split("||").map(exp => exp.trim());
    return expressions.some(expression => {
      const [id, expectedValueRaw] = expression.split("==").map(s => s.trim());
      const expectedValue = expectedValueRaw?.replace(/['"]/g, "");
      return answers[id] === expectedValue;
    });
  };

  const renderInputs = (inputs: ControlInput[], prefix = "") => {
    if (!Array.isArray(inputs)) return null;
    
    return inputs.map((input) => {
      const fullId = prefix ? `${prefix}.${input.id}` : input.id;
  
      switch (input.type) {
        case "subtitle":
          return (
            <div key={fullId} className="mb-4">
              <h3 className="text-lg font-semibold">{input.label}</h3>
            </div>
          );
  
        case "radio":
          return (
            <div key={fullId} className="mb-4">
              <label className="block font-semibold mb-1">{input.label}</label>
              {input.options.map((opt, idx) => (
                <div key={idx}>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name={fullId}
                      value={opt.value}
                      onChange={() => handleChange(fullId, opt.value)}
                      checked={answers[fullId] === opt.value}
                    />
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          );
  
        case "conditional":
          if (evaluateCondition(input.condition)) {
            return (
              <div key={fullId} className="pl-4 border-l-2 border-gray-300 ml-2">
                {renderInputs(input.inputs, fullId)}
              </div>
            );
          }
          return null;
  
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex flex-col overflow-y-auto p-6 bg-white font-sans rounded-lg shadow-md text-black text-left m-4 border border-opacity-30 border-gray-300">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="text-sm mb-4 text-gray-600">{description}</p>}
      {inputs && renderInputs(inputs)}
    </div>
  );
}