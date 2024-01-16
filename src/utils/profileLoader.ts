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

  try {
    const profileDataResponse: { error: string | null; data: IProfileData } = await fetch(
      "http://localhost/libraria/php/get-profile.php",
      {
        method: "POST",
        body: JSON.stringify({
          // TODO: where do I get user_id from?
          user_id: 929067,
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
