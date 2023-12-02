import { useIsSubmitting } from "remix-validated-form";

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full flex space-x-4 gap-x-4 items-center px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 hover:text-white duration-300 justify-center"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
