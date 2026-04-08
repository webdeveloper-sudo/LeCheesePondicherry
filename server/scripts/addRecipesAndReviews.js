const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80";

// Reviewer names without caste surnames
const REVIEWERS = [
  "Rohan",
  "Anjali",
  "Meera",
  "Karan",
  "Aarti",
  "Vikram",
  "Neha",
  "Siddharth",
  "Priya",
  "Rahul",
  "Sneha",
  "Aditya",
  "Pooja",
  "Ananya",
  "Kabir",
  "Nikhil",
  "Riya",
  "Dev",
  "Samaira",
  "Kavya",
  "Arjun",
  "Tanya",
  "Ishaan",
  "Simran",
  "Ayesha",
  "Dhruv",
  "Zoya",
  "Rishabh",
  "Tara",
  "Yash",
];

const LOCATIONS = [
  "Pondicherry",
  "Auroville",
  "Chennai",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Pune",
  "Hyderabad",
  "Kochi",
  "Goa",
];

const RESTAURANTS = [
  "Le Café Terrace",
  "Bistro Sea Breeze",
  "The Artisan Oven",
  "Heritage Dine",
  "Café Promenade",
  "Rustic Crust",
  "The French Quarter",
  "Local Bites",
  "Gourmet Pantry",
  "Urban Plate",
];

function getRandomReviewer() {
  return REVIEWERS[Math.floor(Math.random() * REVIEWERS.length)];
}

function getRandomLocation() {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

function getRandomRestaurant() {
  // 30% chance to be a restaurant owner/chef
  if (Math.random() > 0.7) {
    return RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
  }
  return "";
}

// Generates 3-5 reviews per product
function generateReviews(productName, qualityPhrase, tastePhrase) {
  const numReviews = Math.floor(Math.random() * 3) + 3; // 3 to 5
  const reviews = [];

  const commentTemplates = [
    `Absolutely loved this ${productName}. ${qualityPhrase}. Will definitely buy again.`,
    `This is easily the best ${productName} I've tried. ${tastePhrase} and the texture is perfect.`,
    `A beautiful artisanal product. We used it for a weekend dinner and everyone was asking where I got it.`,
    `${qualityPhrase}. It pairs so well with our regular meals. Highly recommended!`,
    `As a chef, I'm very particular about my ingredients. The ${productName} from Le Cheese Pondicherry exceeds expectations. ${tastePhrase}.`,
    `So fresh and pure! You can really taste the zero-preservative difference.`,
    `Perfect for my family. The quality is unmatched and the taste is incredibly rich.`,
  ];

  for (let i = 0; i < numReviews; i++) {
    const isFiveStar = Math.random() > 0.2; // 80% 5-star, 20% 4-star
    const restName = getRandomRestaurant();

    reviews.push({
      rating: isFiveStar ? 5 : 4,
      comment:
        commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
      username: restName ? `Chef ${getRandomReviewer()}` : getRandomReviewer(),
      restaurantName: restName,
      userArea: getRandomLocation(),
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
      ), // Random date in last 90 days
    });
  }
  return reviews;
}

