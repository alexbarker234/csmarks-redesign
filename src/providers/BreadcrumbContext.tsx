import { createContext, ReactNode, useState } from "react";

interface BreadcrumbContextType {
  customTitles: Record<string, string>;
  setCustomTitle: (path: string, title: string) => void;
}

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});

  const setCustomTitle = (path: string, title: string) => {
    setCustomTitles((prevTitles) => ({ ...prevTitles, [path]: title }));
  };

  return (
    <BreadcrumbContext.Provider value={{ customTitles, setCustomTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
