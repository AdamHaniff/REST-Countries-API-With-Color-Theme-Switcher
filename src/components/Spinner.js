export default function Spinner() {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  return (
    <div className={`spinner ${!isLightTheme ? "border-dark" : ""}`}></div>
  );
}
