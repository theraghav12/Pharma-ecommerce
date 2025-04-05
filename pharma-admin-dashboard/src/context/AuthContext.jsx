import { createContext, useReducer } from "react";

// Initial state
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

// Reducer function
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { user: null };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext(INITIAL_STATE);

// Provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
