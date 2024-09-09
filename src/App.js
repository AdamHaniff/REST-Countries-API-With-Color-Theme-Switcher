import { useState } from "react";

const filteredRegions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const data = [
  {
    countryFlag: "images/germany-flag.png",
    country: "Germany",
    population: "81,770,900",
    region: "Europe",
    capital: "Berlin",
  },
  {
    countryFlag: "images/usa-flag.png",
    country: "United States of America",
    population: "323,947,000",
    region: "Americas",
    capital: "Washington, D.C.",
  },
  {
    countryFlag: "images/brazil-flag.png",
    country: "Brazil",
    population: "206,135,893",
    region: "Americas",
    capital: "Brasília",
  },
  {
    countryFlag: "images/iceland-flag.png",
    country: "Iceland",
    population: "334,300",
    region: "Europe",
    capital: "Reykjavík",
  },
  {
    countryFlag: "images/afghanistan-flag.png",
    country: "Afghanistan",
    population: "27,657,145",
    region: "Asia",
    capital: "Kabul",
  },
  {
    countryFlag: "images/aland-islands-flag.png",
    country: "Åland Islands",
    population: "28,875",
    region: "Europe",
    capital: "Mariehamn",
  },
  {
    countryFlag: "images/albania-flag.png",
    country: "Albania",
    population: "2,886,026",
    region: "Europe",
    capital: "Tirana",
  },
  {
    countryFlag: "images/algeria-flag.png",
    country: "Algeria",
    population: "40,400,000",
    region: "Africa",
    capital: "Algiers",
  },
];

export default function App() {
  // STATE
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [countries, setCountries] = useState(data);
  const [filteredRegion, setFilteredRegion] = useState(null);

  // HANDLER FUNCTIONS
  function handleThemeChange() {
    setIsLightTheme((colorTheme) => !colorTheme);
  }

  function handleRegionClick(region) {
    setFilteredRegion(region);
    setCountries(data.filter((country) => country.region === region));
  }

  return (
    <div className={`app ${!isLightTheme ? "ebony-clay-bg" : ""}`}>
      <Header isLightTheme={isLightTheme} onThemeChange={handleThemeChange} />
      <div className="search-filter-countries">
        <SearchFilter
          isLightTheme={isLightTheme}
          filteredRegion={filteredRegion}
          onRegionClick={handleRegionClick}
        />
        <Countries isLightTheme={isLightTheme} countries={countries} />
      </div>
    </div>
  );
}

function Header({ isLightTheme, onThemeChange }) {
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

function SearchFilter({ isLightTheme, filteredRegion, onRegionClick }) {
  return (
    <div className="search-filter">
      <Search isLightTheme={isLightTheme} />
      <Filter
        isLightTheme={isLightTheme}
        filteredRegion={filteredRegion}
        onRegionClick={onRegionClick}
      />
    </div>
  );
}

function Search({ isLightTheme }) {
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
      />
    </div>
  );
}

function Filter({ isLightTheme, filteredRegion, onRegionClick }) {
  // STATE
  const [isDisplayed, setIsDisplayed] = useState(false);

  // HANDLER FUNCTIONS
  function handleFilterHeaderClick() {
    setIsDisplayed((isDisplayed) => !isDisplayed);
  }

  function handleRegionClick(region) {
    onRegionClick(region);
    setIsDisplayed(false);
  }

  return (
    <div className="filter">
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
          className={`filter__arrow-icon ${isDisplayed ? "rotate" : ""}`}
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
      {isDisplayed && (
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
        </ul>
      )}
    </div>
  );
}

function Countries({ isLightTheme, countries }) {
  return (
    <div className="countries">
      {countries.map((country) => (
        <Country
          isLightTheme={isLightTheme}
          key={country.country}
          countryObj={country}
        />
      ))}
    </div>
  );
}

function Country({ isLightTheme, countryObj }) {
  // VARIABLES
  const { countryFlag, country, population, region, capital } = countryObj;

  return (
    <div className="country">
      <img
        className="country__flag"
        src={countryFlag}
        alt={`${country} flag`}
      />
      <div
        className={`country__description ${
          !isLightTheme ? "dark-slate-grey-bg white-color" : ""
        }`}
      >
        <span className="country__name">{country}</span>
        <div className="country__details">
          <span className="country__info">
            <span className="bold">Population: </span>
            {population}
          </span>
          <span className="country__info">
            <span className="bold">Region: </span>
            {region}
          </span>
          <span className="country__info">
            <span className="bold">Capital: </span>
            {capital}
          </span>
        </div>
      </div>
    </div>
  );
}
