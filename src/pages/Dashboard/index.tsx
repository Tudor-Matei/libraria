import { useContext, useEffect } from "react";
import SignedInNavbar from "../../components/SignedInNavbar";
import "../../css/dashboard.css";
import useRedirectOnAuth from "../../hooks/useRedirectOnAuth";
import { UserDataContext } from "../../utils/UserDataContext";

export default function Dashboard() {
  const { userData, setUserData } = useContext(UserDataContext);
  useRedirectOnAuth("/", false);
  useEffect(() => {
    if (userData === null) {
      const savedData: string | null = localStorage.getItem("data");
      setUserData(savedData === null ? null : JSON.parse(savedData));
    }
  }, []);

  return userData === null ? null : (
    <>
      <SignedInNavbar fname={userData.fname} lname={userData.lname} />

      <div className="first-delim dashboard-section-title">
        <h1>Here are your account details</h1>
        <hr />
      </div>

      <section className="account-details">
        <div className="account-details__detail">
          <p>first name</p>
          <h2>{userData.fname}</h2>
        </div>
        <div className="account-details__detail">
          <p>last name</p>
          <h2>{userData.lname}</h2>
        </div>
        <div className="account-details__detail">
          <p>e-mail</p>
          <h2>{userData.email}</h2>
        </div>

        <div className="account-details__detail">
          <p>account creation date</p>
        </div>
        <div className="account-details__detail">
          <p>user id</p>
          <h2>#{userData.user_id}</h2>
        </div>
      </section>
    </>
  );
}
