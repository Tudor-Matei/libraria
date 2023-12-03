import AuthorisationResponse from "./AuthorisationResponse";
import BookDataType from "./BookDataType";
import authorise from "./authorise";

export default async function shopLoader(): Promise<{
  error: string | null;
  data: boolean;
  bookData: BookDataType[];
}> {
  const authorisationResponse: AuthorisationResponse = await authorise();
  if (authorisationResponse.error !== null)
    return { error: authorisationResponse.error, data: authorisationResponse.data, bookData: [] };

  try {
    const bookDataResponse: { error: string | null; data?: BookDataType[] } = await fetch(
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
