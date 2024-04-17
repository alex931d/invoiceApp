import dayjs from "dayjs";
import { Invoice, PaymentTerms, Status } from "../models/generalModels";

const invoice1: Invoice = {
  uuid: "1",
  address: "123 Main St",
  city: "New York",
  postCode: 10001,
  country: "USA",
  client: {
    Name: "Client A",
    Email: "clientA@example.com",
    Address: "456 Elm St",
    City: "New York",
    postCode: "10001",
    country: "USA",
  },
  date: dayjs(new Date("2024-04-01")),
  paymentTerms: PaymentTerms.Net15Days,
  description: "Services rendered for April 2024",
  itemList: [
    { name: "Service 1", qty: 1, price: 100, total: 100 },
    { name: "Service 2", qty: 2, price: 50, total: 100 },
  ],
  status: Status.draft,
  amount: 200,
};

const invoice2: Invoice = {
  uuid: "2",
  address: "789 Oak St",
  city: "Los Angeles",
  postCode: 90001,
  country: "USA",
  client: {
    Name: "Client B",
    Email: "clientB@example.com",
    Address: "987 Pine St",
    City: "Los Angeles",
    postCode: "90001",
    country: "USA",
  },
  date: dayjs(new Date("2024-04-05")),
  paymentTerms: PaymentTerms.Net15Days,
  description: "Services rendered for April 2024",
  itemList: [
    { name: "Service 3", qty: 1, price: 150, total: 150 },
    { name: "Service 4", qty: 3, price: 40, total: 120 },
  ],
  status: Status.pending,
  amount: 270,
};

export { invoice1, invoice2 };
