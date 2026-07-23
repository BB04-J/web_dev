const WishlistCard = ({ item, onRemove, onPlanTrip }) => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <h3 style={{ fontSize: "1.05rem" }}>{item.name}</h3>
        {item.country && <p style={{ fontSize: "0.82rem" }}>{item.country}</p>}
      </div>
      <button
        className="btn btn-danger"
        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
        onClick={() => onRemove(item._id)}
        aria-label={`Remove ${item.name} from wishlist`}
      >
        Remove
      </button>
    </div>
    {item.notes && <p style={{ fontSize: "0.85rem", marginTop: 8 }}>{item.notes}</p>}
    {onPlanTrip && (
      <button
        className="btn btn-ghost"
        style={{ marginTop: 14, fontSize: "0.8rem" }}
        onClick={() => onPlanTrip(item)}
      >
        Plan a trip here →
      </button>
    )}
  </div>
);

export default WishlistCard;
