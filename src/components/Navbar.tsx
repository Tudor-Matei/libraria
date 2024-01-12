import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav--scrolling">
      <img className="nav__libraria-logo" src="src/assets/libraria-logo.svg" alt="Libraria logo" />

      <div className="nav__buttons">
        <Link to="/signin">
          <button className="default-button" id="signin">
            Sign in
          </button>
        </Link>

        <Link to="/shop">
          <button className="primary-button" id="shop">
            Visit shop
          </button>
        </Link>
      </div>
    </nav>
  );
}
