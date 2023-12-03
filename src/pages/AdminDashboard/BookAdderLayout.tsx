import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import { IUserData } from "../../utils/UserDataContext";
import checkIfFormIsValid from "../../utils/isFormValid";
import AdminFormInput from "./AdminFormInput";
import bookAdderFormValidator from "./bookAdderFormValidator";

export default function BookAdderLayout() {
  const formik = useFormik({
    initialValues: {
      isbn: "",
      name: "",
      author: "",
      genre: "",
      published_at: 0,
      pages: 0,
      quantity: 0,
      price: 0.0,
      image: "",
    },

    validate: bookAdderFormValidator,
    onSubmit: (values) => {
      fetch("http://localhost/libraria/php/add-book.php", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      })
        .then(async (response) => {
          let jsonResponse: { error: string | null; data?: IUserData } = { error: null, data: undefined };
          try {
            jsonResponse = await response.json();
          } catch (error) {
            alert("The book adding operation could not complete successfully due to an internal server error.");
            formik.setSubmitting(false);
            console.error(error, response.body);
            return;
          }

          if (jsonResponse.error !== null && jsonResponse.data === undefined) {
            alert(jsonResponse.error);
            formik.setSubmitting(false);
            if (response.status === 401) location.reload();
            return;
          }

          alert("Book added successfully!");
          formik.resetForm();
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          alert("Logging in couldn't hapen because an internal server error has occurred.");
          console.error(error);
        });
    },
  });

  const readImageHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);
  return (
    <>
      <section className="form-container">
        <form onSubmit={formik.handleSubmit}>
          <AdminFormInput name="isbn" label="ISBN" placeholder="(978/979)-xxxxxxxxx" formik={formik} />
          <AdminFormInput name="name" label="Book name" placeholder="enter the book name here..." formik={formik} />
          <AdminFormInput
            required={false}
            name="author"
            label="Author"
            placeholder="enter the author's name here, or leave it empty if the author is unknown..."
            formik={formik}
          />
          <AdminFormInput name="genre" label="Genre" placeholder="enter the book's genre here..." formik={formik} />
          <AdminFormInput
            required={false}
            inputType="date"
            name="published_at"
            label="Publication date"
            formik={formik}
          />
          <AdminFormInput
            inputType="number"
            name="pages"
            label="Number of pages"
            placeholder="enter the book's number of pages here..."
            formik={formik}
          />
          <AdminFormInput
            inputType="number"
            name="quantity"
            label="Quantity"
            placeholder="enter the amount of books here..."
            formik={formik}
          />
          <AdminFormInput
            inputType="number"
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
      </section>
    </>
  );
}
