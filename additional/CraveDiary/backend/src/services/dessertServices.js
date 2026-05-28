const axios = require("axios");

const MEALDB_API_URL = process.env.THEMEALDB_API_URL || "https://www.themealdb.com/api/json/v1/1";

const staticDesserts = [
    {
        idMeal: "static_tiramisu",
        strMeal: "Classic Italian Tiramisu",
        strMealThumb: "/tiramisu.png",
        strCategory: "Dessert",
        strArea: "Italian",
        strInstructions: "Combine strong espresso and rum in a shallow bowl. Whisk egg yolks and sugar in a large bowl, then beat in mascarpone until creamy. In another bowl, whip heavy cream to stiff peaks. Fold whipped cream gently into the mascarpone mixture. Dip ladyfingers into the coffee mixture quickly (so they do not get too soggy) and place in a single layer in a serving dish. Spread half of the mascarpone mixture over the ladyfingers. Repeat with another layer of dipped ladyfingers and the remaining mascarpone. Dust with cocoa powder. Refrigerate for at least 4 hours before serving.",
        strYoutube: "https://www.youtube.com/watch?v=s53HjUjS640",
        strIngredient1: "Strong Espresso",
        strMeasure1: "1 cup",
        strIngredient2: "Rum",
        strMeasure2: "2 tbsp",
        strIngredient3: "Egg Yolks",
        strMeasure3: "4 large",
        strIngredient4: "Granulated Sugar",
        strMeasure4: "1/2 cup",
        strIngredient5: "Mascarpone Cheese",
        strMeasure5: "1 cup",
        strIngredient6: "Heavy Cream",
        strMeasure6: "1 cup",
        strIngredient7: "Ladyfingers",
        strMeasure7: "24",
        strIngredient8: "Cocoa Powder",
        strMeasure8: "2 tbsp"
    },
    {
        idMeal: "static_lavacake",
        strMeal: "Decadent Molten Chocolate Lava Cake",
        strMealThumb: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
        strCategory: "Dessert",
        strArea: "French",
        strInstructions: "Preheat oven to 425°F (218°C). Grease four 6-ounce ramekins with butter and dust with cocoa powder. Melt chocolate and butter together. Whisk flour, powdered sugar, and a pinch of salt. Whisk whole eggs and egg yolks together, then stir into the chocolate mixture along with the flour mixture. Divide batter among ramekins. Bake for 12-14 minutes until the edges are firm but center is soft. Let cool for 1 minute, invert onto plates, and serve immediately with vanilla ice cream.",
        strYoutube: "https://www.youtube.com/watch?v=R727T_V9eKI",
        strIngredient1: "Semisweet Chocolate",
        strMeasure1: "4 oz",
        strIngredient2: "Butter",
        strMeasure2: "1/2 cup",
        strIngredient3: "All-Purpose Flour",
        strMeasure3: "1/4 cup",
        strIngredient4: "Powdered Sugar",
        strMeasure4: "1/2 cup",
        strIngredient5: "Whole Eggs",
        strMeasure5: "2 large",
        strIngredient6: "Egg Yolks",
        strMeasure6: "2 large",
        strIngredient7: "Vanilla Extract",
        strMeasure7: "1 tsp"
    },
    {
        idMeal: "static_cheesecake",
        strMeal: "Creamy New York Strawberry Cheesecake",
        strMealThumb: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=600",
        strCategory: "Dessert",
        strArea: "American",
        strInstructions: "Mix graham cracker crumbs, melted butter, and sugar; press into a springform pan. Beat cream cheese, sugar, and flour until smooth. Add vanilla and sour cream, then beat in eggs one at a time. Pour into crust. Bake at 325°F (163°C) for 1 hour or until center is set. Cool, then refrigerate for 4 hours. Top with fresh strawberries and sweet strawberry glaze before serving.",
        strYoutube: "https://www.youtube.com/watch?v=ZYoYff9p5WY",
        strIngredient1: "Graham Cracker Crumbs",
        strMeasure1: "1.5 cups",
        strIngredient2: "Melted Butter",
        strMeasure2: "1/3 cup",
        strIngredient3: "Cream Cheese",
        strMeasure3: "24 oz",
        strIngredient4: "Granulated Sugar",
        strMeasure4: "1 cup",
        strIngredient5: "Sour Cream",
        strMeasure5: "1 cup",
        strIngredient6: "Vanilla Extract",
        strMeasure6: "2 tsp",
        strIngredient7: "Eggs",
        strMeasure7: "3 large",
        strIngredient8: "Fresh Strawberries",
        strMeasure8: "1 cup"
    },
    {
        idMeal: "static_macarons",
        strMeal: "Chic French Macarons",
        strMealThumb: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600",
        strCategory: "Dessert",
        strArea: "French",
        strInstructions: "Sift almond flour and powdered sugar together. Whip egg whites to stiff peaks, adding granulated sugar gradually. Fold the dry ingredients into the egg whites using the macaronage technique until batter resembles slow-flowing lava. Pipe rounds onto parchment paper and let sit for 30-45 minutes until a skin forms. Bake at 300°F (150°C) for 15 minutes. Cool completely, then fill with chocolate ganache or buttercream.",
        strYoutube: "https://www.youtube.com/watch?v=xjE-2xG5vG4",
        strIngredient1: "Almond Flour",
        strMeasure1: "1 cup",
        strIngredient2: "Powdered Sugar",
        strMeasure2: "1.25 cups",
        strIngredient3: "Egg Whites",
        strMeasure3: "3 large",
        strIngredient4: "Granulated Sugar",
        strMeasure4: "1/4 cup",
        strIngredient5: "Chocolate Ganache",
        strMeasure5: "1/2 cup"
    },
    {
        idMeal: "static_applepie",
        strMeal: "Warm Apple Cinnamon Pie",
        strMealThumb: "https://images.unsplash.com/photo-1507226983735-a838615193b0?w=600",
        strCategory: "Dessert",
        strArea: "British",
        strInstructions: "Preheat oven to 425°F. Toss sliced apples with lemon juice, sugar, flour, cinnamon, nutmeg, and ginger. Roll out half of pie dough into a pie plate. Fill with apple mixture and dot with butter. Roll out remaining dough, cut into strips to form a lattice pattern over the top. Seal edges, brush with egg wash, and sprinkle with coarse sugar. Bake for 45-50 minutes until crust is golden and filling is bubbly.",
        strYoutube: "https://www.youtube.com/watch?v=KbyahiE80Sc",
        strIngredient1: "Sliced Apples",
        strMeasure1: "6 cups",
        strIngredient2: "Pie Crust Dough",
        strMeasure2: "2 rolls",
        strIngredient3: "Granulated Sugar",
        strMeasure3: "1/2 cup",
        strIngredient4: "Brown Sugar",
        strMeasure4: "1/2 cup",
        strIngredient5: "Ground Cinnamon",
        strMeasure5: "1 tsp",
        strIngredient6: "Nutmeg",
        strMeasure6: "1/4 tsp",
        strIngredient7: "Butter",
        strMeasure7: "2 tbsp",
        strIngredient8: "Egg Wash",
        strMeasure8: "1 egg"
    }
];


