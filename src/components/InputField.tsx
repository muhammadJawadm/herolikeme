import React, { type InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

const InputField: React.FC<TextInputProps> = ({
  labelText,
  className = '',
  ...props
}) => {
  return (
    <div>
      {labelText && <label className="block text-sm font-medium text-gray-700 mb-1">{labelText}</label>}
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${className}`}
        {...props}
      />
    </div>
  )
}

export default InputField
