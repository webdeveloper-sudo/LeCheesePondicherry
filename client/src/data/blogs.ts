export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  authorRole?: string;
  authorImage?: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  tags: string[];
  gallery?: string[];
  quote?: {
    text: string;
    author: string;
  };
  relatedPosts?: string[];
}

export const blogs: BlogPost[] = [
  {
    id: "art-of-aging",
    title: "The Art of Aging: Why Time is Our Most Important Ingredient",
    date: "May 12, 2024",
    author: "Admin",
    authorRole: "Master Cheesemaker",
    authorImage: "/images/team/chef-1.jpg",
    category: "Tradition",
    image: "/images/products/aged-cheddar.jpg",
    excerpt:
      "Deep within our temperature-controlled caves in Pondicherry, thousands of cheese wheels are quietly transforming...",
    tags: ["Aging", "Artisan", "Pondicherry", "Tradition"],
    gallery: [
      "/images/products/aged-cheddar.jpg",
      "/images/products/classic-brie.jpg",
      "/images/products/kombucha-rind.jpg",
      "/images/products/baby-swiss-texture.png",
      "/images/products/daddy-swiss-texture.png",
      "/images/products/grana-chery-texture.png",
    ],
    quote: {
      text: "The process of cheesemaking is a dialogue between the milk and the clock. Patience is not just a virtue; it is the primary ingredient.",
      author: "Le Cheese Master",
    },
    content: `The process of cheesemaking is often viewed as a science, but at Le Cheese Pondicherry, we believe it is primarily an art form defined by patience and precision. While the initial steps of curdling and pressing setting the foundation, it is the silent transformation occurring during the aging process, or affineur, that truly defines the character of a premium artisan cheese.

## The Science of Transformation

When a fresh wheel of cheese enters our temperature-controlled caves, it is a blank canvas. Over weeks, months, or even years, complex biochemical reactions take place. Proteins break down into amino acids, and fats transform into various aromatic compounds. This gradual breakdown is what creates the depth of flavor, from the subtle nuttiness of a young cheddar to the sharp, crystalline complexity of an aged reserve.

## Humidity and Temperature: The Silent Guardians

Our aging caves in Pondicherry are meticulously maintained to mimic the natural limestone caves of Europe. Controlling humidity is critical; too little and the cheese dries out, becoming brittle; too much, and unwanted molds can take hold. We maintain a constant cool temperature that allows the enzymes to work at a measured pace. This slow maturation ensures that the texture remains supple while the flavor develops its signature intensity.

## The Role of the Affineur

The affineur is the guardian of the cheese during its long slumber. Every wheel is regularly inspected, turned, and sometimes brushed or washed with local saline solutions. This hands-on approach ensures that each wheel ages uniformly. The affineur listens to the cheese, tapping the rinds to check for internal consistency and sampling small cores to determine when a batch has reached its absolute peak of perfection.`,
    relatedPosts: ["french-connection", "perfect-pairings"],
  },
  {
    id: "french-connection",
    title: "Exploring the French Connection: From Normandy to Pondy",
    date: "April 28, 2024",
    author: "Admin",
    category: "Heritage",
    image: "/images/products/classic-brie.jpg",
    excerpt:
      "How our master cheesemakers blended centuries-old European techniques with the unique flavors of local Indian dairy...",
    tags: ["French", "Heritage", "Fusion", "Local"],
    quote: {
      text: "Pondicherry is the only place in India where a piece of Brie feels truly at home.",
      author: "Jean-Paul Robert",
    },
    content: `Pondicherry has always been a unique crossroads of cultures, where the elegant traditions of France meet the vibrant spirit of South India. At Le Cheese, we have embraced this heritage by blending centuries-old European cheesemaking techniques with the exceptional quality of local Indian dairy. This "French Connection" is the heartbeat of our creamery.

## A Legacy of Craftsmanship

The art of cheesemaking in regions like Normandy, Savoie, and the Jura has been refined over a millennium. These traditions emphasize the importance of terroir—the idea that the land, the climate, and the specific diet of the cattle all influence the final product. When we established our creamery in Pondicherry, we didn't just bring recipes; we brought a philosophy of respect for the raw materials and a commitment to manual, small-batch production.

## The Secret of Local Dairy

The foundation of any great cheese is the milk. We work closely with local farmers in the surrounding Tamil Nadu countryside to source the freshest, high-protein milk available. Indian cattle breeds, combined with the tropical climate, produce milk with a unique mineral profile and fat content. By applying French techniques like specific starter cultures and precise acidification levels to this local milk, we create cheeses that are both familiar to the European palate and distinctly Indian in their origin.`,
    relatedPosts: ["art-of-aging", "perfect-pairings"],
  },
  {
    id: "perfect-pairings",
    title: "Perfect Pairings: Cheese and Local Pondicherry Brews",
    date: "April 15, 2024",
    author: "Admin",
    category: "Lifestyle",
    image: "/images/products/kombucha-rind.jpg",
    excerpt:
      "Discover why our signature sharp cheddar is the perfect companion for locally crafted kombuchas and fruit infusions...",
    tags: ["Pairing", "Kombucha", "Lifestyle", "Local"],
    quote: {
      text: "A cheese without a pairing is a song without a melody.",
      author: "Gourmet Pondicherry",
    },
    content: `A great piece of artisan cheese is an experience on its own, but when paired with the right beverage, it can reach new heights of culinary delight. In the spirit of celebrating our local community, we have curated a guide to pairing our signature cheeses with the unique, locally-crafted brews found right here in Pondicherry.

## The Sharp and the Effervescent: Cheddar and Kombucha

Our aged Sharp Cheddar is known for its bold, savory profile and lingering finish. To balance this intensity, we recommend a crisp, locally-produced Ginger or Hibiscus Kombucha. The natural acidity and light effervescence of the kombucha cut through the richness of the cheese, cleansing the palate between bites. The spicy notes of ginger, in particular, complement the nutty undertones of the cheddar beautifully.

## Creamy Elegance: Brie and Fruit Infusions

The delicate, buttery texture of our classic Brie pairs wonderfully with cold-brewed fruit infusions. Consider a blend of local mango and passionfruit or a chilled hibiscus tea. These light, fruity beverages mirror the creamy sweetness of the Brie without overwhelming its subtle earthy notes. The floral aromas of the tea enhance the velvetiness of the cheese's rind, creating a sophisticated sensory experience.`,
    relatedPosts: ["art-of-aging", "french-connection"],
  },
];
