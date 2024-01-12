import { useContext } from "react";
import BookListing from "../../components/BookListing";
import Footer from "../../components/Footer";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/profile.css";
import useGetDataFromLocalStorage from "../../hooks/useGetDataFromLocalStorage";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { CartContext } from "../../utils/CartContext";
import { UserDataContext } from "../../utils/UserDataContext";
import ProfileStat from "./ProfileStat";
import Transaction from "./Transaction";

export default function Profile() {
  const { userData, setUserData } = useContext(UserDataContext);
  const { cartContents } = useContext(CartContext);
  useGetDataFromLocalStorage(userData, setUserData);
  const isNotLoggedIn = useRedirectOnAuth("/signin", false);

  return isNotLoggedIn ? null : (
    <>
      <SignedInNavbar />
      <section className="user-profile-welcome-band">
        <h1>Welcome, {userData?.fname}!</h1>
      </section>

      <section className="cart-contents">
        <h1>Here are the books that got to your cart...</h1>
        <div className="cart-contents__book-container">
          {cartContents.map(({ name, image, price, genre }, i) => (
            <BookListing
              key={`book-listing-${i}`}
              showAddToCartButton={false}
              className="cart-contents__book"
              image={image}
              name={name}
              genre={genre}
              price={price}
            />
          ))}
        </div>
      </section>

      <section className="profile-stats">
        <h1>Here are some stats about you...</h1>

        <div className="profile-stats__stat-container">
          <ProfileStat iconName="clock-solid" heading="0" paragraph="books bought this month" />
          <ProfileStat iconName="book-solid" heading="5" paragraph="books bought in total" />
          <ProfileStat
            iconName="money-bill-solid"
            heading="The Vampire Diaries"
            paragraph="was the most expensive book you've bought - 123 lei"
          />
          <ProfileStat
            iconName="money-bill-trend-up-solid"
            heading="150 lei"
            paragraph="is the total amount you've spent on books"
          />
        </div>
      </section>

      <section className="transaction-list-container">
        <h1>And here are all your previous purchases...</h1>

        <div className="transaction-list-container__transaction-list">
          <Transaction
            id="917342"
            isbn="979-1234567890"
            title="The Vampire Diaries - The fury and the dark reunion"
            price={129.99}
            date="2024-01-24"
          />
          <Transaction
            id="917342"
            isbn="979-1234567890"
            title="The Vampire Diaries - The fury and the dark reunion"
            price={129.99}
            date="2024-01-24"
          />
          <Transaction
            id="917342"
            isbn="979-1234567890"
            title="The Vampire Diaries - The fury and the dark reunion"
            price={129.99}
            date="2024-01-24"
          />
          <Transaction
            id="917342"
            isbn="979-1234567890"
            title="The Vampire Diaries - The fury and the dark reunion"
            price={129.99}
            date="2024-01-24"
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
