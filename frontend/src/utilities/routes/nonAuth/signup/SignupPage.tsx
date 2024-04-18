import "./SignupPage.css";
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
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const cookies = new Cookies();
function SignupPage() {
  const [messageApi] = message.useMessage();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await signup(values);
    } catch (error) {
      messageApi.error("error!");
      navigate("/signup");
    } finally {
      try {
        const token = cookies.get("jwt");
        if (token) {
          navigate("/dashboard");
        }
      } catch (error) {
        messageApi.error("error logging in!");
        navigate("/signup");
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
              <span>Sign up</span>
              <p>Add your details below to get Signed up!</p>
            </div>
            <div className="form-container-body">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={SignUpSchema}
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
                    Sign up
                  </button>
                  <Link to="/login">already have an account? go here!</Link>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignupPage;
