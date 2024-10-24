export default function Country({ countryObj, onCountryClick }) {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  const {
    flags: { png: countryFlag } = { png: "N/A" },
    name: { common: country } = { common: "N/A" },
    population = "N/A",
    region = "N/A",
    capital: [capital] = ["N/A"],
  } = countryObj;

  // Format the population with commas
  const formattedPopulation = population.toLocaleString();

  return (
    <div className="country" onClick={() => onCountryClick(countryObj)}>
      <img
        className="country__flag"
        src={countryFlag}
        alt={countryFlag === "N/A" ? countryFlag : `${country} flag`}
      />
      <div
        className={`country__description ${
          !isLightTheme ? "dark-slate-grey-bg white-color" : ""
        }`}
      >
        <span className="country__name">{country}</span>
        <div className="country__details">
          <span className="country__info">
            <span className="bold">Population:&nbsp;</span>
            {formattedPopulation}
          </span>
          <span className="country__info">
            <span className="bold">Region:&nbsp;</span>
            {region}
          </span>
          <span className="country__info">
            <span className="bold">Capital:&nbsp;</span>
            {capital}
          </span>
        </div>
      </div>
    </div>
  );
}
