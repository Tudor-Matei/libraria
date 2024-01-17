import AuthorisationResponse from "./AuthorisationResponse";
import { IProfileData } from "./IProfileData";
import authorise from "./authorise";

export default async function profileLoader(): Promise<{
  error: string | null;
  data: boolean;
  profileData: IProfileData | null;
}> {
  const authorisationResponse: AuthorisationResponse = await authorise();
  if (authorisationResponse.error !== null)
    return {
      error: authorisationResponse.error,
      data: authorisationResponse.data,
      profileData: null,
    };

  const rawUserDataFromLocalStorage: string | null = localStorage.getItem("data");

  if (rawUserDataFromLocalStorage === null) {
    return {
      error: "The user data is missing.",
      data: authorisationResponse.data,
      profileData: null,
    };
  }

  const { user_id }: { user_id?: string } = JSON.parse(rawUserDataFromLocalStorage);
  if (user_id === undefined) {
    return {
      error: "The user data is malformed.",
      data: authorisationResponse.data,
      profileData: null,
    };
  }

  try {
    const profileDataResponse: { error: string | null; data: IProfileData } = await fetch(
      "http://localhost/libraria/php/get-profile.php",
      {
        method: "POST",
        body: JSON.stringify({
          user_id: parseInt(user_id),
        }),
      }
    ).then((response) => response.json());

    if (profileDataResponse.error !== null) return { error: profileDataResponse.error, data: false, profileData: null };

    return {
      error: null,
      data: authorisationResponse.data,
      profileData: profileDataResponse.data,
    };
  } catch (fetchError) {
    return {
      error: "There's been an error fetching books.",
      data: false,
      profileData: null,
    };
  }
}
