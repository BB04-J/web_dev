const Dessert = require("../models/desserts");
const { searchDesserts, getRandomDessert, searchCoffees } = require("../services/dessertServices");

const addDessert = async (req, res) => {
    try {
        const dessert = await Dessert.create({
            ...req.body,
            userId: req.user.id,
        });

        res.status(201).json(dessert);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getDesserts = async (req, res) => {
    try {
        const desserts = await Dessert.find({
            userId: req.user.id,
        });

        res.json(desserts);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateDessert = async (req, res) => {
    try {
        const updatedDessert = await Dessert.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
            },
            req.body,
            { new: true }
        );
        res.json(updatedDessert);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteDessert = async (req, res) => {
    try {
        await Dessert.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        res.json({ message: "Dessert deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const rateDessert = async (req, res) => {
    try {
        const { rating, review } = req.body;

        const dessert = await Dessert.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        dessert.rating = rating;

        dessert.review = review;

        await dessert.save();

        res.json(dessert);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const getDashboard = async (req, res) => {
    try {
        const desserts = await Dessert.find({
            userId: req.user.id,
        });

        const totalSaved = desserts.length;

        const totalTried = desserts.filter(
            (d) => d.status === "tried"
        ).length;

        const highestRated = desserts.sort(
            (a, b) => b.rating - a.rating
        )[0];

        const recentTried = desserts
            .filter((d) => d.dateTried)
            .sort(
                (a, b) =>
                    new Date(b.dateTried) -
                    new Date(a.dateTried)
            );

        res.json({
            totalSaved,
            totalTried,
            highestRated,
            recentTried,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


const discoverDesserts = async (req, res) => {
    try {
        const query = req.query.search;
        const category = req.query.category;
        const country = req.query.country;

        const desserts = await searchDesserts(query, category, country);

        res.json(desserts);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const discoverRandom = async (req, res) => {
    try {
        const dessert = await getRandomDessert();
        if (dessert) {
            res.json({ meals: [dessert] });
        } else {
            res.status(404).json({ message: "No dessert found" });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const discoverCoffees = async (req, res) => {
    try {
        const query = req.query.search;
        const coffees = await searchCoffees(query);
        res.json(coffees);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addDessert,
    getDesserts,
    updateDessert,
    deleteDessert,
    rateDessert,
    getDashboard,
    discoverDesserts,
    discoverRandom,
    discoverCoffees,
};