/**
 * Fuzzy matching helper to retrieve a corresponding MealDB recipe by title.
 * This guarantees ingredients list and YouTube link are sourced from TheMealDB
 * even when the primary discovery (image/instructions) comes from Spoonacular.
 */
const findMealDbMatch = async (title) => {
    if (!title) return null;

    // 1. Try exact search on MealDB
    try {
        const exactUrl = `${MEALDB_API_URL}/search.php?s=${encodeURIComponent(title)}`;
        const res = await axios.get(exactUrl);
        if (res.data && res.data.meals && res.data.meals.length > 0) {
            return res.data.meals[0];
        }
    } catch (err) {
        console.warn(`MealDB exact lookup failed for: ${title}`);
    }

    // 2. Clean the title: remove common fillers and special characters
    const cleanTitle = title
        .replace(/recipe|easy|homemade|quick|simple|best|fresh|classic|style|cupcakes|cupcake/gi, "")
        .replace(/[^a-zA-Z\s]/g, "")
        .trim();

    if (cleanTitle && cleanTitle !== title) {
        try {
            const cleanUrl = `${MEALDB_API_URL}/search.php?s=${encodeURIComponent(cleanTitle)}`;
            const res = await axios.get(cleanUrl);
            if (res.data && res.data.meals && res.data.meals.length > 0) {
                return res.data.meals[0];
            }
        } catch (err) {
            console.warn(`MealDB clean title lookup failed for: ${cleanTitle}`);
        }
    }

    // 3. Try searching word by word for keywords (filtering out common words)
    const words = title
        .split(/\s+/)
        .map(w => w.replace(/[^a-zA-Z]/g, ""))
        .filter(w => w.length > 3 && !/recipe|easy|homemade|quick|simple|best|fresh|classic|style|with|and|the/i.test(w));

    for (const word of words) {
        try {
            const wordUrl = `${MEALDB_API_URL}/search.php?s=${encodeURIComponent(word)}`;
            const res = await axios.get(wordUrl);
            if (res.data && res.data.meals && res.data.meals.length > 0) {
                // Prioritize Dessert category matches if available
                const dessertMatch = res.data.meals.find((m) => m.strCategory === "Dessert");
                if (dessertMatch) return dessertMatch;
                return res.data.meals[0];
            }
        } catch (err) {
            console.warn(`MealDB word lookup failed for: ${word}`);
        }
    }

    // 4. Default fallback: search for "Tiramisu" as a default dessert so we get genuine dessert ingredients & youtube video if all else fails
    try {
        const defaultUrl = `${MEALDB_API_URL}/search.php?s=tiramisu`;
        const res = await axios.get(defaultUrl);
        if (res.data && res.data.meals && res.data.meals.length > 0) {
            return res.data.meals[0];
        }
    } catch (err) {
        console.warn(`MealDB default lookup failed`);
    }

    return null;
};

