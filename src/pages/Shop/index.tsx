import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import BookListing from "../../components/BookListing";
import Footer from "../../components/Footer";
import NothingFound from "../../components/NothingFound";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/shop.css";
import IBookData from "../../utils/IBookData";
import { UserDataContext } from "../../utils/UserDataContext";

export default function Shop() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [bookData, setBookData] = useState<IBookData[]>([]);
  const {
    error,
    data,
    bookData: receivedBookData,
  }: { error: string | null; data: boolean; bookData: IBookData[] } = useLoaderData() as {
    error: string | null;
    data: boolean;
    bookData: IBookData[];
  };
  useEffect(() => {
    if (!data) {
      location.pathname = "/signin";
      return;
    }

    if (userData === null) {
      const savedData: string | null = localStorage.getItem("data");

      if (savedData === null) {
        // In the case of a logout fail, just fail silently and move on.
        fetch("http://localhost/libraria/php/logout.php", { method: "POST", credentials: "include" })
          .then(() => {
            location.pathname = "/";
          })
          .catch(console.error);
        return;
      }

      setUserData(JSON.parse(savedData));
    }

    setBookData(receivedBookData);
  }, []);

  const formik = useFormik({
    initialValues: { search: "" },
    onSubmit: ({ search }) => {
      fetch("http://localhost/libraria/php/get-books.php", {
        method: "POST",
        body: JSON.stringify({
          filter: search,
          count: 50,
        }),
      })
        .then((response) => response.json())
        .then((bookDataResponse: { error: string | null; data: IBookData[] }) => {
          if (bookDataResponse.error !== null) {
            alert(bookDataResponse.error);
            return;
          }

          setBookData(bookDataResponse.data);
        })
        .catch((error) => {
          alert("An unexpected error has occured whilst retrieving books from the database.");
          console.error(error);
        });
    },
  });
  return (
    userData?.fname !== undefined &&
    userData?.lname !== undefined && (
      <>
        <SignedInNavbar />
        <div className="search-and-results">
          <section className="search">
            <h3>Find that one book</h3>
            <form action="POST" onSubmit={formik.handleSubmit}>
              <input
                {...formik.getFieldProps("search")}
                type="search"
                name="search"
                placeholder="enter a book name here"
                className="search__input"
              />
            </form>
          </section>
          <section className="results">
            {error !== null ? (
              <h1>error</h1>
            ) : bookData.length === 0 ? (
              <NothingFound iconFillColor="var(--main-color-light)">No books have been found.</NothingFound>
            ) : (
              bookData.map((book, i) => <BookListing key={`book-${i}`} className="results__book" {...book} />)
            )}
          </section>
        </div>
        <Footer className="footer--no-top-margin" />
      </>
    )
  );
}
