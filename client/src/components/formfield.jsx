import React from 'react';

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={name} className="font-semibold text-gray-700">
          {labelName}
        </label>
        {isSurpriseMe && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="text-sm text-[#6469ff] font-medium hover:underline"
          >
            Surprise Me
          </button>
        )}
      </div>

      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6469ff]"
      />
    </div>
  );
};

export default FormField;
