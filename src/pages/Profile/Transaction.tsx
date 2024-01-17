export default function Transaction({
  id,
  name,
  price,
  quantity,
  date,
}: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  date: string;
}) {
  return (
    <div className="transaction-list__transaction">
      <div className="transaction__id-pill">
        <p>#{id}</p>
      </div>
      <div className="transaction__details">
        <p>
          You've bought <span className="transaction__book-title">{name + ` (${quantity})`}</span> for{" "}
          <span>{price}</span> lei on <span>{date}</span>
        </p>
      </div>
    </div>
  );
}
