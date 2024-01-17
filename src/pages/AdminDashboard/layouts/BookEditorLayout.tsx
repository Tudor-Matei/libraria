import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import { AdminPanelLayoutEnum } from "../../../utils/AdminPanelLayoutEnum";
import { IUserData } from "../../../utils/UserDataContext";
import checkIfFormIsValid from "../../../utils/isFormValid";
import AdminFormInput from "../AdminFormInput";
import BackButton from "../BackButton";
import BookEditorFormStateType from "../types/BookEditorFormStateType";
import bookEditorFormValidator from "../validators/bookEditorFormValidator";

export default function BookAdderLayout({
  setCurrentLayout,
}: {
  setCurrentLayout: React.Dispatch<React.SetStateAction<AdminPanelLayoutEnum>>;
}) {
  const formik = useFormik({
    initialValues: {
      target_isbn: "",
      name: "",
      author: "",
      genre: "",
      published_at: "",
      pages: "",
      quantity: "",
      price: "",
      image: "",
    },

    validate: bookEditorFormValidator,
    onSubmit: (values) => {
      fetch("http://localhost/libraria/php/edit-book.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      })
        .then(async (response) => {
          let jsonResponse: { error: string | null; data?: IUserData } = { error: null, data: undefined };
          try {
            jsonResponse = await response.json();
          } catch (error) {
            alert("The book editing operation could not complete successfully due to an internal server error.");
            formik.setSubmitting(false);
            console.error(error, response.body);
            return;
          }

          if (jsonResponse.error !== null) {
            alert(jsonResponse.error);
            formik.setSubmitting(false);
            if (response.status === 401) location.reload();
            return;
          }

          alert("Book edited successfully!");
          formik.resetForm();
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          alert("Adding the book couldn't hapen because an internal server error has occurred.");
          console.error(error);
        });
    },
  });

  const readImageHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files === null || event.currentTarget.files.length < 1) {
        formik.setFieldValue("image", "Could not read image.");
        return;
      }

      const imageReader = new FileReader();
      imageReader.addEventListener("loadend", () => {
        const imageData: string | null = imageReader.result as string | null;

        if (imageData === null) {
          formik.setFieldValue("image", "Could not read image.");
          return;
        }

        formik.setFieldValue("image", imageData);
      });

      imageReader.readAsDataURL(event.currentTarget.files[0]);
    },
    [formik]
  );

  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);

  return (
    <>
      <BackButton setCurrentLayout={setCurrentLayout} />

      <section className="book-editor">
        <div className="book-editor__search">
          <form onSubmit={formik.handleSubmit}>
            {(formik.errors as BookEditorFormStateType & { all?: string }).all && (
              <span className="invalid-field-indicator">
                {(formik.errors as BookEditorFormStateType & { all?: string }).all}
              </span>
            )}
            <AdminFormInput<BookEditorFormStateType>
              name="target_isbn"
              label="ISBN of the book you want to change"
              placeholder="(978/979)-xxxxxxxxx"
              formik={formik}
            />
          </form>
        </div>
        <div className="form-container">
          <form onSubmit={formik.handleSubmit}>
            <h1>Only fill in the fields for the information you want to edit.</h1>
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              name="name"
              label="Book name"
              placeholder="enter the book name here..."
              formik={formik}
            />
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              name="author"
              label="Author"
              placeholder="enter the author's name here, or leave it empty if the author is unknown..."
              formik={formik}
            />
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              name="genre"
              label="Genre"
              placeholder="enter the book's genre here..."
              formik={formik}
            />
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              inputType="date"
              name="published_at"
              label="Publication date"
              formik={formik}
            />
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              name="pages"
              label="Number of pages"
              placeholder="enter the book's number of pages here..."
              formik={formik}
            />
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              name="quantity"
              label="Quantity"
              placeholder="enter the amount of books here..."
              formik={formik}
            />
            <AdminFormInput<BookEditorFormStateType>
              required={false}
              name="price"
              label="Price"
              placeholder="enter the book's price here..."
              formik={formik}
            />
            <div>
              <label htmlFor={"image"}>
                Image{" "}
                {formik.touched.image && formik.errors.image ? (
                  <span className="invalid-field-indicator">{formik.errors.image}</span>
                ) : (
                  formik.touched.image && <img src="src/assets/checkmark.svg" alt="checkmark" />
                )}
              </label>
              <input
                required={false}
                onChange={readImageHandler}
                name={"image"}
                type="file"
                onBlur={formik.handleBlur}
                className={formik.touched.image && formik.errors.image ? "input--error" : ""}
              />
            </div>
            <div className="form__buttons">
              <button className="primary-button" type="submit" disabled={!isFormValid || formik.isSubmitting}>
                {isFormValid ? "Submit" : "Not yet"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
