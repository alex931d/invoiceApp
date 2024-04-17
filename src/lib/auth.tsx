import { useContext, useEffect } from "react";
// import { useContext } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import Cookies from "universal-cookie";
import { User } from "../../src/models/generalModels";
import { Axios } from "../config/config";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { APIContext } from "../contexts/mainContext";

const cookies = new Cookies();

const useAuth = () => {
  const queryClient = useQueryClient();
  const contextData = useContext(APIContext);
  const { updateContextState } = contextData;

  const signIn = useSignIn();
  const signOut = useSignOut();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = cookies.get("jwt");

        if (token) {
          if (!isAuthenticated) {
            const response = await Axios.get("/protected");
            if (!response.data.success) {
              signOut();
              cookies.remove("jwt");
              toast.error("no valid authentication token"),
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                };
            }
          }
        }
      } catch (error) {
        signOut();
        cookies.remove("jwt");
        toast.error("error"),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      }
    };

    checkAuthentication();
  }, [isAuthenticated, signOut()]);

  const login = async (values: { email: string; password: string }) => {
    try {
      const response = await Axios.post("/accountAPI/login", {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        toast.success("Successfully logged in!"),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
        signIn({
          auth: {
            token: response.data.token,
            type: "cookie",
          },
          userState: {
            userdata: response.data.user,
            projects: response.data.projects,
          },
        });

        queryClient.invalidateQueries("userInfo");
        queryClient.invalidateQueries("data");
        updateContextState({
          user: {
            ...response.data.user,
          },
          data: {
            ...response.data.projects[0],
          },
        });
      } else if (response.status === 401) {
        toast.error(response.data.message),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      } else {
        toast.error(response.data.message),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      }
    } catch (error) {
      toast.error("error"),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        };
    }
  };

  const logout = async (values: User) => {
    try {
      const response = await Axios.post("/accountAPI/logout", {
        email: values.email,
      });
      if (response.status === 200) {
        signOut();
        cookies.remove("jwt");
        toast.success("Successfully logged out"),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      } else {
        toast.error(`Error: ${response.data.error}`),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      }
    } catch (error) {
      toast.error(`Error`),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        };
    }
  };

  const updateUser = async (values: User, id: number) => {
    try {
      const response = await Axios.put("/accountAPI/updateUser", {
        id: id,
        props: values,
      });
      if (response.status === 200) {
        toast.success(response.data.message),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      } else {
        toast.error("error"),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      }
    } catch (error) {
      toast.error("error updating user"),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        };
    }
  };

  //   const getPreviewData = async (id: number) => {
  //     try {
  //       const response = await Axios.post("/api/getPreviewData", {
  //         id: id,
  //       });
  //       if (response.status === 200) {
  //         const devLinks = response.data.devLinks;
  //         if (devLinks) {
  //           updateContextState({
  //             _id: devLinks?._id ?? "",
  //             items: devLinks?.items ?? [],
  //             userInfo: {
  //               firstName: devLinks?.name ?? "",
  //               lastName: devLinks?.last_name ?? "",
  //               email: devLinks?.email ?? "",
  //               profileImg: devLinks?.profile_picture ?? "",
  //               enable_color_customization:
  //                 devLinks?.enable_color_customization ?? false,
  //             },
  //           });
  //         }
  //       } else if (response.status === 400) {
  //         messageApi.error(response.data.message);
  //       } else {
  //         messageApi.error(response.data.message);
  //       }
  //     } catch (error) {
  //       messageApi.error("Error fetching preview data");
  //     }
  //   };

  const signup = async (values: { email: string; password: string }) => {
    try {
      const response = await Axios.post("/accountAPI/signup", {
        email: values.email,
        password: values.password,
      });
      if (response.status === 200) {
        toast.success("Successfully signed up!"),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
        signIn({
          auth: {
            token: response.data.token,
            type: "cookie",
          },
          userState: {
            userdata: response.data.user,
            projects: response.data.projects,
          },
        });
        queryClient.invalidateQueries("userInfo");
        queryClient.invalidateQueries("data");
        updateContextState({
          user: {
            ...response.data.user,
          },
          data: {
            ...response.data.projects[0],
          },
        });
      } else if (response.status === 401) {
        toast.error(response.data.message),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      } else {
        toast.error(response.data.message),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          };
      }
    } catch (error) {
      toast.error("error"),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        };
    }
  };

  return { login, signup, logout, updateUser };
};

export default useAuth;
