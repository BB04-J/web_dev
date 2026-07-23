// Optional helper: creates a demo user with a couple of sample trips.
// Run with: npm run seed
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Trip from "../models/Trip.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const email = "demo@voyager.app";
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: "Demo Traveler",
      email,
      password: "password123",
    });
    console.log(`Created demo user: ${email} / password123`);
  } else {
    console.log("Demo user already exists, reusing it.");
  }

  const existingTrips = await Trip.countDocuments({ user: user._id });
  if (existingTrips === 0) {
    await Trip.create([
      {
        user: user._id,
        title: "Tokyo Adventure",
        destination: "Tokyo",
        country: "Japan",
        coordinates: { lat: 35.6762, lon: 139.6503 },
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        budgetLimit: 2000,
        currency: "USD",
        status: "upcoming",
        itinerary: [
          { day: 1, title: "Arrive, explore Shinjuku", time: "10:00" },
          { day: 2, title: "Senso-ji Temple & Asakusa", time: "09:00" },
        ],
        budgetItems: [
          { label: "Flights", category: "transport", amount: 850 },
          { label: "Hotel (10 nights)", category: "stay", amount: 900 },
        ],
        packingList: [
          { label: "Passport", packed: true, category: "documents" },
          { label: "Adapter plug", packed: false, category: "electronics" },
        ],
      },
    ]);
    console.log("Seeded a sample trip.");
  }

  console.log("Done.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
