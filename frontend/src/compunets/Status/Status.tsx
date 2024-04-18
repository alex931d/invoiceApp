import "./Status.css";
import { Status as StatusType } from "../../models/generalModels";

interface StatusProps {
  type: StatusType;
}
function Status({ type }: StatusProps) {
  return (
    <>
      <div className="status" data-status={[StatusType[type]]}>
        <div className="status__circle"></div>
        <span className="status__text">{StatusType[type]}</span>
      </div>
    </>
  );
}
export default Status;
