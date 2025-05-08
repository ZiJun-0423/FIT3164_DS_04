import { Link } from "react-router-dom";
import ThemeToggle from './ThemeToggle';
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img src="/afllogo.svg" alt="AFL Logo" className="logo" style={{ padding: "0px 32px 0px 20px"}} />
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <span className="divider">|</span>
          <Link to="/stats" className="nav-link">Stats</Link>
          <span className="divider">|</span>
          <Link to="/predictions" className="nav-link">Predictions</Link>
        </div>
      </div>

      <div className="nav-right">
        <ThemeToggle />
      </div>
    </nav>
  );
}
