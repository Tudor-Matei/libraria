import { ICartContents } from "./CartContext";

export type ICollapsedContents = ICartContents & { quantity: number };

export function replaceCartDuplicatesWithQuantity(cartContents: ICartContents[]): ICollapsedContents[] {
  const seenBookISBNs: Map<string, number> = new Map();
  const collapsedDuplicates: ICollapsedContents[] = [];

  for (const book of cartContents) {
    const currentBookPosition: number | undefined = seenBookISBNs.get(book.isbn);

    if (currentBookPosition !== undefined) collapsedDuplicates[currentBookPosition].quantity++;
    else {
      const currentCollapsedBook: ICollapsedContents = { ...book, quantity: 1 };
      collapsedDuplicates.push(currentCollapsedBook);
      seenBookISBNs.set(currentCollapsedBook.isbn, collapsedDuplicates.length - 1);
    }
  }

  return collapsedDuplicates;
}
