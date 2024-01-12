import BookAdderFormStateType from "./BookAdderFormStateType";

export default function bookAdderFormValidator({
  isbn,
  name,
  genre,
  pages,
  quantity,
  price,
  image,
}: BookAdderFormStateType) {
  const errors: {
    isbn?: string;
    name?: string;
    genre?: string;
    pages?: string;
    quantity?: string;
    price?: string;
    image?: string;
  } = {};

  if (isbn.trim().length !== 14 || !/(978|979)-[0-9]{10}/.test(isbn.trim()))
    errors.isbn = "The format of an ISBN is (978/979)-(10 digits).";

  if (name.trim() === "") errors.name = "The book name is missing.";

  if (genre.trim() === "") errors.genre = "You have not specified a genre for this book.";

  if (pages === 0) errors.pages = "Books must have pages.";
  else if (pages < 0) errors.pages = "The page count must be positive for obvious reasons.";
  else if (pages !== Math.floor(pages)) errors.pages = "The page count must be a whole number.";

  if (quantity < 0) errors.quantity = "The number of books must be positive for obvious reasons.";
  if (quantity !== Math.floor(quantity)) errors.quantity = "The number of books must be a whole number.";

  if (price.toString() === "") errors.price = "Please put in a price for the book.";
  else if (price === 0) errors.price = "Nothing is really free.";
  else if (price < 0) errors.price = "The price must be positive for obvious reasons.";

  if (image.trim() === "") errors.image = "You have not uploaded an image.";

  return errors;
}
