import "./Footer.css";
import { Link } from "react-router-dom";
import IntergramIcon from "../../assets/instagram.svg";
import FacebookIcon from "../../assets/facebook-f.svg";
import TwitterIcon from "../../assets/twitter.svg";
function Footer() {
  return (
    <>
      <div className="footer-inner">
        <section className="about-section">
          <span className="heading-M">about us</span>
          <p>
            Magnis modipsae que voloratati andigen daepeditem quiate conecus aut
            labore. Laceaque quiae sitiorem rest non restibusaes maio es dem
            tumquam explabo.
          </p>
          <ul>
            <li>
              <img src={TwitterIcon} alt="" />
            </li>
            <li>
              <img src={FacebookIcon} alt="" />
            </li>
            <li>
              <img src={IntergramIcon} alt="" />
            </li>
          </ul>
        </section>
        <section className="link-section">
          <span className="heading-M">links</span>
          <ul>
            <li>
              <Link to="/dashboard">my dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard">login</Link>
            </li>
            <li>
              <Link to="/dashboard">logout</Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
export default Footer;
