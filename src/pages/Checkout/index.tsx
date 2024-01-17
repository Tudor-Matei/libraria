import { useFormik } from "formik";
import { useContext, useMemo } from "react";
import BookListing from "../../components/BookListing";
import Footer from "../../components/Footer";
import NothingFound from "../../components/NothingFound";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/checkout.css";
import useGetDataFromLocalStorage from "../../hooks/useGetDataFromLocalStorage";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { CartContext, ICartContents } from "../../utils/CartContext";
import { UserDataContext } from "../../utils/UserDataContext";
import checkIfFormIsValid from "../../utils/isFormValid";
import { ICollapsedContents, replaceCartDuplicatesWithQuantity } from "../../utils/replaceCartDuplicatesWithQuantity";

export default function Checkout() {
  const { userData, setUserData } = useContext(UserDataContext);
  const { cartContents, setCartContents } = useContext(CartContext);
  useGetDataFromLocalStorage(userData, setUserData);
  const isNotLoggedIn = useRedirectOnAuth("/signin", false);

  const groupedDuplicateBooksWithQuantity: ICollapsedContents[] = useMemo(
    () => replaceCartDuplicatesWithQuantity(cartContents),
    [cartContents]
  );

  const formik = useFormik({
    initialValues: { country: "", city: "", street: "", streetNumber: 0 },
    validate: ({ country, city, street, streetNumber }) => {
      const errors: { country?: string; city?: string; street?: string; streetNumber?: string } = {};

      if (country.trim().length === 0) errors.country = "Please input a country.";
      if (city.trim().length < 2) errors.city = "Please input a valid city or village.";
      if (street.trim().length === 0) errors.street = "Please input a valid street name.";
      if (streetNumber <= 0) errors.streetNumber = "Please input a valid street number.";

      return errors;
    },
    onSubmit: (values) => {
      if (groupedDuplicateBooksWithQuantity.length === 0) return;

      fetch("http://localhost/libraria/php/perform-transaction.php", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          user_id: userData?.user_id,
          books: JSON.stringify(groupedDuplicateBooksWithQuantity),
        }),
        credentials: "include",
      })
        .then(async (response) => {
          let jsonResponse: { error: string | null; data?: boolean } = { error: null, data: false };
          try {
            jsonResponse = await response.json();
          } catch (error) {
            alert("The order could not be placed successfully due to an internal server error.");
            formik.setSubmitting(false);
            console.error(error, response.body);
            return;
          }

          if (jsonResponse.error !== null) {
            alert(jsonResponse.error);
            formik.setSubmitting(false);
            return;
          }

          if (!jsonResponse.data) {
            alert("The order could not be made. We're sorry for that. Please try again.");
            formik.setSubmitting(false);
            return;
          }

          alert("Order placed successfully.");
          setCartContents([]);
          location.pathname = "/profile";
        })
        .catch((error) => {
          alert("The order couldn't be placed because an internal server error has occurred.");
          formik.setSubmitting(false);
          console.error(error);
        });
    },
  });

  const isFormValid = useMemo(() => checkIfFormIsValid(formik.touched, formik.errors), [formik]);

  return isNotLoggedIn ? null : (
    <>
      <SignedInNavbar />
      <section className="checkout">
        <div
          className={`checkout__form ${
            groupedDuplicateBooksWithQuantity.length === 0 ? "checkout__form--disabled" : ""
          }`}
        >
          <h1>Your address</h1>
          <p>Tell us where we should deliver the books, and we'll do it.</p>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="country">
                Country{" "}
                {formik.touched.country && formik.errors.country ? (
                  <span className="invalid-field-indicator">{formik.errors.country}</span>
                ) : (
                  formik.touched.country && <img src="src/assets/checkmark.svg" />
                )}
              </label>
              <input
                {...formik.getFieldProps("country")}
                className={formik.touched.country && formik.errors.country ? "input--error" : ""}
                required
                type="text"
                name="country"
                placeholder="type the country here..."
              />
            </div>
            <div>
              <label htmlFor="city">
                City{" "}
                {formik.touched.city && formik.errors.city ? (
                  <span className="invalid-field-indicator">{formik.errors.city}</span>
                ) : (
                  formik.touched.city && <img src="src/assets/checkmark.svg" />
                )}
              </label>

              <input
                {...formik.getFieldProps("city")}
                required
                className={formik.touched.city && formik.errors.city ? "input--error" : ""}
                type="text"
                name="city"
                placeholder="type your city here..."
              />
            </div>
            <div>
              <label htmlFor="street">
                Street{" "}
                {formik.touched.street && formik.errors.street ? (
                  <span className="invalid-field-indicator">{formik.errors.street}</span>
                ) : (
                  formik.touched.street && <img src="src/assets/checkmark.svg" />
                )}
              </label>

              <input
                {...formik.getFieldProps("street")}
                required
                className={formik.touched.street && formik.errors.street ? "input--error" : ""}
                type="text"
                name="street"
                placeholder="type your street here..."
              />
            </div>

            <div>
              <label htmlFor="streetNumber">
                Street Number{" "}
                {formik.touched.streetNumber && formik.errors.streetNumber ? (
                  <span className="invalid-field-indicator">{formik.errors.streetNumber}</span>
                ) : (
                  formik.touched.streetNumber && <img src="src/assets/checkmark.svg" />
                )}
              </label>

              <input
                {...formik.getFieldProps("streetNumber")}
                required
                className={formik.touched.streetNumber && formik.errors.streetNumber ? "input--error" : ""}
                type="number"
                name="streetNumber"
                placeholder="type the street number here..."
              />
            </div>

            <div className="checkout-form__form-buttons form__buttons">
              <button
                className="primary-button"
                type="submit"
                disabled={groupedDuplicateBooksWithQuantity.length === 0 || !isFormValid || formik.isSubmitting}
              >
                {isFormValid ? "Submit" : "Not yet"}
              </button>
              <p>
                Total:{" "}
                <strong>
                  {groupedDuplicateBooksWithQuantity
                    .reduce((partial, { price, quantity }) => partial + price * quantity, 0)
                    .toFixed(2)}{" "}
                  lei
                </strong>
              </p>
            </div>
          </form>
          <p className="checkout__online-pay-coming">
            <code>ℹ</code> Online payment coming soon. For now, payment is only possible by cash.
          </p>
        </div>
        <div className="checkout__books">
          {groupedDuplicateBooksWithQuantity.length > 0 ? (
            groupedDuplicateBooksWithQuantity.map(({ name, isbn, image, genre, price, quantity }, i) => (
              <div className="checkout-books__book-container">
                <BookListing
                  key={`book-listing-${i}`}
                  name={name + ` (${quantity})`}
                  image={image}
                  genre={genre}
                  price={price}
                  showAddToCartButton={false}
                />
                <button
                  className="checkout-books__book-remove-button"
                  onClick={() => {
                    const removedBook: ICartContents | undefined = cartContents.find(
                      (currentBook) => currentBook.isbn === isbn
                    );
                    if (removedBook === undefined) return;

                    setCartContents(cartContents.filter((currentBook) => currentBook !== removedBook));
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <NothingFound iconFillColor="var(--main-color)">There's nothing in your cart.</NothingFound>
          )}
        </div>
      </section>
      <Footer className="footer--no-top-margin" />
    </>
  );
}
