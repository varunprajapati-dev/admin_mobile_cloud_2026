import { useEffect, useState } from "react";

const empty = {
  name: "",
  brand: "",
  price: "",
  ram: "",
  storage: "",
  color: "",
  stock: "",
  image: "",
  description: "",
};

export default function MobileForm({ initial, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(empty);
  const editing = Boolean(initial?._id);

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty);
  }, [initial]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="sheet" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="sheet-head">
          <h2>{editing ? "Edit mobile" : "Add mobile"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="grid">
          <label>Model name
            <input name="name" value={form.name} onChange={change} placeholder="Galaxy S26" required />
          </label>
          <label>Brand
            <input name="brand" value={form.brand} onChange={change} placeholder="Samsung" required />
          </label>
          <label>Price (₹)
            <input name="price" type="number" min="0" value={form.price} onChange={change} required />
          </label>
          <label>Stock
            <input name="stock" type="number" min="0" value={form.stock} onChange={change} />
          </label>
          <label>RAM
            <input name="ram" value={form.ram} onChange={change} placeholder="8 GB" />
          </label>
          <label>Storage
            <input name="storage" value={form.storage} onChange={change} placeholder="128 GB" />
          </label>
          <label>Colour
            <input name="color" value={form.color} onChange={change} />
          </label>
          <label>Image URL
            <input name="image" value={form.image} onChange={change} placeholder="https://…" />
          </label>
        </div>

        <label className="full">Description
          <textarea name="description" rows="3" value={form.description} onChange={change} />
        </label>

        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Add mobile"}
          </button>
        </div>
      </form>
    </div>
  );
}
