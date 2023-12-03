import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/forms.css";
import { IUserData } from "../../utils/UserDataContext";
import checkIfFormIsValid from "../../utils/isFormValid";

export default function LogInPage({ setAuthorised }: { setAuthorised: React.Dispatch<React.SetStateAction<boolean>> }) {
  const formik = useFormik({
    initialValues: { id: "", password: "" },
    validate: ({ id, password }) => {
      const errors: { id?: string; password?: string } = {};
      if (id.trim().length === 0) errors.id = "The id is missing.";
      if (password.trim().length == 0) errors.password = "The password is missing.";

      return errors;
    },
    onSubmit: (values) => {
      fetch("http://localhost/libraria/php/login-admin.php", {
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

          setAuthorised(true);
        })
        .catch((error) => {
          alert("The admin sign in could not complete successfully due to an internal server error.");
          console.error(error);
        });
    },
  });

  const [isLoggedIn] = useState(false);
  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);
  return isLoggedIn ? null : (
    <>
      <Link to="/" className="back-button back-button-signup-signin">
        <img src="src/assets/arrow-left.svg" alt="Go Back" />
      </Link>
      <section className="form-container">
        <div className="form-title-container">
          <h1 className="main-title form-title">ADMIN Log In</h1>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="id">
              ID{" "}
              {formik.touched.id && formik.errors.id ? (
                <span className="invalid-field-indicator">{formik.errors.id}</span>
              ) : (
                formik.touched.id && <img src="src/assets/checkmark.svg" />
              )}
            </label>
            <input
              {...formik.getFieldProps("id")}
              className={formik.touched.id && formik.errors.id ? "input--error" : ""}
              required
              name="id"
              placeholder="type the admin id here..."
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
              placeholder="type the admin password here..."
            />
          </div>

          <div className="form__buttons">
            <button className="primary-button" type="submit" disabled={!isFormValid || formik.isSubmitting}>
              {isFormValid ? "Submit" : "Not yet"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
