import { useContext } from "react";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/profile.css";
import useGetDataFromLocalStorage from "../../hooks/useGetDataFromLocalStorage";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { UserDataContext } from "../../utils/UserDataContext";
import ProfileStat from "./ProfileStat";

export default function Profile() {
  const { userData, setUserData } = useContext(UserDataContext);
  useGetDataFromLocalStorage(userData, setUserData);
  const isNotLoggedIn = useRedirectOnAuth("/signin", false);

  return isNotLoggedIn ? null : (
    <>
      <SignedInNavbar />
      <section className="user-profile-welcome-band">
        <div className="welcome-band__circle">
          <h1>Welcome, {userData?.fname}!</h1>
        </div>
      </section>

      <section className="profile-stats">
        <h1>Here are some stats about you...</h1>

        <div className="profile-stats__stat-container">
          <ProfileStat iconName="clock-solid" heading="0" paragraph="books bought this month" />
          <ProfileStat iconName="book-solid" heading="5" paragraph="books bought all time" />
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
        <h1>And here are all your previous transactions...</h1>

        {/* TODO: this */}
        <div className="transaction-list-container__transaction-list">
          <div className="transaction-list__transaction">
            <div className="transaction__id-pill">
              <p>#914321</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
