import countryCodes from "../data.js/countryCodes";
import { useContext } from "react";
import { ThemeContext } from "./App";
import LabelValue from "./LabelValue";

export default function CountryDetails({
  selectedCountry,
  onBackBtnClick,
  onBorderCountryClick,
  countriesData,
}) {
  // VARIABLES
  const {
    flags: { png: flag } = { png: "N/A" },
    name: { common: name } = { common: "N/A" },
    altSpellings: [nativeName] = ["N/A"],
    population = "N/A",
    region = "N/A",
    subregion = "N/A",
    capital: [capital] = ["N/A"],
    tld: [tld] = ["N/A"],
    currencies = "N/A",
    languages = "N/A",
    borders: borderCountries = ["N/A"],
  } = selectedCountry || {};

  const formattedPopulation = population.toLocaleString();
  const formattedCurrencies = Object.values(currencies)
    .map((currency) => currency.name)
    .join(", ");
  const formattedLanguages = Object.values(languages).slice(0, 3).join(", ");
  const formattedBorderCountries = borderCountries
    .map((country) => countryCodes[country])
    .slice(0, 3);
  const hasBorders = selectedCountry?.hasOwnProperty("borders") || false;
  const isLightTheme = useContext(ThemeContext);

  return (
    <div className="details">
      <div className="details__container">
        <button
          className={`details__back-btn ${
            !isLightTheme ? "dark-slate-grey-bg" : ""
          }`}
          type="button"
          onClick={onBackBtnClick}
        >
          <svg
            className="details__back-arrow-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              className={`details__back-arrow-icon-path ${
                !isLightTheme ? "white-fill" : ""
              }`}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.81802 3.6967L6.87868 4.75736L3.3785 8.25754H16.7428L16.7428 9.74246H3.3785L6.87868 13.2426L5.81802 14.3033L0.514719 9L5.81802 3.6967Z"
              fill="#111517"
            />
          </svg>
          <span
            className={`details__back-btn-label ${
              !isLightTheme ? "white-color" : ""
            }`}
          >
            Back
          </span>
        </button>
        <div className="details__flag-overview">
          <img
            className="details__flag"
            src={flag}
            alt={name === "N/A" ? name : `${name} flag`}
          />
          <div className="details__overview-border">
            <div className="details__overview-container">
              <div className="details__name-overview">
                <span
                  className={`details__name ${
                    !isLightTheme ? "white-color" : ""
                  }`}
                >
                  {name}
                </span>
                <div className="details__overview">
                  <LabelValue label="Native Name" value={nativeName} />
                  <LabelValue label="Population" value={formattedPopulation} />
                  <LabelValue label="Region" value={region} />
                  <LabelValue label="Sub Region" value={subregion} />
                  <LabelValue label="Capital" value={capital} />
                </div>
              </div>
              <div className="details__overview">
                <LabelValue label="Top Level Domain" value={tld} />
                <LabelValue
                  label="Currencies"
                  value={
                    currencies === "N/A" ? currencies : formattedCurrencies
                  }
                />
                <LabelValue
                  label="Languages"
                  value={languages === "N/A" ? languages : formattedLanguages}
                />
              </div>
            </div>
            <div className="border-countries">
              {hasBorders ? (
                <>
                  <span
                    className={`border-countries__label ${
                      !isLightTheme ? "white-color" : ""
                    }`}
                  >
                    Border Countries:
                  </span>
                  <ul className="border-countries__container">
                    {formattedBorderCountries.map(
                      (borderCountry) =>
                        countriesData.current.some(
                          (country) => country.name.common === borderCountry
                        ) && (
                          <li
                            className={`border-countries__country ${
                              !isLightTheme
                                ? "dark-slate-grey-bg white-color box-shadow-dark"
                                : ""
                            }`}
                            key={borderCountry}
                            onClick={() => onBorderCountryClick(borderCountry)}
                          >
                            {borderCountry}
                          </li>
                        )
                    )}
                  </ul>
                </>
              ) : (
                <LabelValue label="Border Countries" value="N/A" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
