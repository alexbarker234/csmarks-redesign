import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import IntroModal from "../components/IntroModal";

export default function Root({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-screen min-h-screen flex-col">
      <IntroModal />
      <Header />
      <main className="px-6 py-8">{children ?? <Outlet />}</main>
    </div>
  );
}
