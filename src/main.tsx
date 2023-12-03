import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../src/css/styles.css";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { IUserData, UserDataContext } from "./utils/UserDataContext";
import authorise from "./utils/authorise";
import shopLoader from "./utils/shopLoader";

const router = createBrowserRouter([
  { path: "/", loader: authorise, element: <Home /> },
  { path: "signup", loader: authorise, element: <Signup /> },
  { path: "signin", loader: authorise, element: <Signin /> },
  { path: "shop", loader: shopLoader, element: <Shop /> },
  { path: "admin", element: <AdminDashboard /> },
]);

export function App() {
  const [userData, setUserData] = useState<IUserData | null>(null);

  return (
    <React.StrictMode>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <RouterProvider router={router} />
      </UserDataContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
