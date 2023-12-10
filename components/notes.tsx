import prisma from "@/prisma/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface Note {
  content: string;
  createdAt: Date;
  id: number;
  title: string;
}

async function fetchData() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  try {
    const notes = await prisma.note.findMany({
      where: {
        email: user?.email,
      },
    });
    return notes;
  } catch (error) {
    console.log(error);
  }
}

async function deleteNote(formData: FormData) {
  "use server";
  const noteId = formData.get("id") as string;
  const parsedId = parseInt(noteId);

  try {
    await prisma.note.delete({
      where: {
        id: parsedId,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

async function updateNotes(formData: FormData) {
  "use server";
  const noteId = formData.get("id") as string;
  const parsedId = parseInt(noteId);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  try {
    await prisma.note.update({
      where: { id: parsedId },
      data: {
        title: title,
        content: content,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

async function Delete() {
  const notes = await fetchData();

  return (
    <div className="flex justify-center flex-wrap gap-4 mt-4">
      {notes?.map((note) => (
        <div key={note.id} className="p-5 bg-slate-700 rounded-md">
          <form action={updateNotes} className="flex flex-col">
            <input type="hidden" name="id" value={note.id} />
            <input
              defaultValue={note.title}
              name="title"
              className="text-2xl font-bold bg-slate-700"
            />
            <textarea
              defaultValue={note.content as string}
              name="content"
              className="bg-slate-700"
            ></textarea>
            <button className="bg-blue-500 text-lg p-2 rounded-md mt-10 w-full">
              Update
            </button>
          </form>
          <form action={deleteNote}>
            <input type="hidden" name="id" value={note.id} />
            <button className="bg-red-500 text-lg p-2 rounded-md w-full mt-3">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default Delete;
