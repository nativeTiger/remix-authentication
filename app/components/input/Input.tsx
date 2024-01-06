import { useField } from "remix-validated-form";
import type { LoginFormFieldNameType } from "~/routes/_.login/route";
import type { SignUpFormFieldNameType } from "~/routes/_.signup/route";
import type { CategoryFormFieldNameType } from "~/routes/_app.categories._index/category-form";
import type { ProductFormFieldNameType } from "~/routes/_app.products/product-form";

type MyInputProps = {
  name:
    | CategoryFormFieldNameType
    | ProductFormFieldNameType
    | LoginFormFieldNameType
    | SignUpFormFieldNameType;
  label: string;
  type: "email" | "password" | "checkbox" | "text" | "number" | "textarea";
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
