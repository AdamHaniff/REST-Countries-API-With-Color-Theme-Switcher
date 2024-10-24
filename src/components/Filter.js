import { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "./App";

// VARIABLES
const filteredRegions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function Filter({
  filteredRegion,
  onRegionClick,
  onClearFilterClick,
}) {
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
