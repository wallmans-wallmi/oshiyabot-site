import React, { useState } from 'react';

interface InlineInput {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'tel' | 'checkbox';
  placeholder?: string;
  label?: string;
  value?: string;
  inputMode?: 'text' | 'numeric' | 'tel';
  checked?: boolean;
}

interface InlineInputsProps {
  inputs: InlineInput[];
  onSubmit: (values: Record<string, string | boolean>) => void;
  submitLabel?: string;
}

export function InlineInputs({ inputs, onSubmit, submitLabel = 'המשך' }: InlineInputsProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const initialValues: Record<string, string | boolean> = {};
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        initialValues[input.id] = input.checked || false;
      } else {
        initialValues[input.id] = input.value || '';
      }
    });
    return initialValues;
  });

  const handleChange = (id: string, value: string | boolean) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <div className="space-y-3 mt-3">
      {inputs.map((input) => (
        <div key={input.id}>
          {input.type === 'checkbox' ? (
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-300 hover:border-purple-400 transition-all duration-200 bg-white">
              <input
                type="checkbox"
                checked={values[input.id] as boolean}
                onChange={(e) => handleChange(input.id, e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="flex-1 text-sm text-right">{input.label}</span>
            </label>
          ) : input.type === 'textarea' ? (
            <textarea
              value={values[input.id] as string}
              onChange={(e) => handleChange(input.id, e.target.value)}
              placeholder={input.placeholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200 resize-none"
              rows={3}
              style={{ minHeight: '44px' }}
            />
          ) : (
            <input
              type={input.type}
              value={values[input.id] as string}
              onChange={(e) => handleChange(input.id, e.target.value)}
              placeholder={input.placeholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white transition-all duration-200"
              style={{ minHeight: '44px' }}
              inputMode={input.inputMode}
              aria-label={
                input.type === 'tel' 
                  ? 'Israeli phone number for WhatsApp' 
                  : input.id === 'firstName' 
                    ? 'First name for WhatsApp messages' 
                    : input.placeholder
              }
            />
          )}
        </div>
      ))}
      
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.01] shadow-sm"
        style={{ minHeight: '44px' }}
      >
        {submitLabel}
      </button>
    </div>
  );
}