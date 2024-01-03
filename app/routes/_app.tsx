import { Outlet } from "@remix-run/react";
import { SideBar } from "~/components/sidebar/Sidebar";

export default function Layout() {
  return (
    <div>
      <aside className="w-72 px-4 py-2 h-screen overflow-y-auto fixed top-0">
        <SideBar />
      </aside>
      <div className="ml-72 w-[calc(100%_-_18rem)]">
        <header className="bg-yellow-50 sticky top-0 h-16">
          <h1>Header</h1>
        </header>
        <main className="mt-4 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
