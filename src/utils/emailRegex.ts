// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export default function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
