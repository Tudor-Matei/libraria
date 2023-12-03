import React from "react";
import RatingStar from "./RatingStar";

interface ClientReviewParameters {
  className?: string | null;
  name: string;
  imageURL: string;
  stars: number;
  children: React.ReactNode;
}

export default function ClientReview({ className = null, name, imageURL, stars, children }: ClientReviewParameters) {
  return (
    <>
      <div className={`reviews__client-review ${className ?? ""}`}>
        <img src={imageURL} className="reviews__client-image" />
        <div className="reviews__rating">
          {Array(Math.floor(stars))
            .fill(null)
            .map((_, i) => (
              <RatingStar key={`rating-star-whole-${i}`} fillPercentage={100} />
            ))}
          {Math.floor(stars) !== stars && <RatingStar fillPercentage={(stars - Math.floor(stars)) * 100} />}
          {Array(Math.floor(5 - stars))
            .fill(null)
            .map((_, i) => (
              <RatingStar key={`rating-star-empty-${i}`} fillPercentage={0} />
            ))}
        </div>
        <h3 className="reviews__client-name">{name}</h3>
        <p className="reviews__client-description">"{children}"</p>
      </div>
    </>
  );
}
