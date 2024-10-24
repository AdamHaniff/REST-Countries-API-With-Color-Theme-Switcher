import { useContext } from "react";
import { ThemeContext } from "./App";

export default function ErrorMessage({ message }) {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  return (
    <span className={`error-message ${!isLightTheme ? "white-color" : ""}`}>
      {message}
    </span>
  );
}
