import { useCallback, useEffect, useMemo, useState } from "react";
import { createMobile, deleteMobile, errorMessage, getMobiles, updateMobile } from "./api";
import MobileCard from "./components/MobileCard";
import MobileForm from "./components/MobileForm";
import ConfirmDialog from "./components/ConfirmDialog";

export default function App() {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (text, type = "ok") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMobiles(await getMobiles());
    } catch (err) {
      notify(errorMessage(err), "err");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const brands = useMemo(() => [...new Set(mobiles.map((m) => m.brand))].sort(), [mobiles]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mobiles.filter(
      (m) =>
        (!brand || m.brand === brand) &&
        (!q || [m.name, m.brand, m.color].join(" ").toLowerCase().includes(q))
    );
  }, [mobiles, search, brand]);

  const stats = useMemo(
    () => ({
      models: mobiles.length,
      units: mobiles.reduce((s, m) => s + m.stock, 0),
      value: mobiles.reduce((s, m) => s + m.stock * m.price, 0),
    }),
    [mobiles]
  );

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const save = async (data) => {
    setBusy(true);
    try {
      if (editing) {
        const updated = await updateMobile(editing._id, data);
        setMobiles((list) => list.map((m) => (m._id === updated._id ? updated : m)));
        notify("Changes saved");
      } else {
        const created = await createMobile(data);
        setMobiles((list) => [created, ...list]);
        notify("Mobile added");
      }
      closeForm();
    } catch (err) {
      notify(errorMessage(err), "err");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteMobile(toDelete._id);
      setMobiles((list) => list.filter((m) => m._id !== toDelete._id));
      notify("Mobile deleted");
      setToDelete(null);
    } catch (err) {
      notify(errorMessage(err), "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Mobile Store 2026</h1>
          <p className="sub">Admin panel</p>
        </div>
        <button className="btn primary" onClick={openAdd}>+ Add mobile</button>
      </header>

      <section className="stats">
        <div><span>{stats.models}</span>Models</div>
        <div><span>{stats.units}</span>Units in stock</div>
        <div><span>₹{stats.value.toLocaleString("en-IN")}</span>Stock value</div>
      </section>

      <section className="filters">
        <input
          type="search"
          placeholder="Search by name, brand or colour"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </section>

      {loading ? (
        <p className="state">Loading mobiles…</p>
      ) : visible.length === 0 ? (
        <div className="state empty">
          <p>{mobiles.length === 0 ? "No mobiles in the store yet." : "No mobiles match your search."}</p>
          {mobiles.length === 0 && <button className="btn primary" onClick={openAdd}>Add your first mobile</button>}
        </div>
      ) : (
        <main className="list">
          {visible.map((m) => (
            <MobileCard key={m._id} mobile={m} onEdit={openEdit} onDelete={setToDelete} />
          ))}
        </main>
      )}

      {formOpen && <MobileForm initial={editing} onSubmit={save} onClose={closeForm} saving={busy} />}
      {toDelete && (
        <ConfirmDialog mobile={toDelete} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} busy={busy} />
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}
    </div>
  );
}
