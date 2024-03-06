import { createContext, useState } from "react";

export const loginData = createContext(null);

function Context({ children }) {
  
    return (
      <loginData.Provider value={{  }}>
        {children}
      </loginData.Provider>
    );
  }

  export default Context;