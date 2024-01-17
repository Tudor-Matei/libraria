import BookEditorFormStateType from "../types/BookEditorFormStateType";

export default function bookEditorFormValidator(values: BookEditorFormStateType) {
  const errors: {
    target_isbn?: string;
    name?: string;
    genre?: string;
    pages?: string;
    quantity?: string;
    price?: string;
    image?: string;
    all?: string;
  } = {};

  const { target_isbn, pages, quantity, price } = values;
  console.log(values);

  if (target_isbn.trim().length !== 14 || !/(978|979)-[0-9]{10}/.test(target_isbn.trim()))
    errors.target_isbn = "The format of an ISBN is (978/979)-(10 digits).";

  if (pages.trim() !== "") {
    console.log(pages);
    const parsedPages: number = parseInt(pages);
    if (isNaN(parsedPages)) errors.pages = "The pages must be a valid number.";
    if (parsedPages < 0) errors.pages = "The page count must be positive for obvious reasons.";
    else if (parsedPages !== Math.floor(parsedPages)) errors.pages = "The page count must be a whole number.";
  }

  if (quantity.trim() !== "") {
    const parsedQuantity: number = parseInt(quantity);
    if (isNaN(parsedQuantity)) errors.quantity = "The quantity must be a valid number.";
    else if (parsedQuantity < 0) errors.quantity = "The number of books must be positive for obvious reasons.";
    else if (parsedQuantity !== Math.floor(parsedQuantity))
      errors.quantity = "The number of books must be a whole number.";
  }

  if (price.trim() !== "") {
    const parsedPrice: number = parseFloat(price);
    if (isNaN(parsedPrice)) errors.price = "The price must be a valid number.";
    else if (parsedPrice === 0) errors.price = "Nothing is really free.";
    else if (parsedPrice < 0) errors.price = "The price must be positive for obvious reasons.";
  }

  if (
    Object.entries(values).every(([key, value]: [string, string]) => {
      if (key === "target_isbn") return true;
      return value.trim() === "";
    })
  )
    errors.all = "You must at least edit something.";

  return errors;
}
