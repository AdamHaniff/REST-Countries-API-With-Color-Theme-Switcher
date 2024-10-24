import { useState, useEffect, useRef, createContext, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

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
