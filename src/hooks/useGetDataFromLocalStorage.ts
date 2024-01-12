import { useEffect } from "react";
import { IUserData } from "../utils/UserDataContext";

export default function useGetDataFromLocalStorage(
  userData: IUserData | null,
  setUserData: React.Dispatch<React.SetStateAction<IUserData | null>>
) {
  useEffect(() => {
    if (userData === null) {
      const savedData: string | null = localStorage.getItem("data");
      setUserData(savedData === null ? null : JSON.parse(savedData));
    }
  }, []);
}
