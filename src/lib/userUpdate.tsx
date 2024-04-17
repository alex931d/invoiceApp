import { FormikValues } from "formik";

import { User } from "../models/generalModels";

export const updateUser = (
  values: FormikValues,
  id: string | number,
  fileBuffer: File | null | undefined,
  userUpdate: (
    id: string | number,
    fileBuffer: File | null | undefined,
    user: User
  ) => void
) => {
  if (values) {
    const user = {
      _id: values._id,
      email: values.email,
      role: values.role,
      avatar: values.avatar,
      projects: values.projects,
    };
    userUpdate(id, fileBuffer, user);
  }
};
