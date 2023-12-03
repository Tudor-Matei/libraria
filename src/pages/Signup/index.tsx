import { useFormik } from "formik";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../css/forms.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { IUserData, IUserDataContext, UserDataContext } from "../../utils/UserDataContext";
import isEmailValid from "../../utils/emailRegex";
import checkIfFormIsValid from "../../utils/isFormValid";
import { IFormStateTypeError } from "./FormStateType";

export default function Signup() {
  const isLoggedIn = useRedirectOnAuth("/shop", true);
  const { setUserData } = useContext<IUserDataContext>(UserDataContext);

  const formik = useFormik({
    initialValues: { fname: "", lname: "", email: "", password: "" },
    validate: ({ fname, lname, email, password }) => {
      const errors: IFormStateTypeError = {};
      if (fname.trim() === "") errors.fname = "The first name is missing.";
      else if (fname.length <= 1) errors.fname = "I don't think first names can be 1 letter long. 🤔";

      if (lname.trim() === "") errors.lname = "The last name is missing.";
      else if (lname.length <= 1) errors.lname = "I don't think last names can be 1 letter long. 🤔";

      if (email.trim().length === 0) errors.email = "The e-mail is missing.";
      else if (!isEmailValid(email)) errors.email = "Invalid e-mail format.";

      if (password.trim().length == 0) errors.password = "The password is missing.";
      else if (password.length < 8) errors.password = "Password is too small.";

      return errors;
    },
    onSubmit: (values) => {
      fetch("http://localhost/libraria/php/signup.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      }).then(async (response) => {
        let jsonResponse: { error: string | null; data?: IUserData } = { error: null, data: undefined };
        try {
          jsonResponse = await response.json();
        } catch (error) {
          alert("The sign up could not complete successfully due to an internal server error.");
          console.error(error, response.body);
          return;
        }

        if (jsonResponse.error !== null && jsonResponse.data === undefined) {
          alert(jsonResponse.error);
          formik.setSubmitting(false);
          return;
        }

        localStorage.setItem("data", JSON.stringify(jsonResponse.data));
        setUserData(jsonResponse.data as IUserData);
        location.pathname = "/profile";
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
          <h1 className="main-title form-title">Sign Up</h1>
        </div>
        <form action="POST" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="fname">
              First Name{" "}
              {formik.touched.fname && formik.errors.fname ? (
                <span className="invalid-field-indicator">{formik.errors.fname}</span>
              ) : (
                formik.touched.fname && <img src="src/assets/checkmark.svg" />
              )}
            </label>
            <input
              {...formik.getFieldProps("fname")}
              className={formik.touched.fname && formik.errors.fname ? "input--error" : ""}
              required
              type="text"
              name="fname"
              placeholder="type your first name here..."
            />
          </div>
          <div>
            <label htmlFor="lname">
              Last Name{" "}
              {formik.touched.lname && formik.errors.lname ? (
                <span className="invalid-field-indicator">{formik.errors.lname}</span>
              ) : (
                formik.touched.lname && <img src="src/assets/checkmark.svg" />
              )}
            </label>
            <input
              {...formik.getFieldProps("lname")}
              className={formik.touched.lname && formik.errors.lname ? "input--error" : ""}
              type="text"
              required
              name="lname"
              placeholder="type your last name here..."
            />
          </div>
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
              type="email"
              name="email"
              required
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
              className={formik.touched.password && formik.errors.password ? "input--error" : ""}
              type="password"
              name="password"
              required
              placeholder="type your password here..."
            />
          </div>

          <div className="form__buttons">
            <button className="primary-button" type="submit" disabled={!isFormValid || formik.isSubmitting}>
              {isFormValid ? "Submit" : "Not yet..."}
            </button>
            <Link to="/signin">
              <button type="button" className="default-button">
                Already have an account? Log in!
              </button>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
