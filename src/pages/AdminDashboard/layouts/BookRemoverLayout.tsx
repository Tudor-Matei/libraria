import { useFormik } from "formik";
import { useMemo } from "react";
import { AdminPanelLayoutEnum } from "../../../utils/AdminPanelLayoutEnum";
import { IUserData } from "../../../utils/UserDataContext";
import checkIfFormIsValid from "../../../utils/isFormValid";
import AdminFormInput from "../AdminFormInput";
import BackButton from "../BackButton";

export default function BookAdderLayout({
  setCurrentLayout,
}: {
  setCurrentLayout: React.Dispatch<React.SetStateAction<AdminPanelLayoutEnum>>;
}) {
  const formik = useFormik({
    initialValues: { isbn: "" },

    validate: ({ isbn }) => {
      const errors: { isbn?: string } = {};

      if (isbn.trim().length !== 14 || !/(978|979)-[0-9]{10}/.test(isbn.trim()))
        errors.isbn = "The format of an ISBN is (978/979)-(10 digits).";

      return errors;
    },
    onSubmit: (values) => {
      fetch("http://localhost/libraria/php/remove-book.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      })
        .then(async (response) => {
          let jsonResponse: { error: string | null; data?: IUserData } = { error: null, data: undefined };
          try {
            jsonResponse = await response.json();
          } catch (error) {
            alert("The book removal operation could not complete successfully due to an internal server error.");
            formik.setSubmitting(false);
            console.error(error, response.body);
            return;
          }

          if (jsonResponse.error !== null) {
            alert(jsonResponse.error);
            formik.setSubmitting(false);
            return;
          }

          alert("Book removed successfully!");
          formik.resetForm();
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          alert("Removing the book couldn't hapen because an internal server error has occurred.");
          console.error(error);
        });
    },
  });

  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);
  return (
    <>
      <BackButton setCurrentLayout={setCurrentLayout} />
      <section className="form-container">
        <form onSubmit={formik.handleSubmit}>
          <AdminFormInput<{ isbn: string }>
            name="isbn"
            label="ISBN"
            placeholder="(978/979)-xxxxxxxxx"
            formik={formik}
          />
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
