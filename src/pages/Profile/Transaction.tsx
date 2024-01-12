export default function Transaction({
  id,
  isbn,
  title,
  price,
  date,
}: {
  id: string;
  isbn: string;
  title: string;
  price: number;
  date: string;
}) {
  return (
    <div className="transaction-list__transaction">
      <div className="transaction__id-pill">
        <p>#{id}</p>
      </div>
      <div className="transaction__details">
        <p>
          You've bought{" "}
          <span className="transaction__book-title" title={isbn}>
            {title}
          </span>{" "}
          for <span>{price}</span> lei on <span>{date}</span>
        </p>
      </div>
    </div>
  );
}
