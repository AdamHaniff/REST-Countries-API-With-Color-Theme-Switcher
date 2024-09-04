const filteredRegions = ["Africa", "America", "Asia", "Europe", "Oceania"];
const countries = [
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
  return (
    <div className="app">
      <Header />
      <SearchFilter />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1 className="header__title">Where in the world?</h1>
      <div className="theme-switcher">
        <button
          className="theme-switcher__button"
          aria-label="Switch color theme"
        >
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
          <span className="theme-switcher__label">Dark Mode</span>
        </button>
      </div>
    </header>
  );
}

function SearchFilter() {
  return (
    <div className="search-filter">
      <Search />
      <Filter />
    </div>
  );
}

function Search() {
  return (
    <div className="search">
      <svg
        className="search__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1111 9.77778H10.4L10.1333 9.51111C11.0222 8.53333 11.5556 7.2 11.5556 5.77778C11.5556 2.57778 8.97778 0 5.77778 0C2.57778 0 0 2.57778 0 5.77778C0 8.97778 2.57778 11.5556 5.77778 11.5556C7.2 11.5556 8.53333 11.0222 9.51111 10.1333L9.77778 10.4V11.1111L14.2222 15.5556L15.5556 14.2222L11.1111 9.77778ZM5.77778 9.77778C3.55556 9.77778 1.77778 8 1.77778 5.77778C1.77778 3.55556 3.55556 1.77778 5.77778 1.77778C8 1.77778 9.77778 3.55556 9.77778 5.77778C9.77778 8 8 9.77778 5.77778 9.77778Z"
          fill="#B2B2B2"
        />
      </svg>
      <input
        className="search__input"
        type="text"
        placeholder="Search for a country..."
      />
    </div>
  );
}

function Filter() {
  return (
    <div className="filter">
      <div className="filter__header">
        <span className="filter__label">Filter by Region</span>
        <svg
          className="filter__arrow-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.875 2.875L5 5.75L2.125 2.875L1.25 3.75L5 7.5L8.75 3.75L7.875 2.875Z"
            fill="black"
          />
        </svg>
      </div>
      <ul className="filter__options">
        {filteredRegions.map((region) => (
          <li className="filter__option" key={region}>
            {region}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Countries() {
  return (
    <div className="countries">
      {countries.map((country) => (
        <Country key={country.country} countryObj={country} />
      ))}
    </div>
  );
}

function Country({ countryObj }) {
  // VARIABLES
  const { countryFlag, country, population, region, capital } = countryObj;

  return <div className="country"></div>;
}
