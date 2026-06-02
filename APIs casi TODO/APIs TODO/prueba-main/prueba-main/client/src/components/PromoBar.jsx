import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


function PromoBar({ items = null, intervalMs = 3000 }) {
  const dispatch = useDispatch();
  const [i, setI] = useState(0);
  const { promos } = useSelector((state) => state.content);


  const remoteItems = (promos || []).map((p) => p.message).filter(Boolean);
  const effectiveItems = items && items.length ? items : remoteItems;

  useEffect(() => {
    if (!effectiveItems.length) return;
    const id = setInterval(() => setI((n) => (n + 1) % effectiveItems.length), intervalMs);
    return () => clearInterval(id);
  }, [effectiveItems, intervalMs]);

  if (!effectiveItems.length) return null;

  return (
    <div style={styles.bar}>
      <div style={styles.inner}>
        <span key={i} style={styles.msg}>{effectiveItems[i]}</span>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    background: "#0b3d0b", color: "#fff",
    fontSize: 14, padding: "6px 12px",
  },
  inner: { maxWidth: 1200, margin: "0 auto", textAlign: "center" },
  msg: { display: "inline-block", transition: "opacity .3s ease" },
};

export default PromoBar;