import { useEffect, useState } from "react";

export default function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section style={styles.section}>
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.src}
          alt={s.alt}
          style={{
            ...styles.img,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      ))}
    </section>
  );
}

const styles = {
  section: {
    position: "relative",
    overflow: "hidden",
    height: "520px",
    borderRadius: 12,
  },
  img: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};