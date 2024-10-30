import { useContext } from "react";
import { BreadcrumbContext } from "../providers/BreadcrumbContext";

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};
