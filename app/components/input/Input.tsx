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
      <label htmlFor={name}>{label}</label>
      <input type={type} {...getInputProps({ id: name })} />
      {error && <span className="my-error-class">{error}</span>}
    </div>
  );
};
