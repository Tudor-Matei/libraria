import { useContext } from "react";
import { CartContext } from "../utils/CartContext";
import IBookData from "../utils/IBookData";

type BookListingParameters = Partial<IBookData> & {
  image: string;
  name: string;
  genre: string;
  price: number;
  className?: string;
  showAddToCartButton?: boolean;
};

export default function BookListing({
  className,
  name,
  isbn,
  author,
  genre,
  quantity,
  price,
  image,
  published_at,
  showAddToCartButton = true,
}: BookListingParameters) {
  const { setCartContents } = useContext(CartContext);

  return (
    <div className={`book ${className || ""} ${quantity === 0 ? "book--disabled" : ""}`}>
      <div className="book__image-container" style={{ backgroundImage: `url("${image}")` }}></div>
      <div>
        <h3 title={name} className="book__name">
          {name}
        </h3>
        <p title={author || "unknown"} className="book__author">
          by: <i>{author || "unknown"}</i>
        </p>
        <p className="book__published-at">
          {published_at !== undefined && published_at !== "0000-00-00" ? `published at: ${published_at}` : ""}
        </p>
        <div className="book__genre-pill">{genre}</div>
        <div className="book__quantity-price-container">
          {quantity !== undefined && (
            <>
              <p className="book__quantity">
                <strong style={quantity < 10 ? { color: "var(--invalid-color)", fontSize: "var(--font-medium)" } : {}}>
                  {quantity}
                </strong>{" "}
                book{quantity !== 1 ? "s" : ""} in stock
              </p>
              <p className="book__quantity-price-separator">&#8231;</p>
            </>
          )}
          <p className="book__price">
            <strong>{price}</strong> lei
          </p>
        </div>
        {showAddToCartButton && (
          <button
            onClick={() => {
              if (quantity !== undefined && quantity <= 0) return;

              setCartContents((previousCartContents) => [
                ...previousCartContents,
                { isbn: isbn || "", image, name, price, genre },
              ]);
            }}
            className="primary-button book__add-to-cart"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
