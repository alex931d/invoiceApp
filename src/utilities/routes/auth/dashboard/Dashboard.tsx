import "./Dashboard.css";
import iconPlus from "../../../../assets/icon-plus.svg";
import Sidebar from "../../../../compunets/Sidebar/Sidebar";
import { Select } from "antd";
import EmptyIllustration from "../../../../assets/illustration-empty.svg";
import Invoice from "../../../../compunets/Invoice/Invoice";
import {
  Project,
  User,
  Filter,
  Status,
} from "../../../../models/generalModels";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface DashboardProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  user: User;
  data: Project;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Dashboard({ isOpen, toggleDrawer, user, data }: DashboardProps) {
  const [currentData, setCurrentData] = useState(data);
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  const handleChange = (value: Filter) => {
    setCurrentData({ ...data, invoices: data.invoices });
    let sortedInvoices = [...data.invoices];

    switch (value) {
      case Filter.Latest:
        sortedInvoices.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
        break;
      case Filter.Name:
        sortedInvoices.sort((a, b) => {
          return a.client.Name.localeCompare(b.client.Name);
        });
        break;
      case Filter.draft:
        sortedInvoices = data.invoices.filter(
          (invoice) => invoice.status === Status.draft
        );
        break;
      case Filter.paid:
        sortedInvoices = data.invoices.filter(
          (invoice) => invoice.status === Status.paid
        );
        break;
      case Filter.pending:
        sortedInvoices = data.invoices.filter(
          (invoice) => invoice.status === Status.pending
        );
        break;
      default:
        break;
    }

    setCurrentData({ ...data, invoices: sortedInvoices });
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
            invoice={null}
          />

          <div className="dashboard-inner__main">
            <div className="dashboard-inner__main__header">
              <nav className="submenu">
                <div className="submenu__first">
                  <h2 className="heading-L">Invoices</h2>
                  <span className="main-para">
                    there are {currentData.invoices.length} total invoices
                  </span>
                </div>
                <div className="submenu__last">
                  <div className="form-field">
                    <div className="input-field">
                      <Select
                        defaultValue={Filter.Name}
                        style={{
                          width: 100 + "%",
                          backgroundColor: "transparent",
                        }}
                        onChange={handleChange}
                      >
                        {Object.values(Filter)
                          .filter((value) => typeof value !== "number")
                          .map((_value, index) => (
                            <Select.Option key={index} value={index}>
                              {Filter[index]}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  </div>

                  <button onClick={toggleDrawer} className="btn add-btn">
                    <div className="img">
                      <img src={iconPlus} alt=""></img>
                    </div>
                    new invoice
                  </button>
                </div>
              </nav>
            </div>
            <div className="dashboard-inner__main__invoices">
              <div className="dashboard-inner__main__invoices__inner">
                {data.invoices.length > 0 ? (
                  <>
                    {currentData.invoices.map((item, index) => (
                      <Invoice
                        uuid={item.uuid}
                        date={item.date}
                        client={item.client}
                        amount={item.amount}
                        status={item.status}
                        key={index}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="dashboard-inner__main__invoices__inner__empty">
                      <img src={EmptyIllustration} alt=""></img>
                      <span className="heading-L">there is nothing here</span>
                      <p className="main-para">
                        Create an invoice by clicking the New invoice button and
                        get started
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
