interface TextInputProps {
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?:"text" | "number" |"email"| "password",
  labelText?:string
}

const InputField: React.FC<TextInputProps> = ({
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  type,
labelText}) => {
  return (
     <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labelText}</label>
   <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${className}`}
    />
    </div>
  )
}

export default InputField
