const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function MobileCard({ mobile, onEdit, onDelete }) {
  const { name, brand, price, ram, storage, color, stock, image, description } = mobile;
  const low = stock <= 5;

  return (
    <article className="card">
      <div className="thumb">
        {image ? <img src={image} alt={name} loading="lazy" onError={(e) => (e.target.style.display = "none")} /> : null}
        <span className="thumb-fallback">{brand.slice(0, 1)}</span>
      </div>

      <div className="card-body">
        <p className="brand">{brand}</p>
        <h3>{name}</h3>
        <p className="specs">{[ram, storage, color].filter(Boolean).join(" · ") || "No specs added"}</p>
        {description && <p className="desc">{description}</p>}

        <div className="card-foot">
          <strong className="price">{money(price)}</strong>
          <span className={`stock ${stock === 0 ? "out" : low ? "low" : ""}`}>
            {stock === 0 ? "Out of stock" : `${stock} in stock`}
          </span>
        </div>

        <div className="card-actions">
          <button className="btn small" onClick={() => onEdit(mobile)}>Edit</button>
          <button className="btn small danger" onClick={() => onDelete(mobile)}>Delete</button>
        </div>
      </div>
    </article>
  );
}
