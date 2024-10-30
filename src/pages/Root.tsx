import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import IntroModal from "../components/IntroModal";

export default function Root({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-screen min-h-screen flex-col">
      <IntroModal />
      <Header />
      <main className="px-6 py-6 md:px-12">
        <BreadCrumb />
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
