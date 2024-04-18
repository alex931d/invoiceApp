import { ReactNode, createContext, Dispatch, SetStateAction } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useQuery, useQueryClient } from "react-query";
import { Axios } from "../config/config";
import { Data, Project, User, Invoice } from "../models/generalModels";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";

interface ContextState {
  serverData: Data;
  dataLoaded: boolean;
  updateContextState: Dispatch<SetStateAction<Data>>;
  addInvoice: (id: number | string | null, newInvoice: Invoice) => void;
  updateInvoice: (
    id: number | string | null,
    uuid: string,
    updatedInvoiceData: Partial<Invoice>
  ) => void;
  removeInvoice: (id: number | string | null, uuid: string) => void;
  updateUser: (
    id: number | string,
    fileBuffer: File | null | undefined,
    values: User
  ) => void;
}

const initialState: Data = {
  user: {
    _id: "",
    email: "",
    role: "",
    avatar: "",
    projects: [],
  },
  data: {
    _id: null,
    name: "",
    description: "",
    invoices: [],
  },
};

export const APIContext = createContext<ContextState>({
  serverData: initialState,
  dataLoaded: false,
  updateContextState: () => {},
  addInvoice: () => {},
  updateInvoice: () => {},
  removeInvoice: () => {},
  updateUser: () => {},
});

