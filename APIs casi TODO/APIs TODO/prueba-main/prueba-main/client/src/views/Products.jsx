import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CategoryChips from "../components/CategoryChips";
import ProductsSection from "../components/ProductsSection";


function getRoleFromToken(token) {
  try {
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const payload = JSON.parse(atob(payloadBase64));

    return payload.userType || null;
  } catch (err) {
    console.error("Error al leer token:", err);
    return null;
  }
}

function Products({ categories, cat, setCat, filtered }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { items: allProducts } = useSelector((state) => state.products);
  const [role, setRole] = useState(null);
  const [searchParams] = useSearchParams();


  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    discounted: false,
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setRole(getRoleFromToken(token));
  }, [token]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categoryFromUrl !== cat) {
      setCat(categoryFromUrl);
    }
  }, [searchParams, setCat]);

  useEffect(() => {
    let result = [...allProducts];

    if (cat && cat !== "all") {
      result = result.filter((p) => p.category?.id === parseInt(cat));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.discounted) {
      result = result.filter((p) => p.discount > 0);
    }

    setFilteredProducts(result);
  }, [allProducts, cat, filters]);

  const handleGoToAdmin = () => navigate("/admin/products");

  return (
    <main className="container" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Categorías</h2>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div>
          <label htmlFor="products-search" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Buscar productos
          </label>
          <input
            id="products-search"
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="products-min-price" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Precio mínimo
          </label>
          <input
            id="products-min-price"
            type="number"
            placeholder="Precio mínimo"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            style={{ width: 120 }}
          />
        </div>
        <div>
          <label htmlFor="products-max-price" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Precio máximo
          </label>
          <input
            id="products-max-price"
            type="number"
            placeholder="Precio máximo"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            style={{ width: 120 }}
          />
        </div>
        <label htmlFor="products-discounted">
          <input
            id="products-discounted"
            type="checkbox"
            checked={filters.discounted}
            onChange={(e) =>
              setFilters({ ...filters, discounted: e.target.checked })
            }
          />
          Solo con descuento
        </label>
      </div>

      <CategoryChips
        items={[{ id: "all", name: "Todos" }, ...categories]}
        activeId={cat}
        onChange={setCat}
      />

      <ProductsSection
        title="Productos Destacados"
        products={filteredProducts}
        categories={categories}
      />

      {filteredProducts.length === 0 && (
        <p style={{ marginTop: 20, color: "#6b7280" }}>
          No hay productos disponibles.
        </p>
      )}
    </main>
  );
}

export default Products;


