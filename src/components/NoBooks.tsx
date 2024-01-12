import { ReactNode } from "react";

export default function NoBooks({
  iconFillColor,
  children,
  className,
}: {
  iconFillColor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"no-books-found " + className || ""}>
      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
        <path
          fill={iconFillColor}
          d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
        />
      </svg>
      <p>{children}</p>
    </div>
  );
}
