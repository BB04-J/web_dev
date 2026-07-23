import Trip from "../models/Trip.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper: safe JSON prompt for Gemini
const queryGemini = async (prompt) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (status ${response.status}):`, errorText);
      return null;
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini API call failed, falling back to mock:", err);
    return null;
  }
};

// 1. AI Trip Planner
export const aiPlanItinerary = asyncHandler(async (req, res) => {
  const { destination, travelers, budget, duration, style, interests } = req.body;
  if (!destination) {
    throw new ApiError(400, "Destination is required");
  }

  const daysCount = parseInt(duration) || 3;
  const travelersCount = parseInt(travelers) || 1;

  // Attempt real AI generation
  const prompt = `
    Generate a travel itinerary for "${destination}" for ${daysCount} days, ${travelersCount} travelers, budget level "${budget}" USD, travel style "${style}", interests: ${JSON.stringify(interests || [])}.
    Respond ONLY with a JSON object in this format:
    {
      "itinerary": [
        { "day": 1, "title": "Morning: Arrival & check-in. Afternoon: Explore Central Park. Evening: Dinner at Tavern.", "time": "09:00" },
        ... generate exactly ${daysCount} entries, one stop per day or split as needed
      ],
      "spending": 150,
      "attractions": ["Empire State Building", "Statue of Liberty"],
      "restaurants": ["Balthazar", "Katz's Deli"],
      "tips": ["Buy a subway pass", "Book museum tickets in advance"],
      "packingList": [
        { "label": "Walking Shoes", "category": "clothing" },
        { "label": "Passport & Visas", "category": "documents" }
      ],
      "budgetItems": [
        { "label": "Estimated Flights", "amount": 400, "category": "transport" },
        { "label": "Estimated Lodging", "amount": 500, "category": "stay" },
        { "label": "Food & Restaurants", "amount": 250, "category": "food" },
        { "label": "Activities & Entry Tickets", "amount": 150, "category": "activities" }
      ]
    }
  `;

  let result = await queryGemini(prompt);

  // Fallback to high-quality mock data
  if (!result) {
    const dailyCost = budget === "luxury" ? 250 : budget === "budget" ? 50 : 120;
    const itinerary = [];
    for (let d = 1; d <= daysCount; d++) {
      itinerary.push({
        day: d,
        title: d === 1 
          ? `Arrival in ${destination}, hotel check-in and local orientation walking tour.`
          : d === daysCount
          ? `Morning souvenir shopping at local markets, packing up, and departure.`
          : `Scenic exploration day: Discover major attractions, local monuments, and enjoy regional cuisine.`,
        time: "09:00"
      });
    }

    result = {
      itinerary,
      spending: dailyCost,
      attractions: [`Famous ${destination} Spot 1`, `Famous ${destination} Spot 2`, `Scenic Viewpoint`],
      restaurants: ["Le Gourmand Local", "The Traveler's Tavern"],
      tips: ["Keep cash handy for small vendors", "Learn basic local greetings", "Download offline maps"],
      packingList: [
        { label: "Comfortable sneakers", category: "clothing" },
        { label: "Universal power adapter", category: "electronics" },
        { label: "Weather-appropriate jacket", category: "clothing" },
        { label: "Travel insurance copy", category: "documents" }
      ],
      budgetItems: [
        { label: "Estimated Flights", amount: 450 * travelersCount, category: "transport" },
        { label: "Hotel (Average)", amount: dailyCost * daysCount * 1.2, category: "stay" },
        { label: "Dining & Food", amount: 40 * travelersCount * daysCount, category: "food" },
        { label: "Excursions & Entry Fees", amount: 25 * travelersCount * daysCount, category: "activities" }
      ]
    };
  }

  res.status(200).json({ success: true, data: result });
});

// 2. Smart Budget Estimator
export const estimateBudget = asyncHandler(async (req, res) => {
  const { destination, duration, travelers } = req.query;
  const days = parseInt(duration) || 3;
  const people = parseInt(travelers) || 1;

  // Simulating hotel and flight estimates (Amadeus / Booking APIs)
  const flightPrice = 350 * people;
  const hotelPrice = 110 * days * Math.ceil(people / 2);
  const foodPrice = 45 * days * people;
  const transportPrice = 20 * days;
  const activitiesPrice = 30 * days * people;
  const miscPrice = 15 * days;

  res.status(200).json({
    success: true,
    data: {
      flights: flightPrice,
      hotels: hotelPrice,
      food: foodPrice,
      transport: transportPrice,
      activities: activitiesPrice,
      misc: miscPrice,
      total: flightPrice + hotelPrice + foodPrice + transportPrice + activitiesPrice + miscPrice
    }
  });
});

// 3. Trending Destinations
export const getTrending = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;

  const allTrends = [
    {
      city: "Kyoto",
      country: "Japan",
      code: "JP",
      description: "Step back in time with classical temples, zen gardens, and imperial palaces.",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1500,
      weather: "22°C · Clear Sky ☀️",
      lat: 35.0116,
      lon: 135.7681
    },
    {
      city: "Reykjavik",
      country: "Iceland",
      code: "IS",
      description: "Gateway to majestic glaciers, boiling geysers, and the Aurora Borealis.",
      image: "https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=800&q=80",
      averageBudget: 2100,
      weather: "8°C · Rainy 🌧️",
      lat: 64.1466,
      lon: -21.9426
    },
    {
      city: "Vancouver",
      country: "Canada",
      code: "CA",
      description: "A bustling seaport metropolis surrounded by wild mountains and dense forests.",
      image: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1800,
      weather: "17°C · Partly Cloudy ⛅",
      lat: 49.2827,
      lon: -123.1207
    },
    {
      city: "Cape Town",
      country: "South Africa",
      code: "ZA",
      description: "Where spectacular mountains meet two pristine oceans in cultural harmony.",
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1200,
      weather: "24°C · Clear Sky ☀️",
      lat: -33.9249,
      lon: 18.4241
    },
    {
      city: "Santorini",
      country: "Greece",
      code: "GR",
      description: "Iconic whitewashed cliffside villages overlooking the azure Aegean Sea.",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      averageBudget: 2300,
      weather: "26°C · Sunny ☀️",
      lat: 36.3932,
      lon: 25.4615
    },
    {
      city: "Bali",
      country: "Indonesia",
      code: "ID",
      description: "Tropical paradise with lush rice terraces, sacred temples, and coral reefs.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      averageBudget: 950,
      weather: "29°C · Tropical Breeze 🌴",
      lat: -8.4095,
      lon: 115.1889
    },
    {
      city: "Paris",
      country: "France",
      code: "FR",
      description: "The global center of art, fashion, gastronomy, and timeless romantic history.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      averageBudget: 2200,
      weather: "20°C · Mild ⛅",
      lat: 48.8566,
      lon: 2.3522
    },
    {
      city: "Amalfi Coast",
      country: "Italy",
      code: "IT",
      description: "Dramatic steep cliffs adorned with pastel villages along the Mediterranean coast.",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      averageBudget: 2400,
      weather: "25°C · Clear Sky ☀️",
      lat: 40.634,
      lon: 14.6027
    },
    {
      city: "Sydney",
      country: "Australia",
      code: "AU",
      description: "Vibrant coastal hub famous for its Opera House, Harbour Bridge, and surf beaches.",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1950,
      weather: "21°C · Sunny ☀️",
      lat: -33.8688,
      lon: 151.2093
    },
    {
      city: "Barcelona",
      country: "Spain",
      code: "ES",
      description: "Famed for Antoni Gaudí's whimsical architecture and Mediterranean seaside charm.",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1650,
      weather: "23°C · Clear Sky ☀️",
      lat: 41.3851,
      lon: 2.1734
    },
    {
      city: "Queenstown",
      country: "New Zealand",
      code: "NZ",
      description: "The adventure capital of the world set against the alpine Remarkables mountain range.",
      image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1750,
      weather: "14°C · Crisp Mountain Air 🏔️",
      lat: -45.0312,
      lon: 168.6626
    },
    {
      city: "Dubai",
      country: "United Arab Emirates",
      code: "AE",
      description: "Futuristic skyscraper metropolis with ultramodern luxury shopping and desert safaris.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      averageBudget: 2800,
      weather: "35°C · Hot & Sunny ☀️",
      lat: 25.2048,
      lon: 55.2708
    },
    {
      city: "Swiss Alps",
      country: "Switzerland",
      code: "CH",
      description: "Majestic snow-capped peaks, pristine mountain lakes, and luxury ski resorts.",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
      averageBudget: 2900,
      weather: "12°C · Alpine Breeze 🏔️",
      lat: 46.56,
      lon: 8.56
    },
    {
      city: "Seoul",
      country: "South Korea",
      code: "KR",
      description: "Harmonious blend of ancient royal palaces, hyper-modern tech hubs, and street food.",
      image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1400,
      weather: "19°C · Clear Sky ☀️",
      lat: 37.5665,
      lon: 126.978
    },
    {
      city: "Cairo",
      country: "Egypt",
      code: "EG",
      description: "Cradle of ancient civilization boasting the Great Pyramids of Giza and the Nile River.",
      image: "https://images.unsplash.com/photo-1572252821143-035a0029b35b?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1100,
      weather: "31°C · Sunny Desert Heat ☀️",
      lat: 30.0444,
      lon: 31.2357
    },
    {
      city: "Prague",
      country: "Czech Republic",
      code: "CZ",
      description: "City of a Hundred Spires known for its Gothic churches and historic Old Town Square.",
      image: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80",
      averageBudget: 1350,
      weather: "18°C · Mild ⛅",
      lat: 50.0755,
      lon: 14.4378
    }
  ];

  const startIndex = (page - 1) * limit;
  const paginatedTrends = allTrends.slice(startIndex, startIndex + limit);

  res.status(200).json({
    success: true,
    data: paginatedTrends,
    total: allTrends.length,
    hasMore: startIndex + limit < allTrends.length
  });
});

// 4. Destination Explorer & 10. Nearby Attractions
export const explorePlaces = asyncHandler(async (req, res) => {
  const { destination } = req.query;
  if (!destination) {
    throw new ApiError(400, "Destination query is required");
  }

  // Foursquare mock integration
  const query = destination.toLowerCase().trim();
  let attractions = [
    { name: "Historical Old Town", rating: 8.8, category: "Attractions", distance: "0.5 km", hours: "9:00 AM - 6:00 PM" },
    { name: "City Museum of Art", rating: 9.1, category: "Museums", distance: "1.2 km", hours: "10:00 AM - 5:30 PM" },
    { name: "Central Green Park", rating: 8.5, category: "Parks", distance: "0.8 km", hours: "6:00 AM - 10:00 PM" },
    { name: "The Bistro Café", rating: 8.2, category: "Cafes", distance: "0.2 km", hours: "7:00 AM - 9:00 PM" },
    { name: "Oceanic Seafood Grill", rating: 9.3, category: "Restaurants", distance: "1.5 km", hours: "12:00 PM - 10:30 PM" },
    { name: "Market Street Shopping", rating: 8.0, category: "Shopping", distance: "1.0 km", hours: "10:00 AM - 8:00 PM" }
  ];

  // Tailored responses for popular searches
  if (query.includes("paris")) {
    attractions = [
      { name: "Eiffel Tower", rating: 9.7, category: "Attractions", distance: "2.1 km", hours: "9:00 AM - Midnight" },
      { name: "Louvre Museum", rating: 9.6, category: "Museums", distance: "0.1 km", hours: "9:00 AM - 6:00 PM" },
      { name: "Jardin du Luxembourg", rating: 9.2, category: "Parks", distance: "1.8 km", hours: "8:00 AM - 8:00 PM" },
      { name: "Café de Flore", rating: 8.7, category: "Cafes", distance: "1.4 km", hours: "7:30 AM - 1:30 AM" },
      { name: "L'As du Fallafel", rating: 9.4, category: "Restaurants", distance: "0.8 km", hours: "11:00 AM - 11:00 PM" }
    ];
  } else if (query.includes("tokyo")) {
    attractions = [
      { name: "Senso-ji Temple", rating: 9.5, category: "Attractions", distance: "0.5 km", hours: "6:00 AM - 5:00 PM" },
      { name: "TeamLab Planets", rating: 9.6, category: "Museums", distance: "4.2 km", hours: "9:00 AM - 10:00 PM" },
      { name: "Shinjuku Gyoen", rating: 9.3, category: "Parks", distance: "2.8 km", hours: "9:00 AM - 4:30 PM" },
      { name: "Cafe Reissue (3D Latte)", rating: 8.8, category: "Cafes", distance: "3.5 km", hours: "10:00 AM - 6:00 PM" },
      { name: "Ichiran Ramen Shibuya", rating: 9.1, category: "Restaurants", distance: "3.8 km", hours: "24 Hours" }
    ];
  }

  res.status(200).json({ success: true, data: attractions });
});

// 5. Weather Forecast
export const getWeatherForecast = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    throw new ApiError(400, "Coordinates (lat & lon) are required");
  }

  // Fallback / standard Open-Meteo direct call (or mock OpenWeatherMap)
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_probability,weather_code&forecast_days=7&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    const currentCode = data.current?.weather_code || 0;
    const isRainy = (data.current?.precipitation || 0) > 0 || currentCode > 50;

    const activitySuggestions = isRainy
      ? ["🌧️ Best day to visit indoor museums", "☕ Cozy up in local cafes", "🎭 Watch a theatrical show"]
      : ["☀️ Perfect weather for hiking ridges", "🏖️ Recommended beach picnic afternoon", "🎒 Explore parks and walking tours"];

    res.status(200).json({
      success: true,
      data: {
        temp: data.current?.temperature_2m || 20,
        humidity: data.current?.relative_humidity_2m || 60,
        wind: data.current?.wind_speed_10m || 10,
        rainProbability: data.daily?.precipitation_probability?.[0] || 10,
        suggestions: activitySuggestions,
        forecast: (data.daily?.time || []).map((t, idx) => ({
          date: t,
          tempMax: data.daily?.temperature_2m_max?.[idx] || 25,
          tempMin: data.daily?.temperature_2m_min?.[idx] || 15,
          rainProb: data.daily?.precipitation_probability?.[idx] || 10,
          code: data.daily?.weather_code?.[idx] || 0
        }))
      }
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      data: {
        temp: 22,
        humidity: 55,
        wind: 12,
        rainProbability: 20,
        suggestions: ["☀️ Perfect day for a local tour", "🎒 Walk through historical sites"],
        forecast: []
      }
    });
  }
});

// 6. Currency Converter
export const convertCurrency = asyncHandler(async (req, res) => {
  const { from, to, amount } = req.query;
  const val = parseFloat(amount) || 100;
  const currencyFrom = (from || "USD").toUpperCase();
  const currencyTo = (to || "EUR").toUpperCase();

  // ExchangeRate API mock conversion
  const rates = {
    USD: { EUR: 0.92, JPY: 155.4, GBP: 0.78, CAD: 1.36, INR: 83.5, AUD: 1.5 },
    EUR: { USD: 1.09, JPY: 168.9, GBP: 0.85, CAD: 1.48, INR: 90.7, AUD: 1.63 }
  };

  const conversionRate = rates[currencyFrom]?.[currencyTo] || (currencyFrom === currencyTo ? 1 : 1.1);
  const convertedVal = val * conversionRate;
  const recommendDaily = Math.round((convertedVal / 7) * 10) / 10;

  res.status(200).json({
    success: true,
    data: {
      rate: conversionRate,
      convertedAmount: convertedVal,
      dailyRecommend: recommendDaily
    }
  });
});

// 7. Smart Packing List
export const generatePackingList = asyncHandler(async (req, res) => {
  const { destination, season, weather } = req.body;

  const prompt = `
    Generate a travel packing list for "${destination}" in season "${season}" and weather forecast "${weather}".
    Respond ONLY with a JSON array of objects representing items, formatted like this:
    [
      { "label": "Sunglasses", "category": "clothing" },
      { "label": "Sunscreen", "category": "toiletries" },
      ...
    ]
  `;

  let items = await queryGemini(prompt);

  if (!items) {
    // Smart mock checklist based on weather/season inputs
    const weatherLower = (weather || "").toLowerCase();
    items = [
      { label: "Passport & Identity Docs", category: "documents" },
      { label: "Universal Power Adapter", category: "electronics" },
      { label: "Toothbrush & Toothpaste", category: "toiletries" },
      { label: "Comfortable Walking Shoes", category: "clothing" }
    ];

    if (weatherLower.includes("rain") || weatherLower.includes("cloud")) {
      items.push({ label: "Umbrella", category: "essentials" });
      items.push({ label: "Waterproof Rain Jacket", category: "clothing" });
    }
    if (season === "winter" || weatherLower.includes("snow") || weatherLower.includes("cold")) {
      items.push({ label: "Heavy Winter Coat", category: "clothing" });
      items.push({ label: "Thermal Gloves & Scarf", category: "clothing" });
      items.push({ label: "Lip Balm (Anti-dry)", category: "toiletries" });
    } else {
      items.push({ label: "Sunglasses", category: "essentials" });
      items.push({ label: "Sunscreen SPF 50", category: "toiletries" });
      items.push({ label: "Breathable t-shirts & shorts", category: "clothing" });
    }
  }

  res.status(200).json({ success: true, data: items });
});

// 11. Travel Insights Dashboard
export const getTravelInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const trips = await Trip.find({ user: userId });

  let totalTrips = trips.length;
  let upcomingTrips = 0;
  let totalBudget = 0;
  let totalDurationDays = 0;

  const uniqueCountries = new Set();
  const destinationsCount = {};
  const categoriesSum = { stay: 0, transport: 0, food: 0, activities: 0, shopping: 0, misc: 0 };

  const now = new Date();

  trips.forEach((t) => {
    // 1. Budget total
    const tripTotal = t.budgetItems.reduce((sum, item) => {
      const cat = (item.category || "misc").toLowerCase();
      if (categoriesSum[cat] !== undefined) {
        categoriesSum[cat] += item.amount;
      } else {
        categoriesSum.misc += item.amount;
      }
      return sum + item.amount;
    }, 0);
    totalBudget += tripTotal;

    // 2. Countries Visited
    if (t.country) uniqueCountries.add(t.country);

    // 3. Upcoming Trips
    if (new Date(t.startDate) > now) upcomingTrips++;

    // 4. Trip Duration
    const diffTime = Math.abs(new Date(t.endDate) - new Date(t.startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    totalDurationDays += diffDays;

    // 5. Favorite Destination Count
    if (t.destination) {
      destinationsCount[t.destination] = (destinationsCount[t.destination] || 0) + 1;
    }
  });

  // Calculate favorite destination
  let favoriteDest = "None";
  let maxCount = 0;
  Object.entries(destinationsCount).forEach(([dest, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteDest = dest;
    }
  });

  const avgDuration = totalTrips > 0 ? Math.round(totalDurationDays / totalTrips) : 0;

  res.status(200).json({
    success: true,
    data: {
      totalTrips,
      countriesVisited: uniqueCountries.size,
      upcomingTrips,
      totalBudgetSpent: totalBudget,
      avgDuration,
      favoriteDestination: favoriteDest,
      budgetDistribution: categoriesSum
    }
  });
});

// 12. Smart Recommendations
export const getSmartRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const pastTrips = await Trip.find({ user: userId }).limit(5);

  const pastDestinations = pastTrips.map((t) => `${t.destination} (${t.country || ""})`);

  const prompt = `
    Based on the traveler's past trips: ${JSON.stringify(pastDestinations)}.
    Recommend 3 matching destinations.
    Respond ONLY with a JSON array of objects in this format:
    [
      { "city": "Phuket", "country": "Thailand", "reason": "Since you enjoyed beaches in Bali, you will love the sunset shores here." },
      ...
    ]
  `;

  let recommendations = await queryGemini(prompt);

  if (!recommendations) {
    // Intelligent fallback
    recommendations = [
      { city: "Phuket", country: "Thailand", reason: "Since you planned trips to Kyoto, you will love the cultural temple beaches here." },
      { city: "Zermatt", country: "Switzerland", reason: "Since you appreciate mountain landscapes, Zermatt offers majestic Alpine climbing routes." },
      { city: "Barcelona", country: "Spain", reason: "If you love deep history combined with beaches, Barcelona is a perfect architecture haven." }
    ];
  }

  res.status(200).json({ success: true, data: recommendations });
});
