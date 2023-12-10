import prisma from "@/prisma/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const NewNote = async () => {
  async function create(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const email = user?.email as string;

      await prisma.note.create({
        data: {
          email: email,
          title: title,
          content: body,
        },
      });
      revalidatePath("/");
    } catch (error) {}
  }

  return (
    <form action={create} className="text-black flex flex-col gap-4">
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Title"
        className="text-lg p-3 rounded-md"
      />
      <textarea
        name="body"
        id="body"
        placeholder="Body"
        className="text-lg p-3 rounded-md"
      />
      <button className="text-white bg-blue-600 p-2 text-lg rounded-md">
        Create
      </button>
    </form>
  );
};

export default NewNote;
