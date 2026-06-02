import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PromoBar from "../components/PromoBar";
import HeroCarousel from "../components/HeroCarousel";
import { API_BASE } from "../lib/api";

function Home() {
  const dispatch = useDispatch();
  const { banners, welcomeText } = useSelector((state) => state.content);

  const slides = (banners || []).map((b) => ({ 
    src: `${API_BASE}/api/content/banners/${b.id}/image`, 
    alt: b.title || b.subtitle || "Banner" 
  }));

  const welcomeTexts = (welcomeText || []).filter((t) => t.active);

  return (
    <>
      <main className="container" style={{ paddingTop: 16 }}>
        <HeroCarousel slides={slides} height={380} />


        {welcomeTexts.length > 0 && (
          <section style={{
            margin: "20px 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px"
          }}>
            {welcomeTexts.map((text) => (
              <div key={text.id} style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                padding: "20px 24px",
                borderRadius: "12px",
                border: "2px solid #86efac",
                boxShadow: "0 4px 6px rgba(34, 197, 94, 0.1), 0 2px 4px rgba(34, 197, 94, 0.06)",
                fontSize: "1.25rem",
                lineHeight: "1.7",
                color: "#000000",
                fontWeight: "600",
                fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "0.3px",
                textAlign: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(34, 197, 94, 0.15), 0 4px 6px rgba(34, 197, 94, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(34, 197, 94, 0.1), 0 2px 4px rgba(34, 197, 94, 0.06)";
              }}>
                {text.content}
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
export default Home;