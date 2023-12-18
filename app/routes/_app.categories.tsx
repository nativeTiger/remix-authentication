import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  type LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { getUserId, requireUserId } from "~/session.server";
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import { Input } from "~/components/input/Input";
import prismadb from "~/lib/prismadb";
import {
  messageCommitSession,
  getMessageSession,
  setSuccessMessage,
  setErrorMessage,
} from "~/toast-message.server";
import { Prisma } from "@prisma/client";

export const validator = withZod(
  z.object({ name: z.string().min(1, { message: "Name is required" }).trim() })
);

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return json({ message: "unauthenticate" });

  const session = await getMessageSession(request);
  try {
    const result = await validator.validate(await request.formData());

    if (result.error) {
      return validationError(result.error);
    }

    const { name } = result.data;

    const categoryInput = {
      name,
      userId,
    };

    const category = await prismadb.category.create({ data: categoryInput });
    setSuccessMessage(session, "Category created successfully");
    return json(
      { category },
      { headers: { "Set-Cookie": await messageCommitSession(session) } }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        setErrorMessage(session, "Category name already exists");
      }
    }
    return json(
      { ok: false },
      {
        headers: { "Set-Cookie": await messageCommitSession(session) },
      }
    );
  }
};

export default function CategoryPage() {
  const isSubmitting = useIsSubmitting("add-category");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>create new category</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <ValidatedForm
            validator={validator}
            method="post"
            className="space-y-3"
            id="add-category"
          >
            <Input type="text" name="name" label="Category Name" />
            {/* <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>

              <DialogClose asChild></DialogClose>
            </DialogFooter> */}
            <Button type="submit" aria-disabled={isSubmitting}>
              Create
            </Button>
          </ValidatedForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