const searchDesserts = async (query, category, country) => {
    const savoryPattern = /chicken|beef|pork|steak|curry|salmon|shrimp|seafood|fish|tuna|pasta|spaghetti|lasagna|pizza|burger|taco|soup|chili|stew|meatball|lamb|ribs|turkey|bacon|sausage|pepperoni|noodle|ramen|casserole|gravy|stir\s*fry/i;

    const cleanQuery = (query || "").trim().toLowerCase();

    // 1. Find local matches in our premium static desserts list
    let localMatches = [];
    if (cleanQuery || category || country) {
        localMatches = staticDesserts.filter(d => {
            if (cleanQuery) {
                const nameMatch = d.strMeal.toLowerCase().includes(cleanQuery);
                const catMatch = d.strCategory && d.strCategory.toLowerCase().includes(cleanQuery);
                const countryMatch = d.strArea && d.strArea.toLowerCase().includes(cleanQuery);
                if (!nameMatch && !catMatch && !countryMatch) return false;
            }
            if (category && d.strCategory && d.strCategory.toLowerCase() !== category.toLowerCase()) {
                return false;
            }
            if (country && d.strArea && d.strArea.toLowerCase() !== country.toLowerCase()) {
                return false;
            }
            return true;
        });
    } else {
        // If no filter/query, include all static desserts as candidates
        localMatches = [...staticDesserts];
    }

    // 2. Try fetching from Spoonacular API first
    try {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        if (apiKey) {
            let searchQuery = query || "";
            if (category) {
                searchQuery = searchQuery ? `${searchQuery} ${category}` : category;
            }
            if (!searchQuery) {
                searchQuery = "dessert";
            }

            let url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(searchQuery)}&type=dessert&addRecipeInformation=true&number=12&apiKey=${apiKey}`;
            if (country) {
                url += `&cuisine=${encodeURIComponent(country)}`;
            }

            const response = await axios.get(url);

            if (response.data && response.data.results && response.data.results.length > 0) {
                // Filter Spoonacular results to make sure they are sweet desserts (sanity check)
                const dessertResults = response.data.results.filter(recipe => {
                    const title = recipe.title || "";
                    return !savoryPattern.test(title);
                });

                if (dessertResults.length > 0) {
                    // Blend with MealDB search results to get ingredients and YouTube links
                    const blended = await Promise.all(
                        dessertResults.map(async (recipe) => {
                            const mealDbMatch = await findMealDbMatch(recipe.title);

                            const ingredients = [];
                            let youtubeLink = "https://www.youtube.com/results?search_query=" + encodeURIComponent(recipe.title);

                            if (mealDbMatch) {
                                if (mealDbMatch.strYoutube) {
                                    youtubeLink = mealDbMatch.strYoutube;
                                }
                                for (let i = 1; i <= 20; i++) {
                                    const ing = mealDbMatch[`strIngredient${i}`];
                                    const meas = mealDbMatch[`strMeasure${i}`];
                                    if (ing && ing.trim()) {
                                        ingredients.push(meas && meas.trim() ? `${meas.trim()} ${ing.trim()}` : ing.trim());
                                    }
                                }
                            } else {
                                if (recipe.extendedIngredients) {
                                    recipe.extendedIngredients.forEach((ing) => {
                                        ingredients.push(ing.original || ing.name);
                                    });
                                }
                            }

                            const mealDbFormat = {
                                idMeal: String(recipe.id),
                                strMeal: recipe.title,
                                strMealThumb: recipe.image,
                                strCategory: "Dessert",
                                strArea: recipe.cuisines && recipe.cuisines.length > 0 ? recipe.cuisines[0] : (country || "Sweet Cravings"),
                                strInstructions: recipe.instructions 
                                    ? recipe.instructions.replace(/<[^>]*>/g, '') 
                                    : (recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : "Enjoy this delicious recipe!"),
                                strYoutube: youtubeLink,
                            };

                            ingredients.forEach((ing, idx) => {
                                if (idx < 20) {
                                    mealDbFormat[`strIngredient${idx + 1}`] = ing;
                                }
                            });

                            return mealDbFormat;
                        })
                    );

                    // Combine local matches and blended results, avoiding duplicates
                    const combined = [...localMatches];
                    blended.forEach(meal => {
                        if (!combined.some(m => m.idMeal === meal.idMeal || m.strMeal.toLowerCase() === meal.strMeal.toLowerCase())) {
                            combined.push(meal);
                        }
                    });
                    return combined;
                }
            }
        }
    } catch (error) {
        console.warn("Spoonacular search API failed or quota exceeded. Falling back directly to MealDB... Error:", error.message);
    }

    // 3. Direct Fallback to MealDB API if Spoonacular fails or returns empty
    try {
        let fallbackMeals = [];

        if (cleanQuery) {
            const searchUrl = `${MEALDB_API_URL}/search.php?s=${encodeURIComponent(cleanQuery)}`;
            const res = await axios.get(searchUrl);
            if (res.data && res.data.meals) {
                fallbackMeals = res.data.meals;
            }
        } else if (country) {
            const areaUrl = `${MEALDB_API_URL}/filter.php?a=${encodeURIComponent(country)}`;
            const res = await axios.get(areaUrl);
            if (res.data && res.data.meals) {
                fallbackMeals = res.data.meals;
            }
        } else {
            const dessertUrl = `${MEALDB_API_URL}/filter.php?c=Dessert`;
            const res = await axios.get(dessertUrl);
            if (res.data && res.data.meals) {
                fallbackMeals = res.data.meals;
            }
        }

        let resolvedMeals = [];
        if (fallbackMeals && fallbackMeals.length > 0) {
            const candidates = fallbackMeals.slice(0, 12);
            resolvedMeals = await Promise.all(
                candidates.map(async (cand) => {
                    if (cand.strInstructions && cand.strCategory) {
                        return cand;
                    }
                    try {
                        const lookupUrl = `${MEALDB_API_URL}/lookup.php?i=${cand.idMeal}`;
                        const res = await axios.get(lookupUrl);
                        if (res.data && res.data.meals && res.data.meals[0]) {
                            return res.data.meals[0];
                        }
                    } catch (err) {
                        console.warn(`MealDB lookup failed for id: ${cand.idMeal}`);
                    }
                    return null;
                })
            );
        }

        const dessertMeals = resolvedMeals
            .filter(m => m !== null)
            .filter(m => {
                if (m.strCategory && m.strCategory.toLowerCase() !== "dessert") {
                    return false;
                }
                if (savoryPattern.test(m.strMeal || "")) {
                    return false;
                }
                if (country && m.strArea && m.strArea.toLowerCase() !== country.toLowerCase()) {
                    return false;
                }
                return true;
            });

        const combined = [...localMatches];
        dessertMeals.forEach(meal => {
            if (!combined.some(m => m.idMeal === meal.idMeal || m.strMeal.toLowerCase() === meal.strMeal.toLowerCase())) {
                combined.push(meal);
            }
        });

        if (combined.length === 0 && cleanQuery && "tiramisu".includes(cleanQuery)) {
            const tiramisu = staticDesserts.find(d => d.idMeal === "static_tiramisu");
            if (tiramisu) combined.push(tiramisu);
        }

        return combined;
    } catch (mealDbError) {
        console.error("MealDB direct search failed:", mealDbError.message);
        return localMatches;
    }
};

const getRandomDessert = async () => {
    const savoryPattern = /chicken|beef|pork|steak|curry|salmon|shrimp|seafood|fish|tuna|pasta|spaghetti|lasagna|pizza|burger|taco|soup|chili|stew|meatball|lamb|ribs|turkey|bacon|sausage|pepperoni|noodle|ramen|casserole|gravy|stir\s*fry/i;

    // 1. Try fetching from Spoonacular API first
    try {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        if (apiKey) {
            const url = `https://api.spoonacular.com/recipes/random?number=1&tags=dessert&apiKey=${apiKey}`;

            const response = await axios.get(url);

            if (response.data && response.data.recipes && response.data.recipes.length > 0) {
                const recipe = response.data.recipes[0];

                // Verify Spoonacular recipe is not savory
                if (!savoryPattern.test(recipe.title || "")) {
                    const mealDbMatch = await findMealDbMatch(recipe.title);

                    const ingredients = [];
                    let youtubeLink = "https://www.youtube.com/results?search_query=" + encodeURIComponent(recipe.title);

                    if (mealDbMatch) {
                        if (mealDbMatch.strYoutube) {
                            youtubeLink = mealDbMatch.strYoutube;
                        }
                        for (let i = 1; i <= 20; i++) {
                            const ing = mealDbMatch[`strIngredient${i}`];
                            const meas = mealDbMatch[`strMeasure${i}`];
                            if (ing && ing.trim()) {
                                ingredients.push(meas && meas.trim() ? `${meas.trim()} ${ing.trim()}` : ing.trim());
                            }
                        }
                    } else {
                        if (recipe.extendedIngredients) {
                            recipe.extendedIngredients.forEach((ing) => {
                                  ingredients.push(ing.original || ing.name);
                            });
                        }
                    }

                    const mealDbFormat = {
                        idMeal: String(recipe.id),
                        strMeal: recipe.title,
                        strMealThumb: recipe.image,
                        strCategory: "Dessert",
                        strArea: recipe.cuisines && recipe.cuisines.length > 0 ? recipe.cuisines[0] : "Sweet Cravings",
                        strInstructions: recipe.instructions 
                            ? recipe.instructions.replace(/<[^>]*>/g, '') 
                            : (recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : "Enjoy this delicious recipe!"),
                        strYoutube: youtubeLink,
                    };

                    ingredients.forEach((ing, idx) => {
                        if (idx < 20) {
                            mealDbFormat[`strIngredient${idx + 1}`] = ing;
                        }
                    });

                    return mealDbFormat;
                }
            }
        }
    } catch (error) {
        console.warn("Spoonacular random API failed or quota exceeded. Falling back directly to MealDB... Error:", error.message);
    }

    // 2. Direct Fallback to MealDB API if Spoonacular fails or is savory
    try {
        // 30% chance to serve a premium static dessert immediately for maximum aesthetic impact!
        if (Math.random() < 0.3 && staticDesserts.length > 0) {
            const randomIndex = Math.floor(Math.random() * staticDesserts.length);
            return staticDesserts[randomIndex];
        }

        // Fetch all dessert candidates from MealDB
        const listUrl = `${MEALDB_API_URL}/filter.php?c=Dessert`;
        const listRes = await axios.get(listUrl);
        if (listRes.data && listRes.data.meals && listRes.data.meals.length > 0) {
            const meals = listRes.data.meals;
            
            // Try up to 3 times to pick a random dessert from the list and look it up
            for (let attempt = 0; attempt < 3; attempt++) {
                const randomMeal = meals[Math.floor(Math.random() * meals.length)];
                
                try {
                    const lookupUrl = `${MEALDB_API_URL}/lookup.php?i=${randomMeal.idMeal}`;
                    const lookupRes = await axios.get(lookupUrl);
                    if (lookupRes.data && lookupRes.data.meals && lookupRes.data.meals[0]) {
                        const meal = lookupRes.data.meals[0];
                        // Double check it's not a savory match
                        if (!savoryPattern.test(meal.strMeal || "")) {
                            return meal;
                        }
                    }
                } catch (lookupErr) {
                    console.warn(`MealDB random lookup failed for id ${randomMeal.idMeal}:`, lookupErr.message);
                }
            }
        }

        // If the above fails, fall back to our premium static desserts list
        if (staticDesserts.length > 0) {
            const randomIndex = Math.floor(Math.random() * staticDesserts.length);
            return staticDesserts[randomIndex];
        }
        return null;
    } catch (mealDbError) {
        console.error("MealDB random fallback failed:", mealDbError.message);
        if (staticDesserts.length > 0) {
            const randomIndex = Math.floor(Math.random() * staticDesserts.length);
            return staticDesserts[randomIndex];
        }
        return null;
    }
};

