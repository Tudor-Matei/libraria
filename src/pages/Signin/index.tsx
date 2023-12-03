import { useFormik } from "formik";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../css/forms.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { IUserData, UserDataContext } from "../../utils/UserDataContext";
import isEmailValid from "../../utils/emailRegex";
import checkIfFormIsValid from "../../utils/isFormValid";

export default function Signin() {
  const isLoggedIn = useRedirectOnAuth("/shop", true);
  const { setUserData } = useContext(UserDataContext);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: ({ email, password }) => {
      const errors: { email?: string; password?: string } = {};
      if (email.trim().length === 0) errors.email = "The e-mail is missing.";
      else if (!isEmailValid(email)) errors.email = "Invalid e-mail format.";

      if (password.trim().length == 0) errors.password = "The password is missing.";
      else if (password.length < 8) errors.password = "Password is too small.";

      return errors;
    },
    onSubmit: (values) => {
      fetch("http://localhost/libraria/php/signin.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      })
        .then(async (response) => {
          let jsonResponse: { error: string | null; data?: IUserData } = { error: null, data: undefined };
          try {
            jsonResponse = await response.json();
          } catch (error) {
            alert("The sign up could not complete successfully due to an internal server error.");
            formik.setSubmitting(false);
            console.error(error, response.body);
          }

          if (jsonResponse.error !== null && jsonResponse.data === undefined) {
            alert(jsonResponse.error);
            formik.setSubmitting(false);
            return;
          }
          if (jsonResponse.error !== null && jsonResponse.data === undefined) {
            alert(jsonResponse.error);
            formik.setSubmitting(false);
            return;
          }

          localStorage.setItem("data", JSON.stringify(jsonResponse.data));
          setUserData(jsonResponse.data as IUserData);
          location.pathname = "/shop";
        })
        .catch((error) => {
          alert("Logging in couldn't hapen because an internal server error has occurred.");
          console.error(error);
        });
    },
  });

  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);
  return isLoggedIn ? null : (
    <>
      <Link to="/" className="back-button back-button-signup-signin">
        <img src="src/assets/arrow-left.svg" alt="Go Back" />
      </Link>
      <section className="form-container">
        <div className="form-title-container">
          <h1 className="main-title form-title">Log In</h1>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email">
              E-mail{" "}
              {formik.touched.email && formik.errors.email ? (
                <span className="invalid-field-indicator">{formik.errors.email}</span>
              ) : (
                formik.touched.email && <img src="src/assets/checkmark.svg" />
              )}
            </label>
            <input
              {...formik.getFieldProps("email")}
              className={formik.touched.email && formik.errors.email ? "input--error" : ""}
              required
              type="email"
              name="email"
              placeholder="type your e-mail here..."
            />
          </div>
          <div>
            <label htmlFor="password">
              Password{" "}
              {formik.touched.password && formik.errors.password ? (
                <span className="invalid-field-indicator">{formik.errors.password}</span>
              ) : (
                formik.touched.password && <img src="src/assets/checkmark.svg" />
              )}
            </label>

            <input
              {...formik.getFieldProps("password")}
              required
              className={formik.touched.password && formik.errors.password ? "input--error" : ""}
              type="password"
              name="password"
              placeholder="type your password here..."
            />
          </div>

          <div className="form__buttons">
            <button className="primary-button" type="submit" disabled={!isFormValid || formik.isSubmitting}>
              {isFormValid ? "Submit" : "Not yet"}
            </button>
            <Link to="/signup">
              <button type="button" className="default-button">
                No account? Sign up!
              </button>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
