import { Dayjs } from "dayjs";
interface User {
  _id: string | number;
  email: string;
  role: string;
  avatar: string | Blob;
  projects: Project[];
}
interface Data {
  user: User;
  data: Project;
}
interface Project {
  _id: string | number | null;
  name: string;
  description: string;
  invoices: Invoice[];
}
enum Status {
  paid,
  draft,
  pending,
}
enum Filter {
  Name,
  Latest,
  paid,
  pending,
  draft,
}
enum PaymentTerms {
  Net30Days,
  Net15Days,
}
interface Client {
  Name: string;
  Email: string;
  Address: string;
  City: string;
  postCode: string;
  country: string;
}
interface item {
  name: string;
  qty: number;
  price: number;
  total: number;
}
interface Invoice {
  uuid: string | null;
  address: string | null;
  city: string | null;
  postCode: number | null;
  country: string | null;
  client: Client;
  date: Dayjs | Date | null;
  paymentTerms: PaymentTerms;
  description: string | null;
  itemList: item[] | null;
  status: Status;
  amount: number;
}
export { PaymentTerms, Status, Filter };
export type { Invoice, Client, Project, User, item, Data };
