import { useEffect, useRef, useState } from "react";
import ClientReview from "../../components/ClientReview";

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [isFirstTimeAnimating, setFirstTimeAnimating] = useState(true);
  const pillRef = useRef(null);

  const clientReviews = [
    <ClientReview name="Jane Doe" imageURL="src/assets/person1.jpg" stars={4.4}>
      Absolutely thrilled with my experience at this online bookshop! The diversity of titles, easy navigation, and
      quick delivery have made me a loyal customer. From the latest releases to hard-to-find gems, they've got it all.
    </ClientReview>,
    <ClientReview name="Josh Kane" imageURL="src/assets/person2.jpg" stars={4.8}>
      The checkout process was smooth, and my books arrived in pristine condition, packaged with care. I highly
      recommend this bookshop to fellow bookworms looking for a hassle-free and delightful shopping experience. Can't
      wait to explore more from their collection!
    </ClientReview>,
    <ClientReview name="Jack Metzner" imageURL="src/assets/person3.jpg" stars={4.2}>
      I stumbled upon this online bookshop while searching for a specific title, and I must say, what a delightful find!
      The website's layout was incredibly user-friendly, making it effortless to browse through their collection. It
      could have benefitted from a broader selection of books, though.
    </ClientReview>,
    <ClientReview name="Tiffany Smith" imageURL="src/assets/person4.jpg" stars={4.5}>
      This experience has made me a loyal customer. I'll definitely be returning for my future literary adventures.
      Highly recommended for book lovers seeking a seamless shopping experience and a diverse range of titles.
    </ClientReview>,
  ];

  useEffect(() => {
    const pill = pillRef.current as unknown as HTMLDivElement;
    if (isFirstTimeAnimating) {
      pill.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }], {
        duration: 10000,
        easing: "linear",
      });
      setFirstTimeAnimating(false);
    }

    const carouselTimeoutID: ReturnType<typeof setTimeout> = setTimeout(() => {
      setIndex((index + 1) % 4);
      pill.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }], {
        duration: 10000,
        easing: "linear",
      });
    }, 10000);

    return () => clearTimeout(carouselTimeoutID);
  }, [index]);

  return (
    <section className="reviews">
      <div ref={pillRef} className="reviews__overlay"></div>
      <h1>What our clients say about us</h1>
      <div className="reviews__client-reviews">{clientReviews[index]}</div>
    </section>
  );
}
