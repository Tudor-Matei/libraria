import { createContext } from "react";

export const CartContext = createContext({
  cartContents: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartContents: () => {},
} as ICartContext);

export interface ICartContents {
  isbn: string;
  image: string;
  name: string;
  genre: string;
  price: number;
}

export interface ICartContext {
  cartContents: ICartContents[];
  setCartContents: React.Dispatch<React.SetStateAction<ICartContents[]>>;
}
