import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import { wishlistAtom } from "../recoil/atoms";
import { wishlistApi } from "../api/tripsApi";
import WishlistCard from "../components/trips/WishlistCard";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";

const Wishlist = () => {
  const [items, setItems] = useRecoilState(wishlistAtom);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await wishlistApi.list();
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (id) => {
    await wishlistApi.remove(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ position: "relative", minHeight: "calc(100vh - 128px)", color: "#f4efe4" }}
    >
      {/* Background Image overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.32) saturate(0.85) contrast(1.1)",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "2.2rem", fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)", marginBottom: 6 }}>Wishlist</h1>
        <p style={{ color: "rgba(244, 239, 228, 0.6)", fontSize: "0.95rem" }}>
          Destinations you've saved from Discover. Turn any of them into a trip when you're ready.
        </p>
      </div>

      {loading && <Loader label="Loading wishlist..." />}

      {!loading && items.length === 0 && (
        <div className="card" style={{ padding: "48px 24px" }}>
          <EmptyState
            icon="♡"
            title="Your wishlist is empty"
            description="Head to Discover, search a destination, and save it here."
            action={
              <button className="btn-cinematic" onClick={() => navigate("/discover")} style={{ marginTop: 12 }}>
                Discover destinations
              </button>
            }
          />
        </div>
      )}

      {!loading && items.length > 0 && (
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              key={item._id}
            >
              <WishlistCard
                item={item}
                onRemove={handleRemove}
                onPlanTrip={() => navigate("/trips")}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Wishlist;