const productUpdates = {
  "baby-swiss": {
    recipes: [
      {
        dishName: "Classic Swiss Fondue",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A gentle, melting fondue perfect for dipping artisan bread.",
        originCountry: "Switzerland / Pondicherry",
        ingredients: [
          "200g Baby Swiss (grated)",
          "1 clove garlic",
          "100ml white wine",
          "1 tbsp cornstarch",
          "Nutmeg",
        ],
        steps: [
          "Rub a heavy pot with garlic.",
          "Heat wine gently.",
          "Gradually whisk in grated Baby Swiss mixed with cornstarch.",
          "Stir until smooth and bubbling.",
          "Serve with bread cubes.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The mild, sweet notes of Baby Swiss melt beautifully without becoming overly sharp, creating a smooth and crowd-pleasing fondue.",
      },
      {
        dishName: "Mushroom & Baby Swiss Quiche",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A savory breakfast or brunch tart with earthy mushrooms.",
        originCountry: "France",
        ingredients: [
          "150g Baby Swiss",
          "Butter crust",
          "1 cup sautéed button mushrooms",
          "3 eggs",
          "1/2 cup cream",
        ],
        steps: [
          "Prebake the crust.",
          "Whisk eggs and cream.",
          "Fold in mushrooms and grated Baby Swiss.",
          "Pour into crust.",
          "Bake at 180°C for 35 mins.",
        ],
        prepTime: "45 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The gentle nuttiness of Baby Swiss complements earthy mushrooms without overpowering the delicate egg custard.",
      },
      {
        dishName: "Artisan Ham & Swiss Croissant",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A premium café-style sandwich.",
        originCountry: "France",
        ingredients: [
          "Sliced Baby Swiss",
          "Fresh croissants",
          "Smoked ham",
          "Dijon mustard",
        ],
        steps: [
          "Slice croissants in half.",
          "Spread a thin layer of mustard.",
          "Layer ham and Baby Swiss.",
          "Toast lightly until cheese begins to melt.",
          "Serve warm.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "Its excellent melting properties and soft texture make it the ideal pairing for buttery pastry and savory ham.",
      },
    ],
    qualityPhrase: "The melting quality is superb",
    tastePhrase: "It has a lovely sweet nuttiness",
  },
  "daddy-swiss": {
    recipes: [
      {
        dishName: "French Onion Soup",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "Rich caramelized onion soup topped with melted Daddy Swiss.",
        originCountry: "France",
        ingredients: [
          "150g Daddy Swiss",
          "4 large onions",
          "Beef broth",
          "Baguette slices",
          "Thyme",
        ],
        steps: [
          "Caramelize onions slowly for 40 mins.",
          "Add broth and simmer.",
          "Ladle into ramekins.",
          "Top with toasted baguette and thick slices of Daddy Swiss.",
          "Broil until bubbly and golden.",
        ],
        prepTime: "60 mins",
        difficultyLevel: "Hard",
        whyItPairsWell:
          "Daddy Swiss has a mature, robust flavor and dense texture that holds up to intense heat, creating a perfect golden crust.",
      },
      {
        dishName: "Gourmet Patty Melt",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A classic diner sandwich elevated with artisanal cheese.",
        originCountry: "USA",
        ingredients: [
          "Daddy Swiss slices",
          "Beef patty",
          "Rye bread",
          "Caramelized onions",
        ],
        steps: [
          "Grill the beef patty.",
          "Place patty and onions between rye bread.",
          "Top generously with Daddy Swiss.",
          "Grill the whole sandwich in butter until cheese melts.",
          "Slice and serve.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The deeply savory, mature profile of Daddy Swiss cuts through the richness of the beef.",
      },
      {
        dishName: "Swiss & Potato Gratin",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "Thinly sliced potatoes baked in cream and aged cheese.",
        originCountry: "France",
        ingredients: [
          "200g Daddy Swiss (grated)",
          "1kg potatoes",
          "Heavy cream",
          "Garlic",
          "Thyme",
        ],
        steps: [
          "Slice potatoes thinly.",
          "Layer in a baking dish.",
          "Pour over garlic-infused cream.",
          "Top with a heavy layer of Daddy Swiss.",
          "Bake until golden and tender.",
        ],
        prepTime: "55 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The sharpness of the aged cheese balances the heavy cream and starch of the potatoes.",
      },
    ],
    qualityPhrase: "The mature, robust flavor is exceptional",
    tastePhrase: "It melts into a beautiful golden crust",
  },
  pondyorange: {
    recipes: [
      {
        dishName: "Pondy Orange Mac & Cheese",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A vibrant, creamy baked pasta dish.",
        originCountry: "India / Fusion",
        ingredients: [
          "200g Pondy Orange",
          "Macaroni",
          "Roux (butter & flour)",
          "Milk",
          "Breadcrumbs",
        ],
        steps: [
          "Boil pasta.",
          "Make a roux and slowly whisk in milk.",
          "Stir in grated Pondy Orange until smooth.",
          "Mix with pasta.",
          "Top with breadcrumbs and bake.",
        ],
        prepTime: "30 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Pondy Orange provides a vivid color and a sharp, mature cheddar-like tang that makes a dynamic cheese sauce.",
      },
      {
        dishName: "Artisan Ploughman's Platter",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A cold lunch platter featuring Pondy Orange.",
        originCountry: "UK",
        ingredients: [
          "Blocks of Pondy Orange",
          "Crusty bread",
          "Apple slices",
          "Pickle/Chutney",
        ],
        steps: [
          "Slice Pondy Orange into thick blocks.",
          "Arrange on a board with fresh apple slices.",
          "Add a generous spoonful of tangy fruit chutney.",
          "Serve with crusty rustic bread.",
        ],
        prepTime: "5 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "Its semi-hard texture and bold savory flavor pair perfectly with crisp, sweet apples and acidic pickles.",
      },
      {
        dishName: "Pondy Orange & Chili Toast",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A spicy, upgraded version of classic cheese on toast.",
        originCountry: "India",
        ingredients: [
          "Grated Pondy Orange",
          "Sourdough bread",
          "Green chilies",
          "Cilantro",
        ],
        steps: [
          "Mix grated cheese with chopped chilies and cilantro.",
          "Pile onto thick sourdough slices.",
          "Grill until bubbling and slightly browned.",
          "Serve hot.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The rich, savory profile of the cheese balances the heat of the green chilies perfectly.",
      },
    ],
    qualityPhrase: "The tangy, mature flavor shines through beautifully",
    tastePhrase: "It has a stunning vibrant color and rich taste",
  },
  "grana-chery": {
    recipes: [
      {
        dishName: "Grana Cherry Risotto",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A creamy, slow-cooked Italian rice dish finished with aged cheese.",
        originCountry: "Italy",
        ingredients: [
          "50g Grana Cherry (finely grated)",
          "Arborio rice",
          "Chicken/Vegetable stock",
          "White wine",
          "Butter",
        ],
        steps: [
          "Toast rice and deglaze with wine.",
          "Add hot stock ladle by ladle, stirring constantly.",
          "Once al dente, remove from heat.",
          "Vigorously stir in butter and Grana Cherry.",
          "Serve immediately.",
        ],
        prepTime: "40 mins",
        difficultyLevel: "Hard",
        whyItPairsWell:
          "The dense umami and granular texture of Grana Cherry melts perfectly into the risotto, creating a rich, savory emulsion.",
      },
      {
        dishName: "Arugula & Grana Cherry Salad",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A fresh, peppery salad with shaved aged cheese.",
        originCountry: "Italy",
        ingredients: [
          "Grana Cherry shavings",
          "Fresh arugula",
          "Lemon juice",
          "Extra virgin olive oil",
          "Black pepper",
        ],
        steps: [
          "Toss arugula lightly in olive oil and lemon juice.",
          "Use a vegetable peeler to shave thin strips of Grana Cherry over the top.",
          "Finish with cracked black pepper.",
        ],
        prepTime: "5 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The intense, salty nuttiness of the cheese contrasts beautifully with the fresh, peppery bite of raw arugula.",
      },
      {
        dishName: "Grana Cherry Crisps",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "Lacy, crunchy baked cheese crisps (Frico).",
        originCountry: "Italy",
        ingredients: ["100g Grana Cherry (grated)", "Black pepper (optional)"],
        steps: [
          "Preheat oven to 180°C.",
          "Place small mounds of grated cheese on a parchment-lined baking sheet.",
          "Gently flatten the mounds.",
          "Bake for 5-7 minutes until golden.",
          "Let cool and harden.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Being a hard, low-moisture cheese, it crisps up beautifully in the oven without becoming a greasy puddle.",
      },
    ],
    qualityPhrase:
      "The granular texture and sharp parmesan-style bite is incredible",
    tastePhrase: "It delivers a deep, satisfying umami punch",
  },
  burrata: {
    recipes: [
      {
        dishName: "Classic Caprese with Burrata",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A rich take on the classic tomato and basil salad.",
        originCountry: "Italy",
        ingredients: [
          "1 whole Burrata",
          "Heirloom tomatoes",
          "Fresh basil",
          "Balsamic glaze",
          "Olive oil",
        ],
        steps: [
          "Slice tomatoes and arrange on a plate.",
          "Place the whole burrata in the center.",
          "Scatter fresh basil leaves.",
          "Drizzle generously with olive oil and a touch of balsamic glaze.",
          "Season with sea salt.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The creamy, spilling center of the burrata acts as a luscious dressing for the acidic, juicy tomatoes.",
      },
      {
        dishName: "Burrata & Prosciutto Crostini",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "An elegant appetizer with savory meat and creamy cheese.",
        originCountry: "Italy",
        ingredients: ["Burrata", "Prosciutto slices", "Baguette", "Honey"],
        steps: [
          "Toast baguette slices.",
          "Spread a thick layer of burrata cream on each slice.",
          "Drape a slice of prosciutto over the top.",
          "Drizzle lightly with honey.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The delicate, milky sweetness of burrata perfectly balances the intense, salty cured meat.",
      },
      {
        dishName: "Roasted Peach & Burrata Salad",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A sweet and savory summer salad.",
        originCountry: "Italy",
        ingredients: [
          "1 whole Burrata",
          "2 firm peaches",
          "Honey",
          "Thyme",
          "Mixed greens",
        ],
        steps: [
          "Halve the peaches and roast with a little honey until soft.",
          "Place atop a bed of greens.",
          "Tear open the burrata over the hot peaches.",
          "Garnish with fresh thyme and olive oil.",
        ],
        prepTime: "25 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The hot, caramelized stone fruit melts beautifully into the rich, cold cream of the fresh burrata.",
      },
    ],
    qualityPhrase: "The creamy stracciatella center is incredibly luscious",
    tastePhrase: "It has a delicate, milky sweetness that tastes so fresh",
  },
  mozzarella: {
    recipes: [
      {
        dishName: "Margherita Pizza (Neapolitan Style)",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "The ultimate fresh mozzarella classic.",
        originCountry: "Italy",
        ingredients: [
          "Fresh Mozzarella",
          "Pizza dough",
          "San Marzano tomatoes",
          "Basil",
          "Olive oil",
        ],
        steps: [
          "Stretch pizza dough thinly.",
          "Spread crushed tomatoes over the base.",
          "Tear chunks of fresh mozzarella and scatter.",
          "Bake at very high heat until crust blisters.",
          "Top with basil.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Hard",
        whyItPairsWell:
          "Its high moisture content and delicate flavor prevent the cheese from burning in a hot oven, resulting in tender, milky pools on the pizza.",
      },
      {
        dishName: "Baked Pesto Chicken with Mozzarella",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "Juicy chicken breasts smothered in pesto and melted cheese.",
        originCountry: "Italy / USA",
        ingredients: [
          "Sliced Fresh Mozzarella",
          "Chicken breasts",
          "Basil pesto",
          "Cherry tomatoes",
        ],
        steps: [
          "Sear chicken breasts until golden.",
          "Transfer to a baking dish.",
          "Generously spread pesto over each piece.",
          "Top with slices of fresh mozzarella and tomatoes.",
          "Bake until melted.",
        ],
        prepTime: "30 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The clean, mild profile of the mozzarella balances the intense garlic and basil flavors of the pesto.",
      },
      {
        dishName: "Mozzarella & Watermelon Skewers",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A refreshing summer appetizer.",
        originCountry: "Fusion",
        ingredients: [
          "Fresh Mozzarella cubes",
          "Watermelon cubes",
          "Mint leaves",
          "Balsamic reduction",
        ],
        steps: [
          "Thread a cube of watermelon, a mint leaf, and a cube of mozzarella onto a skewer.",
          "Repeat.",
          "Arrange on a platter and drizzle with balsamic reduction.",
          "Serve chilled.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The soft, milky texture of the cheese complements the crisp, hydrating bite of fresh watermelon.",
      },
    ],
    qualityPhrase: "Its fresh, milky bounce is just perfect",
    tastePhrase: "It melts gently forming beautiful soft pools of flavor",
  },
  bocconcini: {
    recipes: [
      {
        dishName: "Mini Caprese Skewers",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "Bite-sized appetizers perfect for parties.",
        originCountry: "Italy",
        ingredients: [
          "Bocconcini balls",
          "Cherry tomatoes",
          "Fresh basil",
          "Pesto",
        ],
        steps: [
          "Thread a cherry tomato, a folded basil leaf, and a bocconcini onto a toothpick.",
          "Arrange on a serving board.",
          "Drizzle with fresh basil pesto just before serving.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The naturally bite-sized shape of bocconcini makes it perfect for elegant, portion-controlled appetizers.",
      },
      {
        dishName: "Warm Cherry Tomato & Bocconcini Pasta",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A light, summery pasta dish.",
        originCountry: "Italy",
        ingredients: [
          "Bocconcini (halved)",
          "Penne pasta",
          "Cherry tomatoes",
          "Garlic",
          "Olive oil",
        ],
        steps: [
          "Sauté cherry tomatoes and garlic in olive oil until the tomatoes burst.",
          "Toss with hot, freshly cooked pasta.",
          "Stir in halved bocconcini off the heat so they soften but don't fully melt.",
          "Serve warm.",
        ],
        prepTime: "25 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Tossing the small mozzarella balls into hot pasta softens them perfectly without causing them to become stringy.",
      },
      {
        dishName: "Bocconcini Marinated in Herb Oil",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A flavorful antipasto addition.",
        originCountry: "Italy",
        ingredients: [
          "Bocconcini",
          "Extra virgin olive oil",
          "Chili flakes",
          "Rosemary",
          "Garlic",
        ],
        steps: [
          "Gently heat olive oil with sliced garlic, rosemary, and chili flakes.",
          "Allow to cool to room temperature.",
          "Pour over drained bocconcini in a jar.",
          "Let sit for at least 2 hours before serving.",
        ],
        prepTime: "10 mins (plus marinating)",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The mild, milky flavor of bocconcini acts like a sponge, absorbing the aromatic flavors of the infused oil.",
      },
    ],
    qualityPhrase: "The bite-sized shape makes it incredibly versatile",
    tastePhrase: "It has a clean, milky brightness that elevates simple dishes",
  },
  ricotta: {
    recipes: [
      {
        dishName: "Lemon Ricotta Pancakes",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "Fluffy, deeply moist breakfast pancakes.",
        originCountry: "USA / Italy",
        ingredients: [
          "1 cup Fresh Ricotta",
          "Lemon zest",
          "Pancake batter",
          "Eggs",
          "Maple syrup",
        ],
        steps: [
          "Whisk ricotta and lemon zest into your wet pancake ingredients.",
          "Fold in dry ingredients gently (do not overmix).",
          "Cook on a buttered griddle until golden.",
          "Serve with fresh berries and syrup.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Ricotta adds incredible moisture and a creamy, rich texture to baked goods without weighing them down.",
      },
      {
        dishName: "Ricotta & Spinach Stuffed Shells",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A classic baked Italian-American comfort dish.",
        originCountry: "USA / Italy",
        ingredients: [
          "200g Fresh Ricotta",
          "Jumbo pasta shells",
          "Wilted spinach",
          "Parmesan",
          "Marinara sauce",
        ],
        steps: [
          "Boil shells until al dente.",
          "Mix ricotta, chopped wilted spinach, and parmesan.",
          "Stuff each shell with the mixture.",
          "Place in a baking dish covered in marinara sauce.",
          "Bake until bubbly.",
        ],
        prepTime: "45 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The light, grainy texture of fresh ricotta holds its structure well inside pasta during baking.",
      },
      {
        dishName: "Whipped Ricotta Toast with Hot Honey",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A trendy, sweet-and-savory breakfast or snack.",
        originCountry: "Global",
        ingredients: [
          "Fresh Ricotta",
          "Sourdough toast",
          "Chili-infused honey",
          "Sea salt flakes",
        ],
        steps: [
          "Whip ricotta in a food processor until silky smooth.",
          "Spread a thick layer onto toasted sourdough.",
          "Drizzle generously with hot honey.",
          "Sprinkle with flaky sea salt.",
        ],
        prepTime: "5 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "Whipping the ricotta transforms its curdy texture into a spreadable cloud that contrasts beautifully with sharp, spicy honey.",
      },
    ],
    qualityPhrase: "The light, fluffy texture is exceptional",
    tastePhrase:
      "It delivers a subtle, slightly sweet milky profile that works anywhere",
  },
  hallomi: {
    recipes: [
      {
        dishName: "Grilled Halloumi & Watermelon Salad",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A refreshing balance of hot, salty cheese and cold, sweet melon.",
        originCountry: "Cyprus / Global",
        ingredients: [
          "Halloumi slices",
          "Watermelon chunks",
          "Mint",
          "Lime juice",
        ],
        steps: [
          "Slice Halloumi thickly and grill on a dry, hot pan until golden brown crust forms.",
          "Toss watermelon chunks with fresh mint and lime juice.",
          "Serve the hot cheese immediately alongside the cold salad.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "Halloumi's high melting point allows it to achieve a crispy crust while remaining firm, contrasting the juicy melon perfectly.",
      },
      {
        dishName: "Halloumi Veggie Skewers",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "Perfect vegetarian BBQ skewers.",
        originCountry: "Mediterranean",
        ingredients: [
          "Halloumi cubes",
          "Bell peppers",
          "Zucchini",
          "Red onion",
          "Olive oil",
        ],
        steps: [
          "Cut vegetables and Halloumi into uniform cubes.",
          "Thread onto skewers alternately.",
          "Brush with olive oil and oregano.",
          "Grill over open flame or in a grill pan until cheese is browned.",
          "Serve hot.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Because it doesn't melt away, it functions like a meat substitute on the grill, holding its shape beautifully.",
      },
      {
        dishName: "Halloumi Burger with Chili Jam",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A meaty, satisfying vegetarian burger alternative.",
        originCountry: "UK / Mediterranean",
        ingredients: [
          "2 thick Halloumi slices",
          "Brioche bun",
          "Sweet chili jam",
          "Arugula",
        ],
        steps: [
          "Pan-fry Halloumi slices until deep golden brown on both sides.",
          "Toast the brioche bun lightly.",
          "Layer arugula, the hot halloumi, and a generous dollop of chili jam.",
          "Serve immediately.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The dense, squeaky texture of Halloumi provides a substantial bite, backed by a savory saltiness that pairs well with sweet jam.",
      },
    ],
    qualityPhrase: "It holds a perfect golden crust when grilled",
    tastePhrase:
      "The characteristic squeak and robust savory flavor are fantastic",
  },
  feta: {
    recipes: [
      {
        dishName: "Classic Greek Salad",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A crisp, vibrant salad heavily relying on quality feta.",
        originCountry: "Greece",
        ingredients: [
          "Block of Feta",
          "Tomatoes",
          "Cucumbers",
          "Kalamata olives",
          "Red onions",
          "Oregano",
        ],
        steps: [
          "Chop tomatoes, cucumbers, and red onions into large chunks.",
          "Toss with olives and high-quality olive oil.",
          "Top with a large, intact slab of feta.",
          "Sprinkle with oregano and a final drizzle of oil.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The salty, briny notes of the feta cut through the rich olive oil and complement the watery crunch of fresh vegetables.",
      },
      {
        dishName: "Baked Feta Pasta (TikTok Viral Pasta)",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A hands-off, rich oven-baked pasta sauce.",
        originCountry: "Finland / Global",
        ingredients: [
          "1 block Feta",
          "Cherry tomatoes",
          "Olive oil",
          "Garlic",
          "Pasta",
        ],
        steps: [
          "Place feta block in center of a baking dish surrounded by cherry tomatoes.",
          "Douse in olive oil and bake at 200°C for 30 mins until soft.",
          "Mash the hot feta and tomatoes together into a creamy sauce.",
          "Toss with cooked pasta.",
        ],
        prepTime: "40 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "When baked, feta transforms from crumbly to a rich, tangy cream that emulsifies perfectly with roasted tomato juices.",
      },
      {
        dishName: "Watermelon & Feta Salad",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A surprisingly perfect sweet and salty pairing.",
        originCountry: "Mediterranean",
        ingredients: [
          "Crumbled Feta",
          "Watermelon cubes",
          "Fresh mint",
          "Balsamic glaze",
        ],
        steps: [
          "Arrange watermelon cubes on a platter.",
          "Generously crumble feta over the top.",
          "Garnish with torn mint leaves.",
          "Drizzle lightly with thick balsamic glaze just before serving.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The sharp, briny kick of crumbly feta balances the extreme sweetness and high water content of the melon.",
      },
    ],
    qualityPhrase:
      "The crumbly texture and briny punch are authentic and vibrant",
    tastePhrase: "It has a deep, rewarding saltiness that brightens any dish",
  },
  pizzaella: {
    recipes: [
      {
        dishName: "Deep Dish Skillet Pizza",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A thick, indulgent pizza baked in a cast iron pan.",
        originCountry: "USA (Chicago style)",
        ingredients: [
          "Grated Pizzaella",
          "Thick pizza dough",
          "Crushed tomato sauce",
          "Pepperoni",
        ],
        steps: [
          "Press dough into a well-oiled cast iron skillet.",
          "Layer generously with grated Pizzaella first (to protect the crust).",
          "Add toppings and a thick layer of tomato sauce on top.",
          "Bake at 220°C until crust is golden and cheese is molten.",
        ],
        prepTime: "45 mins",
        difficultyLevel: "Hard",
        whyItPairsWell:
          "Pizzaella is designed to handle high, sustained heat without releasing excess moisture, ensuring a thick, glorious cheese pull.",
      },
      {
        dishName: "Gourmet Grilled Cheese",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "The ultimate gooey sandwich with maximum stretch.",
        originCountry: "USA",
        ingredients: [
          "Thick Pizzaella slices",
          "Sourdough bread",
          "Salted butter",
        ],
        steps: [
          "Butter the outside of the sourdough slices.",
          "Layer Pizzaella inside.",
          "Grill slowly over medium-low heat in a pan.",
          "Flip once golden, cooking until the center is entirely molten.",
          "Slice and serve for the perfect stretch.",
        ],
        prepTime: "15 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "It melts smoothly and evenly, providing that quintessential stringy stretch without turning oily.",
      },
      {
        dishName: "Baked Ziti",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A hearty baked pasta buried under a blanket of melted cheese.",
        originCountry: "Italy / USA",
        ingredients: [
          "Grated Pizzaella",
          "Ziti pasta",
          "Ricotta",
          "Marinara sauce",
        ],
        steps: [
          "Mix cooked ziti with marinara and dollops of ricotta.",
          "Pour into a baking dish.",
          "Cover the entire top with a heavy layer of Pizzaella.",
          "Bake until the cheese blanket is bubbling and browned.",
          "Let rest before serving.",
        ],
        prepTime: "45 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Its excellent browning characteristics create a beautiful, appetizing crust over baked casseroles.",
      },
    ],
    qualityPhrase: "The stretch and melt on this is unbelievable",
    tastePhrase: "It melts cleanly without releasing heavy oils",
  },
  paneer: {
    recipes: [
      {
        dishName: "Palak Paneer",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "Soft cheese cubes in a savory, spiced spinach gravy.",
        originCountry: "India",
        ingredients: [
          "Le Pondy Paneer cubes",
          "Spinach puree",
          "Onions & Garlic",
          "Garam masala",
          "Cream",
        ],
        steps: [
          "Lightly pan-fry paneer cubes (optional).",
          "Sauté onions, garlic, and spices.",
          "Add pureed spinach and simmer.",
          "Fold in paneer cubes and let them absorb the flavors.",
          "Finish with a dash of cream.",
        ],
        prepTime: "40 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The paneer remains firm yet tender, soaking up the earthy, spiced spinach gravy without falling apart.",
      },
      {
        dishName: "Paneer Tikka Skewers",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "Marinated and grilled cubes of fresh cottage cheese.",
        originCountry: "India",
        ingredients: [
          "Paneer chunks",
          "Yogurt",
          "Tikka masala spices",
          "Bell peppers",
          "Onions",
        ],
        steps: [
          "Marinate paneer and vegetables in spiced yogurt for 2 hours.",
          "Thread onto skewers.",
          "Grill over charcoal or bake at high heat until edges are charred.",
          "Serve with mint chutney.",
        ],
        prepTime: "30 mins (plus marinating)",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "As a non-melting cheese, paneer holds its shape perfectly under high grilling heat, developing a lovely smoky crust.",
      },
      {
        dishName: "Chili Paneer (Indo-Chinese)",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "Crispy fried cottage cheese tossed in a sweet, spicy, and tangy sauce.",
        originCountry: "India (Fusion)",
        ingredients: [
          "Paneer cubes",
          "Cornstarch",
          "Soy sauce",
          "Green chilies",
          "Capsicum",
        ],
        steps: [
          "Coat paneer in cornstarch and deep fry until crispy.",
          "Stir fry capsicum and chilies in a wok.",
          "Add soy sauce, vinegar, and chili sauce.",
          "Toss the crispy paneer in the sauce until coated.",
          "Serve hot.",
        ],
        prepTime: "30 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The firm texture of the paneer withstands deep frying, maintaining a soft interior while holding a crunchy exterior.",
      },
    ],
    qualityPhrase: "It stays perfectly soft yet firm in gravies",
    tastePhrase:
      "It has a clean, rich milky flavor that highlights spices wonderfully",
  },
  skyr: {
    recipes: [
      {
        dishName: "Berry & Skyr Breakfast Bowl",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A protein-packed, thick morning bowl.",
        originCountry: "Iceland",
        ingredients: [
          "1 cup Skyr",
          "Mixed fresh berries",
          "Honey",
          "Toasted seeds",
        ],
        steps: [
          "Spoon thick Skyr into a bowl.",
          "Top generously with fresh strawberries and blueberries.",
          "Sprinkle toasted pumpkin seeds.",
          "Drizzle with local honey.",
        ],
        prepTime: "5 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The incredibly dense, tart nature of Skyr pairs beautifully with sweet honey and bright, acidic fruits.",
      },
      {
        dishName: "Savory Garlic & Herb Skyr Dip",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A thick, healthy dip for vegetables or flatbreads.",
        originCountry: "Fusion",
        ingredients: [
          "Skyr",
          "Minced garlic",
          "Fresh dill",
          "Lemon juice",
          "Olive oil",
        ],
        steps: [
          "Whisk Skyr with minced garlic, chopped dill, and a squeeze of lemon.",
          "Season with salt and pepper.",
          "Transfer to a serving bowl.",
          "Make a well in the center and fill with olive oil.",
          "Serve with cucumber sticks and pita.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "Skyr's naturally thick, creamy, and mildly sour profile makes it an excellent base for savory, protein-rich dips.",
      },
      {
        dishName: "Skyr Marinated Chicken",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "Tender, juicy chicken marinated in cultured dairy.",
        originCountry: "Fusion",
        ingredients: [
          "1 cup Skyr",
          "Chicken thighs",
          "Cumin & Paprika",
          "Lemon zest",
        ],
        steps: [
          "Mix Skyr with spices and lemon zest.",
          "Coat chicken thighs thoroughly and refrigerate overnight.",
          "Wipe off excess marinade.",
          "Roast or grill until fully cooked and slightly charred.",
        ],
        prepTime: "45 mins (plus marinating)",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The lactic acid in the cultured Skyr tenderizes the meat deeply without turning it mushy, resulting in incredibly juicy chicken.",
      },
    ],
    qualityPhrase: "The thick, creamy texture is absolute perfection",
    tastePhrase:
      "It has a wonderful tartness that feels incredibly clean and healthy",
  },
  "brie-traditional": {
    recipes: [
      {
        dishName: "Baked Brie with Honey and Pecans",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A hot, gooey appetizer that looks elegant but takes minutes.",
        originCountry: "France",
        ingredients: [
          "1 whole Traditional Brie",
          "Honey",
          "Chopped pecans",
          "Fresh thyme",
          "Crackers",
        ],
        steps: [
          "Preheat oven to 180°C.",
          "Place the whole brie wheel (rind on) in a small baking dish.",
          "Score the top rind lightly.",
          "Bake for 12-15 minutes until the inside feels liquid.",
          "Top with honey, toasted pecans, and thyme.",
          "Serve immediately with crackers.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The heat melts the buttery paste inside the bloomy rind, creating a rich dip that contrasts with sweet honey and crunchy nuts.",
      },
      {
        dishName: "Brie & Apple Baguette",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A classic French-style picnic sandwich.",
        originCountry: "France",
        ingredients: [
          "Traditional Brie slices",
          "Crisp green apple (Granny Smith)",
          "Fresh baguette",
          "Dijon mustard",
        ],
        steps: [
          "Slice the baguette horizontally.",
          "Spread a thin layer of Dijon mustard.",
          "Layer thick slices of room-temperature brie.",
          "Top with thinly sliced, tart green apples.",
          "Close and serve.",
        ],
        prepTime: "5 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The luscious, creamy fat of the brie is balanced perfectly by the sharp, acidic crunch of a green apple.",
      },
      {
        dishName: "Creamy Brie Pasta",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "A decadent, simple pasta using molten brie as the sauce.",
        originCountry: "Fusion",
        ingredients: [
          "Traditional Brie (rind removed)",
          "Linguine",
          "Garlic",
          "White wine",
          "Spinach",
        ],
        steps: [
          "Tear the brie paste into small chunks (discarding the heavy rind).",
          "Sauté garlic in olive oil, deglaze with wine.",
          "Toss hot pasta directly into the pan along with the brie and spinach.",
          "Stir vigorously until the cheese melts into a creamy sauce.",
          "Serve hot with black pepper.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "Brie's soft interior melts into a luxurious, buttery sauce instantly when hit with hot pasta water.",
      },
    ],
    qualityPhrase: "The buttery interior is incredibly luxurious",
    tastePhrase:
      "It has elegant mushroom-like notes and a perfect velvety finish",
  },
  "kombucha-rind": {
    recipes: [
      {
        dishName: "Kombucha Rind Tasting Board",
        image: PLACEHOLDER_IMAGE,
        shortDescription:
          "The best way to experience complex, fermented artisanal cheese.",
        originCountry: "India (Fusion)",
        ingredients: [
          "Kombucha Rind cheese",
          "Sourdough crackers",
          "Fig jam",
          "Walnuts",
        ],
        steps: [
          "Bring the cheese to room temperature for at least an hour.",
          "Slice cleanly, ensuring each piece includes the unique rind.",
          "Arrange on a board with neutral crackers.",
          "Serve alongside a small dish of sweet fig jam to balance the floral notes.",
        ],
        prepTime: "5 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "The complex, slightly fermented floral notes of the rind are best appreciated with minimal interference and a touch of sweetness.",
      },
      {
        dishName: "Earthy Warm Mushroom Salad",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A warm salad that highlights forest flavors.",
        originCountry: "Global",
        ingredients: [
          "Kombucha Rind shavings",
          "Mixed wild mushrooms",
          "Thyme",
          "Mixed greens",
          "Walnut oil",
        ],
        steps: [
          "Sauté wild mushrooms with thyme until deeply browned.",
          "Toss greens lightly with walnut oil and lay on a plate.",
          "Top with the hot mushrooms.",
          "Immediately shave the Kombucha Rind cheese over the top so it slightly softens from the heat.",
        ],
        prepTime: "20 mins",
        difficultyLevel: "Medium",
        whyItPairsWell:
          "The unique fermented, earthy notes of the kombucha-washed rind elevate the umami of wild mushrooms.",
      },
      {
        dishName: "Artisan Melt on Sourdough",
        image: PLACEHOLDER_IMAGE,
        shortDescription: "A premium open-faced grilled cheese.",
        originCountry: "Global",
        ingredients: [
          "Thick slices of Kombucha Rind",
          "Sourdough bread",
          "Olive oil",
        ],
        steps: [
          "Brush sourdough heavily with olive oil.",
          "Place thick slices of the cheese on top.",
          "Broil in the oven just until the cheese bubbles and edges turn slightly golden.",
          "Serve immediately.",
        ],
        prepTime: "10 mins",
        difficultyLevel: "Easy",
        whyItPairsWell:
          "Heating the cheese slightly releases its aromatic fermented oils, creating an incredibly fragrant, gooey experience.",
      },
    ],
    qualityPhrase: "The innovative rind brings layers of complexity",
    tastePhrase:
      "It delivers an amazing balance of floral notes and deep umami",
  },
};

const run = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "LeCheesePondyDB",
    });
    console.log("Connected.");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update.`);
    let updateCount = 0;

    for (const prod of products) {
      const slug = prod.slug;
      if (productUpdates[slug]) {
        const updateData = productUpdates[slug];

        // Generate reviews with user-requested format
        const generatedReviews = generateReviews(
          prod.name,
          updateData.qualityPhrase,
          updateData.tastePhrase,
        );

        prod.bestPairingDishes = updateData.recipes;
        prod.reviews = generatedReviews;

        // Recalculate rating
        const totalRating = generatedReviews.reduce(
          (acc, curr) => acc + curr.rating,
          0,
        );
        prod.rating = Number(
          (totalRating / generatedReviews.length).toFixed(1),
        );
        prod.reviewCount = generatedReviews.length;

        await prod.save();
        console.log(
          `✅ Updated ${prod.name} with ${updateData.recipes.length} recipes and ${generatedReviews.length} reviews.`,
        );
        updateCount++;
      } else {
        console.log(`⚠️ No update data found for slug: ${slug}`);
      }
    }

    console.log(`\n🎉 Successfully enriched ${updateCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Script failed:", err);
    process.exit(1);
  }
};

run();
