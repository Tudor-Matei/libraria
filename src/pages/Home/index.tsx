import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookListing from "../../components/BookListing";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import "../../css/index.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import BookDataType from "../../utils/BookDataType";
import StatsDataType from "../../utils/StatsDataType";
import Reviews from "./Reviews";

export default function Home() {
  const isLoggedIn = useRedirectOnAuth("/shop", true);
  const [bookData, setBookData] = useState<BookDataType[]>([]);
  const [statsData, setStatsData] = useState<StatsDataType>({ bookCount: 0, genreCount: 0, transactionCount: 0 });

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

    fetch("http://localhost/libraria/php/get-stats.php")
      .then((response) => response.json())
      .then((statsDataResponse: { error: string | null; data: StatsDataType }) => {
        console.log(statsDataResponse);
        if (statsDataResponse.error !== null) {
          alert(statsDataResponse.error);
          return;
        }

        setStatsData(statsDataResponse.data);
      })
      .catch((error) => {
        alert("An unexpected error has occured whilst retrieving stats from the database.");
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
        {bookData.length === 0 ? (
          <p>Please come back later. New books are going to be added.</p>
        ) : (
          <>
            <p>There's plenty to choose from</p>
            <div className="check-out-shop__books">
              <div className="check-out-shop__book-band"></div>
              {bookData.map((book, i) => (
                <BookListing key={`book-${i}`} className="check-out-shop__book" {...book} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="stats">
        <h1>Real-time stats</h1>
        <p>Here's a bit of useful information about our online bookstore</p>
        <div className="stats__info">
          <div className="stats__stat">
            <h1>{statsData.bookCount}</h1>
            <p>book{statsData.bookCount !== 1 ? "s" : ""} in our store</p>
          </div>
          <div className="stats__stat">
            <h1>{statsData.genreCount}</h1>
            <p>{statsData.genreCount !== 1 ? "different genres" : "genre"}</p>
          </div>
          <div className="stats__stat">
            <h1>{statsData.transactionCount}</h1>
            <p>transaction{statsData.transactionCount !== 1 ? "s" : ""} made so far</p>
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
