export default function App() {
  return (
    <div className="app">
      <Header />
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
          <span className="theme-switcher__icon"></span>
          <span className="theme-switcher__label">Dark Mode</span>
        </button>
      </div>
    </header>
  );
}
