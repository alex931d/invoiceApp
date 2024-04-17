import "./InvoiceEdit.css";
import { Project, User } from "../../../../models/generalModels";
import Sidebar from "../../../../compunets/Sidebar/Sidebar";
import "../dashboard/Dashboard.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Status from "../../../../compunets/Status/Status";
import { Modal } from "antd";
import { useDarkMode } from "../../../../contexts/themeContext";
import errorDraw from "../../../../assets/undraw_warning_re_eoyh.svg";
import dayjs from "dayjs";
import {
  PaymentTerms,
  Status as StatusProp,
} from "../../../../models/generalModels";
import { APIContext } from "../../../../contexts/mainContext";
import { useContext, useState } from "react";
import { updateInvoice as UpdateInvoice } from "../../../../lib/invoiceUpdate";
interface invoiceEditProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  user: User;
  data: Project;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InvoiceEdit({ isOpen, toggleDrawer, user, data }: invoiceEditProps) {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const { removeInvoice, updateInvoice } = useContext(APIContext);
  const { id } = useParams();
  const invoice = data.invoices.find((invoice) => invoice.uuid === id);

  const [modal1Open, setModal1Open] = useState(false);
  const handleDeletion = () => {
    if (invoice && invoice.uuid) {
      setModal1Open(false);
      removeInvoice(data._id, invoice.uuid);
      navigate("/dashboard");
    }
  };
  const handleMarkAsPaid = () => {
    UpdateInvoice(
      { ...invoice, status: StatusProp.paid },
      data._id,
      updateInvoice
    );
  };
  const handleMarkAsPending = () => {
    UpdateInvoice(
      { ...invoice, status: StatusProp.pending },
      data._id,
      updateInvoice
    );
  };
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-inner">
          <Sidebar
            isOpen={isOpen}
            toggleDrawer={toggleDrawer}
            user={user}
            data={data}
            invoice={invoice}
          />

          <div className="dashboard-inner__main invoice-edit">
            <Link className="invoice-edit__back" to="/dashboard">
              <span>Go back</span>
            </Link>
            <div className="dashboard-inner__main__header">
              <nav className="submenu">
                <div className="submenu__first">
                  <div className="submenu__first__row">
                    <span className="main-para">Status</span>
                    {invoice?.status !== undefined ? (
                      <Status type={invoice?.status} />
                    ) : (
                      <span className="main-para">no status defined</span>
                    )}
                  </div>
                </div>
                <div className="submenu__last">
                  <button onClick={toggleDrawer} className="btn edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => setModal1Open(true)}
                    className="btn delete-btn"
                  >
                    Delete
                  </button>
                  {invoice?.status !== StatusProp.paid ? (
                    <>
                      <button onClick={handleMarkAsPaid} className="btn">
                        Mark as Paid
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleMarkAsPending} className="btn">
                        Mark as Pending
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
            <div className="dashboard-inner__main__invoice">
              {invoice !== undefined && invoice !== null ? (
                <>
                  <div className="invoice-details">
                    <div className="invoice-details__header">
                      <div className="invoice-details__header__first__wrapper">
                        <div className="invoice-details__header__first">
                          <span className="main-para">{invoice?.uuid}</span>
                          <span className="main-para secound-para">
                            {invoice?.description || "no description"}
                          </span>
                        </div>
                        <div className="invoice-details__header__last">
                          <span className="main-para secound-para">
                            {invoice?.address}
                          </span>
                          <span className="main-para secound-para">
                            {invoice?.city}
                          </span>
                          <span className="main-para secound-para">
                            {invoice?.postCode}
                          </span>
                          <span className="main-para secound-para">
                            {invoice?.country}
                          </span>
                        </div>
                      </div>

                      <div className="invoice-details__subheader">
                        <div className="invoice-details__subheader__first">
                          <div className="invoice-details__subheader__column">
                            <span className="main-para secound-para">
                              Invoice Date
                            </span>
                            <span className="main-para">
                              {dayjs(invoice?.date).format("D MMM YYYY")}
                            </span>
                          </div>
                          <div className="invoice-details__subheader__column">
                            <span className="main-para secound-para">
                              Bill To
                            </span>
                            <span className="main-para">
                              {invoice?.client.Name}
                            </span>
                          </div>
                          <div className="invoice-details__subheader__column">
                            <span className="main-para secound-para">
                              sent to
                            </span>
                            <span className="main-para email">
                              {invoice?.client.Email}
                            </span>
                          </div>
                        </div>
                        <div className="invoice-details__subheader__last">
                          <div className="invoice-details__subheader__column">
                            <span className="main-para secound-para">
                              Payment Due
                            </span>
                            <span className="main-para">
                              {invoice?.paymentTerms !== undefined
                                ? PaymentTerms[invoice?.paymentTerms]
                                : "error"}
                            </span>
                          </div>
                          <div className="invoice-details__subheader__column">
                            <span className="main-para secound-para email">
                              {invoice?.client.Address}
                            </span>
                            <span className="main-para secound-para post-code">
                              {invoice?.client.postCode}
                            </span>
                            <span className="main-para secound-para country">
                              {invoice?.client.country}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="invoice-details__items">
                      <div className="invoice-details__items__wrapper">
                        <div className="invoice-details__items__item">
                          <span className="main-para secound-para">
                            Item name
                          </span>
                          <span className="main-para secound-para">QTY.</span>
                          <span className="main-para secound-para">Price</span>
                          <span className="main-para secound-para">Total</span>
                        </div>
                        {invoice?.itemList && invoice?.itemList.length > 0 ? (
                          <>
                            {invoice?.itemList.map((item, index) => (
                              <div
                                className="invoice-details__items__item"
                                key={index}
                              >
                                <span className="main-para">{item.name}</span>
                                <span className="main-para secound-para">
                                  {item.qty}
                                </span>
                                <span className="main-para secound-para">
                                  {item.price}
                                </span>
                                <span className="main-para">{item.total}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p>No items</p>
                        )}
                      </div>
                      <div className="invoice-details__items__bottom">
                        <span className="main-para">Amount Due</span>
                        <span className="main-para heading-M">
                          {invoice.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img src={errorDraw} alt=""></img>
                  <p className="main-para">
                    error please try refreshing the page
                  </p>
                </>
              )}
            </div>
            <div className="dashboard-inner__main__invoice__bottom--mobile">
              <button onClick={toggleDrawer} className="btn edit-btn">
                Edit
              </button>
              <button
                onClick={() => setModal1Open(true)}
                className="btn delete-btn"
              >
                Delete
              </button>
              {invoice?.status !== StatusProp.paid ? (
                <>
                  <button onClick={handleMarkAsPaid} className="btn">
                    Mark as Paid
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleMarkAsPending} className="btn">
                    Mark as Pending
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title=""
        centered
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={[]}
        data-theme={darkMode ? "dark" : "light"}
      >
        <div className="modal-wrapper">
          <span className="heading-M">confirm Deletion</span>
          <p className="main-para">
            Are you sure you want to delete this invoice #{invoice?.uuid}? this
            action cannot be undone.
          </p>
          <div className="modal__inner">
            <button
              onClick={() => setModal1Open(false)}
              className="btn edit-btn"
            >
              cancel
            </button>
            <button onClick={handleDeletion} className="btn delete-btn">
              delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default InvoiceEdit;
