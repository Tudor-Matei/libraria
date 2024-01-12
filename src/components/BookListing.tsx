import { Link } from "react-router-dom";

interface BookListingParameters {
  className: string;
  isbn: string;
  name: string;
  author: string;
  genre: string;
  quantity: number;
  price: number;
  image: string;
}

export default function BookListing({
  className,
  isbn,
  name,
  author,
  genre,
  quantity,
  price,
  image,
}: BookListingParameters) {
  return (
    <div className={`book ${className}`}>
      <img src={image} />
      <h3 title={name} className="book__name">
        {name}
      </h3>
      <p title={author || "unknown"} className="book__author">
        by: <i>{author || "unknown"}</i>
      </p>
      <div className="book__genre-pill">{genre}</div>
      <div className="book__quantity-price-container">
        <p className="book__quantity">
          <strong style={quantity < 10 ? { color: "var(--invalid-color)", fontSize: "var(--font-medium)" } : {}}>
            {quantity}
          </strong>{" "}
          books in stock
        </p>
        <p className="book__quantity-price-separator">&#8231;</p>
        <p className="book__price">
          <strong>{price}</strong> lei
        </p>
      </div>
      {/* TODO: CartContext */}
      <Link to={``}>
        <button className="primary-button book__add-to-cart">Add to cart</button>
      </Link>
    </div>
  );
}
