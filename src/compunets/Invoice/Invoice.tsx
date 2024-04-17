import "./Invoice.css";
import arrowRight from "../../assets/icon-arrow-right.svg";
import Status from "../Status/Status";
import { Invoice as InvoiceProp } from "../../models/generalModels";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
type InvoiceProps = Pick<
  InvoiceProp,
  "uuid" | "date" | "client" | "amount" | "status"
>;
function Invoice({ uuid, date, client, amount, status }: InvoiceProps) {
  return (
    <>
      <Link to={`/dashboard/invoice/${uuid}`}>
        <div className="invoice">
          <div className="invoice__inner">
            <div className="invoice__inner__first">
              <span className="invoice__inner__uuid main-para">#{uuid}</span>
              <span className="invoice__inner__date main-para">
                Due
                <span> </span>
                {dayjs(date).format("D MMM YYYY")}
              </span>
              <span className="invoice__inner__client main-para">
                {client.Name}
              </span>
            </div>
            <div className="invoice__inner__last">
              <span className="invoice__inner__total header-M">{amount}</span>
              <Status type={status} />
              <div className="arrow">
                <img src={arrowRight} alt=""></img>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
export default Invoice;
