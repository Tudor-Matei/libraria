import { useContext, useEffect, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import BookListing from "../../components/BookListing";
import Footer from "../../components/Footer";
import NothingFound from "../../components/NothingFound";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/profile.css";
import useGetDataFromLocalStorage from "../../hooks/useGetDataFromLocalStorage";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { CartContext } from "../../utils/CartContext";
import { IProfileData } from "../../utils/IProfileData";
import { UserDataContext } from "../../utils/UserDataContext";
import { ICollapsedContents, replaceCartDuplicatesWithQuantity } from "../../utils/replaceCartDuplicatesWithQuantity";
import ProfileStat from "./ProfileStat";
import Transaction from "./Transaction";

export default function Profile() {
  const { userData, setUserData } = useContext(UserDataContext);
  const { cartContents } = useContext(CartContext);
  useGetDataFromLocalStorage(userData, setUserData);
  const isNotLoggedIn = useRedirectOnAuth("/signin", false);

  const { error, profileData }: { error: string | null; profileData: IProfileData | null } = useLoaderData() as {
    error: string | null;
    profileData: IProfileData | null;
  };

  useEffect(() => {
    if (error !== null) {
      alert(error);
      location.pathname = "/shop";
    }
  }, []);

  const groupedDuplicateBooksWithQuantity: ICollapsedContents[] = useMemo(
    () => replaceCartDuplicatesWithQuantity(cartContents),
    [cartContents]
  );

  return isNotLoggedIn || profileData === null ? null : (
    <>
      <SignedInNavbar />
      <section className="user-profile-welcome-band">
        <h1>Welcome, {userData?.fname}!</h1>
      </section>

      <section className="cart-contents">
        <h1>Here are the books that got to your cart...</h1>
        <div className="cart-contents__book-container">
          {groupedDuplicateBooksWithQuantity.length === 0 ? (
            <NothingFound iconFillColor="var(--main-color)" className="cart-contents__no-books">
              There are no books in your cart yet.
            </NothingFound>
          ) : (
            groupedDuplicateBooksWithQuantity.map(({ name, image, price, genre, quantity }, i) => (
              <BookListing
                key={`book-listing-${i}`}
                showAddToCartButton={false}
                className="cart-contents__book"
                image={image}
                name={name + ` (${quantity})`}
                genre={genre}
                price={price}
              />
            ))
          )}
        </div>
      </section>

      <section className="profile-stats">
        <h1>Here are some stats about you...</h1>

        <div className="profile-stats__stat-container">
          <ProfileStat
            iconName="clock-solid"
            heading={(profileData.userStats?.books_bought_this_month || 0).toString()}
            paragraph={`book${profileData.userStats?.books_bought_this_month !== 1 ? "s" : ""} bought this month`}
          />
          <ProfileStat
            iconName="book-solid"
            heading={(profileData.userStats?.books_bought_in_total || 0).toString()}
            paragraph={`book${profileData.userStats?.books_bought_in_total !== 1 ? "s" : ""} bought in total`}
          />
          <ProfileStat
            iconName="money-bill-solid"
            heading={profileData.userStats?.most_expensive_book_bought?.name || "No book bought"}
            paragraph={
              profileData.userStats?.most_expensive_book_bought?.price !== undefined
                ? `was the most expensive book you've bought - ${
                    profileData.userStats?.most_expensive_book_bought?.price || -1
                  } lei`
                : "buy a book to see this stat"
            }
          />
          <ProfileStat
            iconName="money-bill-trend-up-solid"
            heading={`${profileData.userStats?.total_money_spent_books || 0} lei`}
            paragraph="is the total amount you've spent on books"
          />
        </div>
      </section>

      <section className="transaction-list-container">
        <h1>And here are all your previous purchases...</h1>
        {profileData.userTransactions?.length ? (
          <div className="transaction-list-container__transaction-list">
            {profileData.userTransactions?.map(({ id, name, date, price }, i) => (
              <Transaction key={`transaction-${i}`} id={id.toString()} name={name} price={price} date={date} />
            ))}
          </div>
        ) : (
          <NothingFound iconFillColor="var(--main-color)">No transactions performed yet.</NothingFound>
        )}
      </section>
      <Footer />
    </>
  );
}
