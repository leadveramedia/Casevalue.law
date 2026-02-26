import { createContext, useContext } from 'react';

const EmbedContext = createContext(false);

export function EmbedProvider({ children, isEmbed = false }) {
  return (
    <EmbedContext.Provider value={isEmbed}>
      {children}
    </EmbedContext.Provider>
  );
}

export function useIsEmbed() {
  return useContext(EmbedContext);
}
