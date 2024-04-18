import "./Drawer.css";
import * as Yup from "yup";
import dayjs from "dayjs";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikValues,
  FormikProps,
} from "formik";
import { Button, Select, DatePicker } from "antd";
import deleteIcon from "../../../assets/icon-delete.svg";
import { Invoice, Project } from "../../../models/generalModels";
import { PaymentTerms, item, Status } from "../../../models/generalModels";
import { generateRandomId } from "../../../lib/invoiceUpdate";
import {
  updateInvoice as UpdateInvoice,
  addInvoice as AddInvoice,
} from "../../../lib/invoiceUpdate";
import { APIContext } from "../../../contexts/mainContext";
import { useContext, useState } from "react";

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  data: Project;
  invoice?: Invoice | null | undefined;
}

const InvoiceSchema = Yup.object().shape({
  address: Yup.string().required("address is required"),
  city: Yup.string().required("City is required"),
  postCode: Yup.string().required("Post Code is required"),
  country: Yup.string().required("Country is required"),
  client: Yup.object().shape({
    Name: Yup.string().required("Client's Name is required"),
    Email: Yup.string()
      .email("Invalid email")
      .required("Client's Email is required"),
    Address: Yup.string().required("Street Address is required"),
    City: Yup.string().required("City is required"),
    postCode: Yup.string().required("Post Code is required"),
    country: Yup.string().required("Country is required"),
  }),
  date: Yup.date().required("Invoice Date is required"),
  paymentTerms: Yup.string().required("Payment Terms is required"),
  projectDesc: Yup.string(),
});
const Drawer = ({ isOpen, toggleDrawer, data, invoice }: DrawerProps) => {
  const [randomId] = useState(generateRandomId());
  const [currentInvoice, setCurrentInvoice] = useState<
    Invoice | null | undefined
  >(
    invoice || {
      uuid: randomId,
      address: "",
      city: "",
      postCode: 0,
      country: "",
      client: {
        Name: "",
        Email: "",
        Address: "",
        City: "",
        postCode: "",
        country: "",
      },
      date: dayjs(),
      paymentTerms: PaymentTerms.Net15Days,
      description: "",
      status: Status.pending,
      itemList: [],
      amount: 0,
    }
  );
  const { updateInvoice, addInvoice } = useContext(APIContext);
  const handleAddItem = () => {
    const newItemList = [
      ...(currentInvoice?.itemList || []),
      { name: "", qty: 0, price: 0, total: 0 },
    ];
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        itemList: newItemList,
      });
    }
  };
  const handleDeleteItem = (index: number) => {
    const updatedItems = [...(currentInvoice?.itemList || [])];
    updatedItems.splice(index, 1);
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        itemList: updatedItems,
      });
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof item,
    value: string | number | null
  ) => {
    if (currentInvoice) {
      setCurrentInvoice((prevInvoice) => {
        if (!prevInvoice) return null;

        const updatedItemList = [...(prevInvoice.itemList || [])];
        const updatedItem = {
          ...updatedItemList[index],
          [field]: value,
        } as item;

        if (field === "qty" || field === "price") {
          const qty = field === "qty" ? (value as number) : updatedItem.qty;
          const price =
            field === "price" ? (value as number) : updatedItem.price;
          updatedItem.total = qty * price;
        }

        updatedItemList[index] = updatedItem;

        return {
          ...prevInvoice,
          itemList: updatedItemList,
        } as Invoice;
      });
    }
  };

  const handleSubmit = (values: FormikValues) => {
    if (invoice) {
      UpdateInvoice(
        { ...values, itemList: currentInvoice?.itemList },
        data._id,
        updateInvoice
      );
    } else {
      AddInvoice(
        { ...values, itemList: currentInvoice?.itemList },
        data._id,
        addInvoice
      );
    }

    toggleDrawer();
  };
  return (
    <div>
      {isOpen && <div className="drawer-overlay" onClick={toggleDrawer}></div>}
      <div className={`drawer-container ${isOpen ? "open" : "closed"}`}>
        <div className="drawer-content">
          <div className="drawer-content__inner">
            <Formik
              initialValues={{
                uuid: currentInvoice?.uuid || randomId,
                address: currentInvoice?.address || "",
                city: currentInvoice?.city || "",
                postCode: currentInvoice?.postCode || "",
                country: currentInvoice?.country || "",

                amount: currentInvoice?.amount || "",
                client: {
                  Name: currentInvoice?.client.Name || "",
                  Email: currentInvoice?.client.Email || "",
                  Address: currentInvoice?.client.Address || "",
                  City: currentInvoice?.client.City || "",
                  postCode: currentInvoice?.client.postCode || "",
                  country: currentInvoice?.client.country || "",
                },
                date: dayjs(currentInvoice?.date) || null,
                paymentTerms:
                  currentInvoice?.paymentTerms || PaymentTerms.Net15Days,
                projectDesc: currentInvoice?.description || "",
                status: currentInvoice?.status || Status.pending,
                itemList: currentInvoice?.itemList || [],
              }}
              validationSchema={InvoiceSchema}
              onSubmit={(data) => {
                handleSubmit(data);
              }}
            >
              <Form className="sidebar-form">
                <div className="drawer-content__inner__header">
                  <span className="drawer-content__inner__header__heading heading-L">
                    {invoice ? "Edit" : "New Invoice"}
                    {invoice ? " #" + currentInvoice?.uuid : ""}
                  </span>
                </div>
                <div className="drawer-content__inner__header__main">
                  <div className="form-group">
                    <span>Bill From</span>
                    <div className="form-field">
                      <label>Street Address</label>
                      <div className="input-field">
                        <Field
                          type="text"
                          name="address"
                          placeholder={currentInvoice?.address}
                          className="input"
                          value={currentInvoice?.address}
                        />
                      </div>
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form-groupe__row">
                      <div className="form-field">
                        <label>City</label>
                        <div className="input-field">
                          <Field
                            type="text"
                            name="city"
                            placeholder={currentInvoice?.city}
                            className="input"
                          />
                        </div>
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="form-field">
                        <label>Post Code</label>
                        <div className="input-field">
                          <Field
                            type="text"
                            name="postCode"
                            placeholder={currentInvoice?.postCode}
                            className="input"
                          />
                        </div>
                        <ErrorMessage
                          name="postCode"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="form-field">
                        <label>Country</label>
                        <div className="input-field">
                          <Field
                            type="text"
                            name="country"
                            placeholder={currentInvoice?.country}
                            className="input"
                          />
                        </div>
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <span>Bill To</span>
                    <div className="form-field">
                      <label>Client's Name</label>
                      <div className="input-field">
                        <Field
                          type="text"
                          name="client.Name"
                          placeholder={currentInvoice?.client.Name}
                          className="input"
                        />
                      </div>
                      <ErrorMessage
                        name="client.Name"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form-field">
                      <label>Client's Email</label>
                      <div className="input-field">
                        <Field
                          type="text"
                          name="client.Email"
                          placeholder={currentInvoice?.client.Email}
                          className="input"
                        />
                      </div>
                      <ErrorMessage
                        name="client.Email"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form-field">
                      <label>Street Address</label>
                      <div className="input-field">
                        <Field
                          type="text"
                          name="client.Address"
                          placeholder={currentInvoice?.client.Address}
                          className="input"
                        />
                      </div>
                      <ErrorMessage
                        name="client.Address"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form-groupe__row">
                      <div className="form-field">
                        <label>City</label>
                        <div className="input-field">
                          <Field
                            type="text"
                            name="client.City"
                            placeholder={currentInvoice?.client.City}
                            className="input"
                          />
                        </div>
                        <ErrorMessage
                          name="client.City"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="form-field">
                        <label>Post Code</label>
                        <div className="input-field">
                          <Field
                            type="text"
                            name="client.postCode"
                            placeholder={currentInvoice?.client.postCode}
                            className="input"
                          />
                        </div>
                        <ErrorMessage
                          name="client.postCode"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="form-field">
                        <label>Country</label>
                        <div className="input-field">
                          <Field
                            type="text"
                            name="client.country"
                            placeholder={currentInvoice?.client.country}
                            className="input"
                          />
                        </div>
                        <ErrorMessage
                          name="client.country"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-groupe__row">
                      <div className="form-field">
                        <label>currentInvoice Date</label>
                        <div className="input-field">
                          <Field name="date" id="date">
                            {({
                              field,
                              form,
                            }: {
                              field: FormikProps<FormikValues>;
                              form: FormikProps<FormikValues>;
                            }) => (
                              <DatePicker
                                {...field}
                                onChange={(value) => {
                                  form.setFieldValue("date", value);
                                }}
                                defaultValue={dayjs(
                                  currentInvoice?.date
                                ).format("D MMM YYYY")}
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="form-field">
                        <label>Payment Terms</label>
                        <div className="input-field">
                          <Field name="paymentTerms" id="paymentTerms">
                            {({
                              field,
                              form,
                            }: {
                              field: FormikProps<FormikValues>;
                              form: FormikProps<FormikValues>;
                            }) => (
                              <Select
                                {...field}
                                onChange={(value) => {
                                  form.setFieldValue("paymentTerms", value);
                                }}
                              >
                                {Object.values(PaymentTerms)
                                  .filter((value) => typeof value !== "number")
                                  .map((_value, index) => (
                                    <Select.Option key={index} value={index}>
                                      {PaymentTerms[index]}
                                    </Select.Option>
                                  ))}
                              </Select>
                            )}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="paymentTerms"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Project description</label>
                      <div className="input-field">
                        <Field
                          type="text"
                          name="projectDesc"
                          placeholder={currentInvoice?.description}
                          className="input"
                        />
                      </div>
                      <ErrorMessage
                        name="projectDesc"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form-group">
                      <span>Items</span>
                      <div className="form-groupe__row">
                        <p className="main-para form-para">item name</p>
                        <p className="main-para form-para">Qty.</p>
                        <p className="main-para form-para">Price</p>
                        <p className="main-para form-para">Total</p>
                      </div>
                      <div className="form-items">
                        {currentInvoice?.itemList?.map((item, index) => (
                          <div className="form-groupe__row" key={index}>
                            <div className="form-field">
                              <div className="input-field">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={item.name}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="form-field">
                              <div className="input-field">
                                <input
                                  type="number"
                                  placeholder="Quantity"
                                  value={item.qty}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "qty",
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="form-field">
                              <div className="input-field">
                                <input
                                  type="number"
                                  placeholder="Price"
                                  value={item.price}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "price",
                                      parseFloat(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="form-field">{item.total}</div>
                            <span onClick={() => handleDeleteItem(index)}>
                              <img
                                className="form-items__delete__icon"
                                src={deleteIcon}
                                alt=""
                              ></img>
                            </span>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn edit-btn"
                          onClick={() => handleAddItem()}
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="drawer-content__inner__header__bottom">
                  <button
                    onClick={() => {
                      toggleDrawer();
                    }}
                    className="btn default-btn"
                  >
                    cancel
                  </button>
                  <Button className="btn" type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
