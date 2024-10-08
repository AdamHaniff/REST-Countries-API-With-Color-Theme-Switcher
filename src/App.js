import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import countryCodes from "./data.js/countryCodes";

// VARIABLES
const filteredRegions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

// CONTEXTS
const ThemeContext = createContext();

export default function App() {
  // STATE
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [countries, setCountries] = useState([]);
  const [filteredRegion, setFilteredRegion] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFilterDisplayed, setIsFilterDisplayed] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // VARIABLES
  const navigate = useNavigate();

  // REFS
  const initialRender = useRef(true);
  const countriesData = useRef([]);

  // HANDLER FUNCTIONS
  const handleThemeChange = useCallback(() => {
    setIsLightTheme((lightTheme) => {
      const newTheme = !lightTheme;
      const colorTheme = newTheme ? "light" : "dark";

      // Save user's color theme preference in localStorage and update 'isLightTheme' state to 'newTheme'
      localStorage.setItem("theme", colorTheme);
      return newTheme;
    });
  }, []);

  function handleRegionClick(region) {
    if (region === filteredRegion) return;
    setFilteredRegion(region);

    // Update the 'countries' state with the 'filteredRegionsData'
    const filteredRegionsData = countriesData.current.filter(
      (country) => country.region === region
    );

    setCountries(filteredRegionsData);
  }

  function handleCountryClick(countryObj) {
    // Update 'selectedCountry'
    setSelectedCountry(countryObj);

    // Check if the countryObj has a cca3 property before navigating
    if (countryObj.cca3) {
      navigate(`/country/${countryObj.cca3}`);
    }
  }

  function handleBackBtnClick() {
    // Set 'selectedCountry' back to its default value
    setSelectedCountry(null);

    // Go back to homepage
    navigate("/");
  }

  function handleBorderCountryClick(borderCountry) {
    const borderCountryObj = countriesData.current.find(
      (country) => country.name.common === borderCountry
    );

    handleCountryClick(borderCountryObj);
  }

  function handleClearFilterClick() {
    // Set 'filteredRegion' back to its default value and display all countries
    setFilteredRegion(null);
    setCountries(countriesData.current);
  }

  // FUNCTIONS
  async function fetchCountries() {
    try {
      setIsLoading(true);

      const res = await fetch("https://restcountries.com/v3.1/all");

      if (!res.ok) {
        throw new Error("🚨 Something went wrong fetching countries 🚨");
      }

      const data = await res.json();
      setCountries(data);

      // Update the ref with the fetched data
      countriesData.current = data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // EFFECTS
  useEffect(function () {
    // Fetch all countries when the page first loads
    fetchCountries();
  }, []);

  useEffect(
    function () {
      // VARIABLES
      const controller = new AbortController();

      async function fetchCountry() {
        try {
          // Update state variables
          setIsLoading(true);
          setError("");
          setIsFilterDisplayed(false);
          setFilteredRegion(null);

          const res = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("🚨 Something went wrong fetching country 🚨");
          }

          const data = await res.json();
          setCountries(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      // Prevent fetching on initial mount because 'countryName' is empty
      if (initialRender.current && !countryName) {
        initialRender.current = false;
        return;
      }

      // If the search field is cleared, display all countries and display 'Filter' component
      if (!countryName) {
        setCountries(countriesData.current);
        setIsFilterDisplayed(true);
        return;
      }

      fetchCountry();

      return () => controller.abort();
    },
    [countryName]
  );

  useEffect(
    function () {
      // On initial load, check if there is a stored theme
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setIsLightTheme(storedTheme === "light");
      } else {
        // Check the user's system preference to see if they prefer dark mode
        const prefersDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        if (prefersDarkMode) handleThemeChange();
      }
    },
    [handleThemeChange]
  );

  return (
    <ThemeContext.Provider value={isLightTheme}>
      <div className={`app ${!isLightTheme ? "ebony-clay-bg" : ""}`}>
        <Header onThemeChange={handleThemeChange} />

        <Routes>
          {/* Default Route (Home) */}
          <Route
            path="/"
            element={
              <div className="search-filter-countries">
                <SearchFilter
                  filteredRegion={filteredRegion}
                  onRegionClick={handleRegionClick}
                  countryName={countryName}
                  setCountryName={setCountryName}
                  isFilterDisplayed={isFilterDisplayed}
                  onClearFilterClick={handleClearFilterClick}
                />
                {isLoading && <Spinner />}
                {!isLoading && error && <ErrorMessage message={error} />}
                {!isLoading && !error && (
                  <Countries
                    countries={countries}
                    onCountryClick={handleCountryClick}
                  />
                )}
              </div>
            }
          />

          {/* Country Details Route */}
          <Route
            path="/country/:countryCode"
            element={
              <CountryDetails
                selectedCountry={selectedCountry}
                onBackBtnClick={handleBackBtnClick}
                onBorderCountryClick={handleBorderCountryClick}
                countriesData={countriesData}
              />
            }
          />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

function Header({ onThemeChange }) {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  // HANDLER FUNCTIONS
  function handleThemeSwitchClick() {
    onThemeChange();
  }

  return (
    <header className={`header ${!isLightTheme ? "dark-slate-grey-bg" : ""}`}>
      <h1 className={`header__title ${!isLightTheme ? "white-color" : ""}`}>
        Where in the world?
      </h1>
      <div className="theme-switcher">
        <button
          className="theme-switcher__button"
          aria-label="Switch color theme"
          onClick={handleThemeSwitchClick}
        >
          {isLightTheme ? (
            <svg
              className="theme-switcher__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8426 11.052C7.73486 11.052 5.21543 8.74226 5.21543 5.89457C5.21543 4.82024 5.57343 3.82526 6.18514 3C3.75229 3.75612 2 5.86498 2 8.35045C2 11.4708 4.75943 14 8.16286 14C10.8743 14 13.1757 12.3945 14 10.1636C13.1 10.7238 12.0129 11.052 10.8426 11.052Z"
                fill="white"
                stroke="#111517"
              />
            </svg>
          ) : (
            <svg
              className="theme-switcher__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
            >
              <path
                fill="#fff"
                d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
              />
            </svg>
          )}
          <span
            className={`theme-switcher__label ${
              !isLightTheme ? "white-color" : ""
            }`}
          >
            {isLightTheme ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>
    </header>
  );
}

function Spinner() {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  return (
    <div className={`spinner ${!isLightTheme ? "border-dark" : ""}`}></div>
  );
}

function ErrorMessage({ message }) {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  return (
    <span className={`error-message ${!isLightTheme ? "white-color" : ""}`}>
      {message}
    </span>
  );
}

function SearchFilter({
  filteredRegion,
  onRegionClick,
  countryName,
  setCountryName,
  isFilterDisplayed,
  onClearFilterClick,
}) {
  return (
    <div className="search-filter">
      <Search countryName={countryName} setCountryName={setCountryName} />
      {isFilterDisplayed && (
        <Filter
          filteredRegion={filteredRegion}
          onRegionClick={onRegionClick}
          onClearFilterClick={onClearFilterClick}
        />
      )}
    </div>
  );
}

function Search({ countryName, setCountryName }) {
  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  return (
    <div className={`search ${!isLightTheme ? "dark-slate-grey-bg" : ""}`}>
      <svg
        className="search__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          className={`search__icon-path ${!isLightTheme ? "white-fill" : ""}`}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1111 9.77778H10.4L10.1333 9.51111C11.0222 8.53333 11.5556 7.2 11.5556 5.77778C11.5556 2.57778 8.97778 0 5.77778 0C2.57778 0 0 2.57778 0 5.77778C0 8.97778 2.57778 11.5556 5.77778 11.5556C7.2 11.5556 8.53333 11.0222 9.51111 10.1333L9.77778 10.4V11.1111L14.2222 15.5556L15.5556 14.2222L11.1111 9.77778ZM5.77778 9.77778C3.55556 9.77778 1.77778 8 1.77778 5.77778C1.77778 3.55556 3.55556 1.77778 5.77778 1.77778C8 1.77778 9.77778 3.55556 9.77778 5.77778C9.77778 8 8 9.77778 5.77778 9.77778Z"
        />
      </svg>
      <input
        className={`search__input ${!isLightTheme ? "dark-slate-grey-bg" : ""}`}
        type="text"
        placeholder="Search for a country..."
        value={countryName}
        onChange={(e) => setCountryName(e.target.value)}
      />
    </div>
  );
}

function Filter({ filteredRegion, onRegionClick, onClearFilterClick }) {
  // STATE
  const [isRegionsDisplayed, setIsRegionsDisplayed] = useState(false);

  // VARIABLES
  const isLightTheme = useContext(ThemeContext);

  // REFS
  const filterRef = useRef(null);

  // HANDLER FUNCTIONS
  function handleFilterHeaderClick() {
    setIsRegionsDisplayed((isDisplayed) => !isDisplayed);
  }

  function handleRegionClick(region) {
    // Set the 'filteredRegion' to the region that was clicked and hide the filter options
    onRegionClick(region);
    setIsRegionsDisplayed(false);
  }

  function handleClearFilterClick() {
    // Hide the filter options, set 'filteredRegion' state back to its default value, and display all countries
    setIsRegionsDisplayed(false);
    onClearFilterClick();
  }

  // EFFECTS
  useEffect(
    function () {
      function handleOutsideClick(e) {
        // If the filtered regions are displayed and a click happens outside of the filter component, the filtered regions should no longer be displayed
        if (isRegionsDisplayed && !filterRef.current.contains(e.target)) {
          setIsRegionsDisplayed(false);
        }
      }

      document.addEventListener("mousedown", handleOutsideClick);

      // Clean up the event listener
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    },
    [isRegionsDisplayed]
  );

  return (
    <div className="filter" ref={filterRef}>
      <div
        className={`filter__header ${
          !isLightTheme ? "dark-slate-grey-bg" : ""
        }`}
        onClick={handleFilterHeaderClick}
      >
        <span className={`filter__label ${!isLightTheme ? "white-color" : ""}`}>
          {filteredRegion ? filteredRegion : "Filter by Region"}
        </span>
        <svg
          className={`filter__arrow-icon ${isRegionsDisplayed ? "rotate" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            className={`filter__arrow-icon-path ${
              !isLightTheme ? "white-fill" : ""
            }`}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.875 2.875L5 5.75L2.125 2.875L1.25 3.75L5 7.5L8.75 3.75L7.875 2.875Z"
          />
        </svg>
      </div>
      {isRegionsDisplayed && (
        <ul
          className={`filter__options ${
            !isLightTheme ? "dark-slate-grey-bg" : ""
          }`}
        >
          {filteredRegions.map((region) => (
            <li
              className={`filter__option ${!isLightTheme ? "white-color" : ""}`}
              key={region}
              onClick={() => handleRegionClick(region)}
            >
              {region}
            </li>
          ))}
          {filteredRegion && (
            <button
              className={`filter__clear-btn ${
                !isLightTheme ? "white-color" : ""
              }`}
              type="button"
              onClick={handleClearFilterClick}
            >
              Clear filter
            </button>
          )}
        </ul>
      )}
    </div>
  );
}

function Countries({ countries, onCountryClick }) {
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

function Country({ countryObj, onCountryClick }) {
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

function CountryDetails({
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
  const formattedLanguages = Object.values(languages).join(", ");
  const formattedBorderCountries = borderCountries.map(
    (country) => countryCodes[country]
  );
  const hasBorders = selectedCountry?.hasOwnProperty("borders") || false;
  const isLightTheme = useContext(ThemeContext);

  return (
    <div className="details">
      <div className="details__back-btn-container">
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
      </div>
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
                value={currencies === "N/A" ? currencies : formattedCurrencies}
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
  );
}

function LabelValue({ label, value }) {
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
