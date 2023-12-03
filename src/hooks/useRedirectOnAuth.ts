import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export interface ILoggedInDataResult {
  error: string | null;
  data: boolean;
}

export default function useRedirectOnAuth(redirectLocation: string, redirectOnLogInState: boolean) {
  const loggedInData: ILoggedInDataResult | undefined = useLoaderData() as ILoggedInDataResult | undefined;
  useEffect(() => {
    if (loggedInData !== undefined && loggedInData.data === redirectOnLogInState) location.pathname = redirectLocation;
  }, [loggedInData, redirectLocation, redirectOnLogInState]);

  return loggedInData !== undefined && loggedInData.data === redirectOnLogInState;
}
