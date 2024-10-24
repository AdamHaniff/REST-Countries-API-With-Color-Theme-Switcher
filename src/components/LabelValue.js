export default function LabelValue({ label, value }) {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  return (
    <div
      className={`details__label-value ${!isLightTheme ? "white-color" : ""}`}
    >
      <span className="details__label">{label}:&nbsp;</span>
      <span className="details__value">{value}</span>
    </div>
  );
}
