import { useField } from "remix-validated-form";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type ProductFormFieldNameType } from "~/routes/_app.products/product-form";

export type SelectInputType = { value: string; label: string };

export type SelectInputProps = {
  name: ProductFormFieldNameType;
  label: string;
  options: SelectInputType[];
};

export default function SelectInput({
  name,
  label,
  options,
}: SelectInputProps) {
  const { getInputProps, error, clearError } = useField(name);
  return (
    <div>
      <div className="relative">
        <Select {...getInputProps()} onValueChange={() => clearError()}>
          <SelectTrigger
            className={`${
              error ? "border-semantic-danger-500" : "border-grey-300"
            } outline-none w-full mt-1 text-gray-500 border-2
            rounded-md px-4 py-1.5 duration-200`}
          >
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="rounded-none shadow-base">
            <ScrollArea className="max-h-[238px] w-full p-2">
              <SelectGroup>
                {options.map((item, index) => (
                  <SelectItem value={item.value} key={index} className="p-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
        {error && (
          <p className="pt-1 text-red-500">
            <span className="pl-2">{error}</span>
          </p>
        )}
      </div>
    </div>
  );
}
