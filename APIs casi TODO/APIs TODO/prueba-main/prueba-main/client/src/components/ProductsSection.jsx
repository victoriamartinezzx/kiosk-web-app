import ProductCard from "./ProductCard";

function ProductsSection({ title, products = [], categories = [] }) {
  return (
    <section style={styles.section}>
      {title && <h2 style={styles.title}>{title}</h2>}

      {products.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          No hay productos disponibles.
        </p>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} categories={categories} />
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    margin: "26px 0",
    padding: "0 20px",
  },
  title: {
    margin: "0 0 14px",
    fontSize: 22,
    fontWeight: 600,
    color: "#111827",
  },
  grid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  },
};

export default ProductsSection;

