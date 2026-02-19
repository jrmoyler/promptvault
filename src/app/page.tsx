import { redirect } from "next/navigation";

// Root path redirects to the library page
export default function RootPage() {
  redirect("/library");
}
