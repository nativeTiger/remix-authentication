import { Prisma } from "@prisma/client";
import { getUserId, requireUserId } from "~/session.server";
import { validationError } from "remix-validated-form";
import prismadb from "~/lib/prismadb";
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
import {
  messageCommitSession,
  getMessageSession,
  setSuccessMessage,
  setErrorMessage,
} from "~/toast-message.server";
import CategoryForm, {
  CategoryFormFieldValidator,
} from "~/routes/_app.categories/category-form";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return json({ message: "unauthenticate" });

  const session = await getMessageSession(request);
  try {
    const result = await CategoryFormFieldValidator.validate(
      await request.formData()
    );

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
  // const data = useActionData<typeof action>();

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
        <CategoryForm />
      </DialogContent>
    </Dialog>
  );
}
