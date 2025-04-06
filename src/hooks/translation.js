import React, { createContext, useState } from "react";
import { translation } from "../asset/italian";
export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [translate, setCurrentTranslation] = useState(translation);

  const setTranslation = (language) => {
    setCurrentTranslation(language);
  };

  return (
    <TranslationContext.Provider value={{ translate, setTranslation }}>
      {children}
    </TranslationContext.Provider>
  );
};