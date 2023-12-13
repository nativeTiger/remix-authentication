import { useField } from "remix-validated-form";

type MyInputProps = {
  name: string;
  label: string;
  type: "email" | "password" | "checkbox" | "text";
};

export const Input = ({ name, label, type }: MyInputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium pb-2 text-gray-600">
        {label}
      </label>
      <input
        type={type}
        {...getInputProps({ id: name })}
        className="outline-none w-full mt-1 text-gray-500 border-2 rounded-md px-4 py-1.5 duration-200 focus:border-gray-600"
      />
      {error && <p className="text-red-500 py-1 text-sm">{error}</p>}
    </div>
  );
};
