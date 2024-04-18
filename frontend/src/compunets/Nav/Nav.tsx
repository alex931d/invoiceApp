import "./Nav.css";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <>
      <div className="menu">
        <div className="menu-inner center-1280">
          <div className="menu-inner__first-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
              <path
                fillRule="evenodd"
                d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
              />
            </svg>
            <span className="heading-L">InvoicePro</span>
          </div>
          <div className="menu-inner__last-container">
            <ul className="menu-inner__last-container-sub-menu">
              <li>
                <Link to="/login" className="btn main-btn">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export default Nav;
