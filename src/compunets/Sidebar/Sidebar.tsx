import "./Sidebar.css";
import moon from "../../assets/icon-moon.svg";
import sun from "../../assets/icon-sun.svg";
import Switch from "./switch/Switch";
import Drawer from "./drawer/Drawer";
import { Invoice, User, Project } from "../../models/generalModels";
import * as Yup from "yup";
import { updateUser as UpdateUser } from "../../lib/userUpdate";
import { APIContext } from "../../contexts/mainContext";

import "../universal/formStyles.css";
import { ChangeEvent, useContext, useState } from "react";
import { Modal } from "antd";
import { useDarkMode } from "../../contexts/themeContext";

import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";

interface SidebarProps {
  toggleDrawer: () => void;
  isOpen: boolean;
  user: User;
  data: Project;
  invoice?: Invoice | undefined | null;
}
const ProfileSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
function Sidebar({ toggleDrawer, isOpen, user, data, invoice }: SidebarProps) {
  const { darkMode } = useDarkMode();
  const { updateUser } = useContext(APIContext);
  const [profileImage, setProfileImage] = useState<string | null>();
  const [fileBuffer, setFileBuffer] = useState<File | null | undefined>();
  const [profileModal, setProfileModal] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setFileBuffer(file);
    }
  };
  const handleProfileSubmit = (values: FormikValues) => {
    UpdateUser(
      { ...values, avatar: profileImage || user.avatar },
      user._id,
      fileBuffer,
      updateUser
    );
  };
  return (
    <>
      <div className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__inner__header">
            <div className="art-right"></div>
            <div className="art-left"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
              <path
                fillRule="evenodd"
                d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
              />
            </svg>
          </div>
          <div className="sidebar__inner__last">
            <Switch
              checkedChildren={<img src={moon} alt=""></img>}
              unCheckedChildren={<img src={sun} alt=""></img>}
            />
            <img
              className="profile-icon"
              onClick={() => {
                setProfileModal(true);
              }}
              src={
                profileImage || (user.avatar !== "default" ? user.avatar : sun)
              }
              alt=""
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
      <Drawer
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        data={data}
        invoice={invoice}
      />
      <Modal
        title=""
        centered
        open={profileModal}
        onOk={() => {
          setProfileModal(false);
        }}
        data-theme={darkMode ? "dark" : "light"}
        onCancel={() => {
          setProfileModal(false);
        }}
        footer={null}
      >
        <div className="modal-wrapper">
          <span>Profile settings</span>

          <Formik
            initialValues={{
              email: user.email || "",
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleProfileSubmit}
          >
            <Form>
              <div className="profile-editor">
                <p className="main-para">
                  only 1280 width - 1280 height images allowed
                </p>
                <img
                  className="profile-editor__inner"
                  src={
                    profileImage ||
                    (user.avatar !== "default" ? user.avatar : sun)
                  }
                  alt=""
                  crossOrigin="anonymous"
                >
                  <Field
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <div className="profile-image-ontop">
                    <span className="heading-M">Change profile picture</span>
                  </div>
                </img>
              </div>

              <div className="form-field">
                <label>Email:</label>
                <div className="input-field">
                  <Field type="email" name="email" placeholder={user.email} />
                </div>
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="modal__inner">
                <button
                  type="button"
                  onClick={() => {}}
                  className="btn delete-btn"
                >
                  logout
                </button>

                <button type="submit" className="btn">
                  Save
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </Modal>
    </>
  );
}

export default Sidebar;
