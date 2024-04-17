import { FormikValues } from "formik";
import { item } from "../models/generalModels";
import { Invoice } from "../models/generalModels";
export const generateRandomId = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const randomChars = Array.from({ length: 2 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  );
  const randomNumbers = Array.from({ length: 4 }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  );

  return randomChars.join("") + randomNumbers.join("");
};

export const addInvoice = (
  values: FormikValues,
  projectId: number | string | null,
  addInvoice: (id: number | string | null, newInvoice: Invoice) => void
) => {
  if (values) {
    const totalAmount = values.itemList.reduce(
      (total: number, currentItem: item) => {
        return total + (currentItem.total || 0);
      },
      0
    );
    const item: Invoice = {
      uuid: values.uuid,
      address: values.address,
      city: values.city,
      postCode: values.postCode,
      country: values.country,
      client: {
        Name: values.client.Name,
        Email: values.client.Email,
        Address: values.client.Address,
        City: values.client.City,
        postCode: values.client.postCode,
        country: values.client.country,
      },
      date: values.date,
      paymentTerms: values.paymentTerms,
      description: values.projectDesc,
      itemList: values.itemList,
      status: values.status,
      amount: totalAmount,
    };
    addInvoice(projectId, item);
  }
};
export const updateInvoice = (
  values: FormikValues,
  projectId: number | string | null,
  update: (
    id: number | string | null,
    uuid: string,
    updatedInvoiceData: Partial<Invoice>
  ) => void
) => {
  if (values) {
    const totalAmount = values.itemList.reduce(
      (total: number, currentItem: item) => {
        return total + (currentItem.total || 0);
      },
      0
    );
    const item: Invoice = {
      uuid: values.uuid,
      address: values.address,
      city: values.city,
      postCode: values.postCode,
      country: values.country,
      client: {
        Name: values.client.Name,
        Email: values.client.Email,
        Address: values.client.Address,
        City: values.client.City,
        postCode: values.client.postCode,
        country: values.client.country,
      },
      date: values.date,
      paymentTerms: values.paymentTerms,
      description: values.projectDesc,
      itemList: values.itemList,
      status: values.status,
      amount: totalAmount,
    };
    if (item.uuid) {
      update(projectId, item.uuid, item);
    }
  }
};
