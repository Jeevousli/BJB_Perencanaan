import { redirect } from "next/navigation";

// Halaman utama (/) akan langsung dilempar (redirect) ke /login
export default function Home() {
    redirect("/login");
}
