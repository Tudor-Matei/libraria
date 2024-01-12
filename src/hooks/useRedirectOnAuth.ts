import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export interface ILoggedInDataResult {
  error: string | null;
  data: boolean;
}

export default function useRedirectOnAuth(redirectLocation: string, redirectIfLogInStateIsThis: boolean) {
  const loggedInData: ILoggedInDataResult | undefined = useLoaderData() as ILoggedInDataResult | undefined;
  useEffect(() => {
    if (loggedInData !== undefined && loggedInData.data === redirectIfLogInStateIsThis)
      location.pathname = redirectLocation;
  }, [loggedInData, redirectLocation, redirectIfLogInStateIsThis]);

  return loggedInData !== undefined && loggedInData.data === redirectIfLogInStateIsThis;
}
