import "./LoginPage.css";
import Logo from "../../../../assets/logo.svg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import useAuth from "../../../../lib/auth";
import "../../../../compunets/universal/formStyles.css";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import LinkImg from "../../../../assets/link-solid(1).svg";
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const cookies = new Cookies();
function LoginPage() {
  const [messageApi] = message.useMessage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values);
    } catch (error) {
      messageApi.error("error!");
      navigate("/login");
    } finally {
      try {
        const token = cookies.get("jwt");
        if (token) {
          navigate("/dashboard");
        }
      } catch (error) {
        messageApi.error("error logging in!");
        navigate("/login");
      }
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-container-inner">
          <div className="logo-container">
            <img src={Logo} alt="Logo"></img>
          </div>
          <div className="form-container">
            <div className="form-container-header">
              <span>Login</span>
              <p>Add your details below to get back into the app</p>
            </div>
            <div className="form-container-body">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={(data) => {
                  handleSubmit(data);
                }}
              >
                <Form>
                  <div className="form-field">
                    <label>Email address</label>
                    <div className="input-field">
                      <div className="input-icon">
                        <img
                          width="25px"
                          height="25px"
                          className="input-icon"
                          alt="link icon"
                          src={LinkImg}
                        ></img>
                      </div>
                      <Field
                        type="text"
                        name="email"
                        placeholder="e.g alexander@hotmail.com"
                        className="input"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="form-field">
                    <label>Password</label>
                    <div className="input-field">
                      <div className="input-icon">
                        <img
                          width="25px"
                          height="25px"
                          className="input-icon"
                          alt="link icon"
                          src={LinkImg}
                        ></img>
                      </div>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error"
                    />
                  </div>
                  <button type="submit" className="btn" disabled={false}>
                    Log in
                  </button>
                  <Link to="/signup">
                    don't have an account already? sign up here
                  </Link>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
