import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer__main-content">
        <div className="footer__libraria">
          <img src="src/assets/libraria-logo.svg" alt="Libraria logo" />
          <h1>libraria</h1>
          <p className="footer__catchy-phrase">
            It's okay to be lazy from time to time, especially when reading books.
          </p>
        </div>

        <div>
          <Link to="/shop" className="footer__visit-shop">
            <button className="primary-button call-to-action">Visit shop</button>
          </Link>

          <Link to="/cart">
            <button className="default-button call-to-action">Check cart</button>
          </Link>
        </div>
      </div>

      <p className="footer__copyright-statement">&#169; 2023 Libraria; all rights reserved.</p>
    </footer>
  );
}
