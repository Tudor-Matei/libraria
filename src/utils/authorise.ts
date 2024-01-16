import AuthorisationResponse from "./AuthorisationResponse";

export default function authorise(): Promise<AuthorisationResponse> {
  return fetch("http://localhost/libraria/php/auth.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch(() => ({ error: "Error trying to authorise", data: false }));
}
