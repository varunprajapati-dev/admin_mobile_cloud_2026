export default function ConfirmDialog({ mobile, onConfirm, onCancel, busy }) {
  return (
    <div className="overlay center" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Delete {mobile.name}?</h2>
        <p>This removes the {mobile.brand} {mobile.name} from your store. You can't undo this.</p>
        <div className="actions">
          <button className="btn ghost" onClick={onCancel}>Keep it</button>
          <button className="btn danger solid" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting…" : "Delete mobile"}
          </button>
        </div>
      </div>
    </div>
  );
}
