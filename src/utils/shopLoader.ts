import AuthorisationResponse from "./AuthorisationResponse";
import IBookData from "./IBookData";
import authorise from "./authorise";

export default async function shopLoader(): Promise<{
  error: string | null;
  data: boolean;
  bookData: IBookData[];
}> {
  const authorisationResponse: AuthorisationResponse = await authorise();
  if (authorisationResponse.error !== null)
    return { error: authorisationResponse.error, data: authorisationResponse.data, bookData: [] };

  try {
    const bookDataResponse: { error: string | null; data?: IBookData[] } = await fetch(
      "http://localhost/libraria/php/get-books.php",
      {
        method: "POST",
        body: JSON.stringify({
          filter: "none",
          count: 50,
        }),
      }
    ).then((response) => response.json());

    if (bookDataResponse.error !== null) return { error: bookDataResponse.error, data: false, bookData: [] };
    return {
      error: null,
      data: authorisationResponse.data,
      bookData: bookDataResponse.data === undefined ? [] : bookDataResponse.data,
    };
  } catch (fetchError) {
    return { error: "There's been an error fetching books.", data: false, bookData: [] };
  }
}
