import { useSearchParams } from "@remix-run/react";
import { useDebouncedCallback } from "use-debounce";

export default function Search({
  placeholder,
  query,
}: {
  placeholder: string;
  query: string | null;
}) {
  const [searchParams, setSearachParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSearch = useDebouncedCallback((term: string) => {
    term ? params.set("search", term) : params.delete("search");
    setSearachParams(params);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={query || ""}
      />
    </div>
  );
}
