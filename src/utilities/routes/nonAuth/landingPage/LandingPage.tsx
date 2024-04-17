import "../landingPage/LandingPage.css";
import screenshot1 from "../../../../assets/screenshot1.png";
import screenshot2 from "../../../../assets/screenshot2.png";
import screenshot3 from "../../../../assets/screenshot3.png";
import { Divider } from "antd";
import { Link } from "react-router-dom";

import Footer from "../../../../compunets/Footer/Footer";

function LandingPage() {
  return (
    <>
      <div className="landing-page-container">
        <div className="landing-page-container-header">
          <div className="landing-page-container-header-inner">
            <div className="hero-section center">
              <div className="hero-section-first">
                <h1 className="heanding-L">
                  🚀 Streamline Your Invoicing Process with InvoicePro
                </h1>
                <p className="main-para">
                  Simplify invoice management and boost productivity with
                  InvoicePro. Create, manage, and track invoices effortlessly,
                  empowering your business to thrive.
                </p>
                <Link to="/signup" className="btn">
                  Get Started
                </Link>
              </div>
              <div className="hero-section-secound">
                <img src={screenshot1} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="main-body">
          <div className="main-body-inner">
            <section className="first-section">
              <div className="first-section-inner center">
                <h2 className="heading-L">
                  Join Thousands of Users Managing Their Invoices Seamlessly
                </h2>
                <span className="l-large-text">
                  Join thousands of other users managing their invoices
                  seamlessly
                </span>
                <Divider />
                <div className="first-section-inner-row">
                  <div className="paragraph-container">
                    <ul>
                      <li>
                        <span className="l-large-text bold">
                          ✨ Easy Invoicing
                        </span>
                        <p>
                          Create and send professional invoices in minutes. With
                          InvoicePro, you can customize templates, add your
                          branding, and streamline your billing process.
                        </p>
                      </li>
                      <li>
                        <span className="l-large-text bold">
                          ✨ Effortless Tracking
                        </span>
                        <p>
                          Stay organized with real-time tracking of payments and
                          outstanding balances. InvoicePro helps you monitor
                          your financials and stay on top of your cash flow.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <img src={screenshot2} alt=""></img>
                </div>
              </div>
            </section>
            <section className="secound-section">
              <div className="secound-section-inner center">
                <h2 className="heading-L">🚀 benefits of invoicePro?</h2>

                <div className="secound-section-inner-row">
                  <ul>
                    <li>
                      <span className="heading-L bold">
                        Quickly view your invoices in one place
                      </span>
                      <p className="bold main-para">
                        provides a centralized platform where you can
                        effortlessly access and manage all your invoices in one
                        place. you can quickly locate, review, and update your
                        invoices.
                      </p>
                    </li>
                  </ul>

                  <img src={screenshot3} alt=""></img>
                </div>
                <Divider />
              </div>
            </section>
          </div>
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
export default LandingPage;
