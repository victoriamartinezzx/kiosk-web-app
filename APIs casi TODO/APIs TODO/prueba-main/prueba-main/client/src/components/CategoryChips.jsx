function CategoryChips({ items, activeId, onChange }) {
  return (
    <div style={styles.wrap}>
      {items.map((c) => (
        <button
          key={c.id}
          onClick={() => {
            onChange(c.id);
          }}
          style={{
            ...styles.btn,
            ...(activeId === c.id ? styles.active : {}),
          }}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}


const styles = {
  wrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "12px 0 20px",
  },
  btn: {
    border: "1px solid #d1d5db",
    borderRadius: 999,
    padding: "6px 14px",
    cursor: "pointer",
    background: "#fff",
  },
  active: {
    background: "#16a34a",
    color: "#fff",
    borderColor: "#16a34a",
  },
};

export default CategoryChips;
