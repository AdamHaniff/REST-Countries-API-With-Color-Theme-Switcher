import Country from "./Country";

export default function Countries({ countries, onCountryClick }) {
  return (
    <div className="countries">
      {countries.map((country) => (
        <Country
          key={country.name.common}
          countryObj={country}
          onCountryClick={onCountryClick}
        />
      ))}
    </div>
  );
}