export function APIContextProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const queryClient = useQueryClient();

  const {
    data: queryData = initialState,
    isLoading,
    isError,
  } = useQuery(
    ["userInfo", "data"],
    async () => {
      if (!isAuthenticated) return;
      const [dataResponse] = await Promise.all([Axios.post("/getData")]);

      const userInfo: User = dataResponse.data.user;
      const data: Project = dataResponse.data.projects[0];
      if (data && userInfo) {
        return {
          user: {
            _id: userInfo._id,
            email: userInfo.email,
            role: userInfo.role,
            avatar: userInfo.avatar,
            projects: userInfo.projects,
          },
          data: {
            _id: data._id,
            name: data.name,
            description: data.description,
            invoices: data.invoices || [],
          },
        };
      }
    },
    {
      enabled: isAuthenticated,
      refetchOnWindowFocus: false,
    }
  );

  const updateContextState: ContextState["updateContextState"] = (newState) => {
    setServerData({ ...(queryData || initialState), ...newState });
    if (!queryData) {
      setServerData(initialState);
    }
  };
  const updateUser = async (
    id: number | string,
    fileBuffer: File | null | undefined,
    user: User
  ) => {
    if (!id || !user) {
      return;
    }
    if (queryData) {
      const updatedServerData = {
        user: {
          ...user,
        },
        data: {
          ...queryData.data,
        },
      };
      const loadingId = toast.loading("Updating...");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const formData = new FormData();

      formData.append("userId", id.toString());
      formData.append("user", JSON.stringify(user));
      if (fileBuffer) {
        formData.append("file", fileBuffer);
      }

      await Axios.put("/accountAPI/updateUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response: AxiosResponse) => {
          if (!response.data) {
            return;
          }

          setServerData(updatedServerData);
          updateContextState({
            user: {
              ...user,
            },
            data: {
              ...queryData.data,
            },
          });
          toast.update(loadingId, {
            render: "Invoice updated successfully",
            type: "success",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            isLoading: false,
          });
        })
        .catch((error) => {
          toast.update(loadingId, {
            render: "Failed to update invoice",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            type: "success",
            isLoading: false,
          });
          console.error(error);
        });
    }
  };

  const addInvoice = async (
    projectId: number | string | null,
    newInvoice: Invoice
  ) => {
    if (queryData) {
      const updatedInvoices = [...queryData.data.invoices, newInvoice];
      const updatedServerData = {
        ...queryData,
        data: {
          ...queryData.data,
          invoices: updatedInvoices,
        },
      };
      const loadingId = toast.loading("Updating...");
      await Axios.post("/invoiceAPI/createInvoice", {
        projectId: projectId,
        invoice: newInvoice,
      })
        .then((response: AxiosResponse) => {
          if (!response.data) {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setServerData(updatedServerData);
          updateContextState({
            user: {
              ...queryData.user,
              projects: queryData.user.projects.map((project) => {
                if (project._id === projectId) {
                  return {
                    ...project,
                    Invoices: updatedInvoices,
                  };
                }
                return project;
              }),
            },
            data: {
              ...queryData.data,
              invoices: updatedInvoices,
            },
          });
          toast.update(loadingId, {
            render: "Invoice added successfully",
            type: "success",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            isLoading: false,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.update(loadingId, {
            render: "Failed to add invoice",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            type: "error",
            isLoading: false,
          });
        });
    }
  };
  const removeInvoice = async (id: number | string | null, uuid: string) => {
    if (!id) {
      return;
    }
    if (queryData) {
      const updatedInvoices = queryData.data.invoices.filter(
        (invoice) => invoice.uuid !== uuid
      );
      const updatedServerData = {
        ...queryData,
        data: {
          ...queryData.data,
          invoices: updatedInvoices,
        },
      };
      const loadingId = toast.loading("Removing...");
      await Axios.delete("/invoiceAPI/deleteInvoice", {
        data: {
          projectId: id,
          uuid: uuid,
        },
      })

        .then((response: AxiosResponse) => {
          if (!response.data) {
            return;
          }
          setServerData(updatedServerData);

          updateContextState({
            user: {
              ...queryData.user,
              projects: queryData.user.projects.map((project) => {
                if (project._id === id) {
                  return {
                    ...project,
                    Invoices: updatedInvoices,
                  };
                }
                return project;
              }),
            },
            data: {
              ...queryData.data,
              invoices: updatedInvoices,
            },
          });
          toast.update(loadingId, {
            render: "Invoice removed successfully",
            type: "success",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            isLoading: false,
          });
        })
        .catch((error) => {
          toast.update(loadingId, {
            render: "Failed to remove invoice",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            type: "success",
            isLoading: false,
          });
          console.error(error);
        });
    }
  };
  const updateInvoice = async (
    id: number | string | null,
    uuid: string,
    updatedInvoiceData: Partial<Invoice>
  ) => {
    if (queryData) {
      const indexToUpdate = queryData.data.invoices.findIndex(
        (invoice) => invoice.uuid === uuid
      );

      if (indexToUpdate !== -1) {
        const updatedInvoices = [...queryData.data.invoices];
        updatedInvoices[indexToUpdate] = {
          ...updatedInvoices[indexToUpdate],
          ...updatedInvoiceData,
        };

        const updatedServerData = {
          ...queryData,
          data: {
            ...queryData.data,
            invoices: updatedInvoices,
          },
        };

        const loadingId = toast.loading("Updating...");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await Axios.put("/invoiceAPI/updateInvoice", {
          projectId: id,
          invoiceUUID: uuid,
          invoice: updatedInvoiceData,
        })

          .then((response: AxiosResponse) => {
            if (!response.data) {
              return;
            }
            setServerData(updatedServerData);
            updateContextState({
              user: {
                ...queryData.user,
                projects: queryData.user.projects.map((project) => {
                  if (project._id === id) {
                    return {
                      ...project,
                      Invoices: updatedInvoices,
                    };
                  }
                  return project;
                }),
              },
              data: {
                ...queryData.data,
                invoices: updatedInvoices,
              },
            });
            toast.update(loadingId, {
              render: "Invoice updated successfully",
              type: "success",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              isLoading: false,
            });
          })
          .catch((error) => {
            toast.update(loadingId, {
              render: "Failed to update invoice",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              type: "success",
              isLoading: false,
            });
            console.error(error);
          });
      }
    }
  };

  const setServerData = (newServerData: Data) => {
    queryClient.setQueryData(["userInfo", "data"], newServerData);
  };

  if (!isAuthenticated) {
    return (
      <APIContext.Provider
        value={{
          serverData: queryData || initialState,
          dataLoaded: false,
          updateContextState,
          addInvoice,
          updateInvoice,
          removeInvoice,
          updateUser,
        }}
      >
        {children}
      </APIContext.Provider>
    );
  }

  if (isLoading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <APIContext.Provider
      value={{
        serverData: queryData || initialState,
        dataLoaded: true,
        updateContextState,
        addInvoice,
        updateInvoice,
        removeInvoice,
        updateUser,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}