const searchCoffees = async (query) => {
    try {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        if (apiKey) {
            const searchQuery = query ? `${query} coffee` : "coffee drink";
            const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(searchQuery)}&type=drink&addRecipeInformation=true&number=12&apiKey=${apiKey}`;

            const response = await axios.get(url);

            if (response.data && response.data.results && response.data.results.length > 0) {
                return response.data.results.map((recipe) => {
                    // Extract ingredients list
                    const ingredients = recipe.extendedIngredients 
                        ? recipe.extendedIngredients.map(ing => ing.original || ing.name)
                        : ["Espresso", "Steamed Milk"];

                    const coffeeFormat = {
                        idMeal: String(recipe.id),
                        strMeal: recipe.title,
                        strMealThumb: recipe.image || "/caramel_latte.png",
                        strCategory: "Coffee",
                        strArea: "Specialty Café",
                        strInstructions: recipe.instructions 
                            ? recipe.instructions.replace(/<[^>]*>/g, '') 
                            : (recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : "Brew fresh espresso, steam milk, and serve warm!"),
                        strYoutube: "https://www.youtube.com/results?search_query=" + encodeURIComponent(recipe.title),
                    };

                    ingredients.forEach((ing, idx) => {
                        if (idx < 20) {
                            coffeeFormat[`strIngredient${idx + 1}`] = ing;
                        }
                    });

                    return coffeeFormat;
                });
            }
        }
    } catch (err) {
        console.warn("Spoonacular coffee search failed:", err.message);
    }

    // Direct fallback static coffees if API fails or quota is exceeded
    const staticCoffees = [
        {
            idMeal: "c1",
            strMeal: "Caramel Latte Macchiato",
            strMealThumb: "/caramel_latte.png",
            strCategory: "Coffee",
            strArea: "Specialty Café",
            strInstructions: "Velvety steamed milk with rich espresso shot, topped with sweet caramel grid drizzle.",
            strYoutube: "https://www.youtube.com/results?search_query=Caramel+Latte+Macchiato",
            strIngredient1: "Steamed Milk",
            strIngredient2: "Espresso",
            strIngredient3: "Caramel Sauce"
        },
        {
            idMeal: "c2",
            strMeal: "Cozy Dark Mocha",
            strMealThumb: "/dark_mocha.png",
            strCategory: "Coffee",
            strArea: "Specialty Café",
            strInstructions: "Warm, chocolatey fusion of robust espresso, dark cocoa sauce, and velvety foam.",
            strYoutube: "https://www.youtube.com/results?search_query=Cozy+Dark+Mocha",
            strIngredient1: "Espresso",
            strIngredient2: "Cocoa Powder",
            strIngredient3: "Steamed Milk"
        },
        {
            idMeal: "c3",
            strMeal: "Vanilla Sweet Cream Cold Brew",
            strMealThumb: "/cold_brew.png",
            strCategory: "Coffee",
            strArea: "Specialty Café",
            strInstructions: "Slow-steeped cold brew dessert-coffee sweetened with vanilla syrup and topped with milk foam.",
            strYoutube: "https://www.youtube.com/results?search_query=Vanilla+Sweet+Cream+Cold+Brew",
            strIngredient1: "Cold Brew Coffee",
            strIngredient2: "Vanilla Syrup",
            strIngredient3: "Cream"
        },
        {
            idMeal: "c4",
            strMeal: "Gelato Espresso Affogato",
            strMealThumb: "/affogato.png",
            strCategory: "Coffee",
            strArea: "Specialty Café",
            strInstructions: "A scoop of premium vanilla bean gelato 'drowned' in a hot, double shot of espresso.",
            strYoutube: "https://www.youtube.com/results?search_query=Gelato+Espresso+Affogato",
            strIngredient1: "Vanilla Gelato",
            strIngredient2: "Fresh Hot Espresso Shot"
        }
    ];

    if (query) {
        return staticCoffees.filter(c => c.strMeal.toLowerCase().includes(query.toLowerCase()));
    }
    return staticCoffees;
};

module.exports = {
    searchDesserts,
    getRandomDessert,
    searchCoffees,
};