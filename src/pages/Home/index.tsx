import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookListing from "../../components/BookListing";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import "../../css/index.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import BookDataType from "../../utils/BookDataType";
import Reviews from "./Reviews";

export default function Home() {
  const isLoggedIn = useRedirectOnAuth("/shop", true);
  const [bookData, setBookData] = useState<BookDataType[]>([]);

  useEffect(() => {
    fetch("http://localhost/libraria/php/get-books.php", {
      method: "POST",
      body: JSON.stringify({
        filter: "none",
        count: 10,
      }),
    })
      .then((response) => response.json())
      .then((bookDataResponse: { error: string | null; data: BookDataType[] }) => {
        console.log(bookDataResponse);
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
  }, []);

  return isLoggedIn ? null : (
    <>
      <Navbar />
      <main className="landing">
        <aside className="landing__primary-side">
          <div>
            <h1>libraria</h1>
            <p>
              Oh, you're too lazy to go to a library, but you still want to read something on paper? No problem, we'll
              just bring the books to you.
            </p>
          </div>
        </aside>
        <aside className="landing__secondary-side">
          <div>
            <h2>Let's kickstart your online book shopping experience</h2>
            <Link to="/signup">
              <button className="default-button call-to-action">Create an account</button>
            </Link>
          </div>
        </aside>
      </main>

      <section className="check-out-shop">
        <h1>Check out some of the books we have</h1>
        <p>There's plenty to choose from</p>
        <div className="check-out-shop__books">
          <div className="check-out-shop__book-band"></div>
          {bookData.map((book, i) => (
            <BookListing key={`book-${i}`} className="check-out-shop__book" {...book} />
          ))}
        </div>
      </section>

      <section className="stats">
        <h1>Real-time stats</h1>
        <p>Here's a bit of useful information about our online bookstore</p>
        <div className="stats__info">
          <div className="stats__stat">
            <h1>63</h1>
            <p>books in our store</p>
          </div>
          <div className="stats__stat">
            <h1>37</h1>
            <p>different genres</p>
          </div>
          <div className="stats__stat">
            <h1>0</h1>
            <p>transactions made so far</p>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="get-in-touch">
        <h1>Want to get in touch?</h1>
        <p>Meet us here:</p>
        <div className="mapouter">
          <div className="gmap_canvas">
            <iframe
              width="770"
              height="510"
              src="https://maps.google.com/maps?q=timisoara&t=&z=10&ie=UTF8&iwloc=&output=embed&query=45.7570049,21.2236943"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
