import Delete from "@/components/notes";
import NewNote from "@/components/newNote";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center mt-20">
      <div className="flex items-center gap-4">
        Hey, {user?.email}
        <form action={signOut} className="mb-5">
          <button className="py-2 px-4 rounded-md no-underline bg-red-600">
            Logout
          </button>
        </form>
      </div>
      <NewNote />
      <p className="mt-10 text-lg">
        Tap a title or content to edit and click update.
      </p>
      <Delete />
    </main>
  );
}
