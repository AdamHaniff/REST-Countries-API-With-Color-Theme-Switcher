export default function SearchFilter({
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
