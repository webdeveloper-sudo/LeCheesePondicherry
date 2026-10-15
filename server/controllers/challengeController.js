const ChallengeContestant = require("../models/ChallengeContestant");

// Sample Indian names, dishes, and Tamil Nadu / Pondy creator handles for initial realistic seed
const SEED_CREATORS = [
  { name: "Priya Sundaram", handle: "@priya_cooks", dish: "Cheesy Sourdough Truffle Pizza", city: "Pondicherry", baseViews: 84580 },
  { name: "Arun Kumar", handle: "@arun_chennaifoodie", dish: "Pondy Spiced Mozzarella Dosa", city: "Chennai", baseViews: 81340 },
  { name: "Meena Ramanathan", handle: "@meenaskitchen", dish: "Smoked Cheddar Smash Burger", city: "Madurai", baseViews: 78920 },
  { name: "Karthik Venkatesh", handle: "@karthik_bakes", dish: "Baby Swiss Cheese Fondue Pot", city: "Coimbatore", baseViews: 74650 },
  { name: "Deepa Narayanan", handle: "@deepacooks_pondy", dish: "Burrata Strawberry Balsamic Tart", city: "Pondicherry", baseViews: 71890 },
  { name: "Suresh Babu", handle: "@suresh_foodjournal", dish: "Gourmet Cheese Pav Bhaji Melt", city: "Salem", baseViews: 68420 },
  { name: "Ananya Iyer", handle: "@ananyas_whisk", dish: "Grana Cherry Creamy Fettuccine", city: "Chennai", baseViews: 65110 },
  { name: "Vijay Anand", handle: "@vijay_grills", dish: "Fire-Roasted Paneer & Gouda Tikka", city: "Trichy", baseViews: 62780 },
  { name: "Divya Krishnan", handle: "@divyas_table", dish: "Crispy Bocconcini Arancini Balls", city: "Tirunelveli", baseViews: 59340 },
  { name: "Rajesh Kannan", handle: "@rajesh_cheftales", dish: "Loaded Double Cheese Kathi Roll", city: "Pondicherry", baseViews: 57620 },
  { name: "Swetha Balaji", handle: "@swethas_kitchen", dish: "Aged Cheddar Mac & Cheese Bake", city: "Coimbatore", baseViews: 54900 },
  { name: "Manoj Prabhakar", handle: "@manoj_bites", dish: "Spicy Cheese Stuffed Parotta", city: "Erode", baseViews: 52140 },
  { name: "Nandhini Mohan", handle: "@nandhinicooks", dish: "Whipped Ricotta Fig Bruschetta", city: "Chennai", baseViews: 49830 },
  { name: "Gautham Menon", handle: "@gautham_plates", dish: "Cheesy Pull-Apart Garlic Bread", city: "Pondicherry", baseViews: 47250 },
  { name: "Kavitha Rangarajan", handle: "@kavitha_bakes", dish: "Herbed Gouda Mushroom Galette", city: "Madurai", baseViews: 45600 },
  { name: "Rohan Chandrasekhar", handle: "@rohan_cooks", dish: "Pondy Orange Cheesy Ramen Bowl", city: "Bangalore", baseViews: 43210 },
  { name: "Sneha Ramachandran", handle: "@snehas_flavors", dish: "Baked Mozzarella Stuffed Tomatoes", city: "Vellore", baseViews: 41800 },
  { name: "Dinesh Raghavan", handle: "@dinesh_skillet", dish: "Smoked Cheese & Jalapeno Poppers", city: "Chennai", baseViews: 39950 },
  { name: "Revathi Senthil", handle: "@revathi_recipes", dish: "Truffle Cheese Masala Sandwich", city: "Pondicherry", baseViews: 38200 },
  { name: "Ashwin Raj", handle: "@ashwin_cooks", dish: "Mozzarella & Pesto Pinwheels", city: "Tirupur", baseViews: 36740 },
];

const FIRST_NAMES = [
  "Aarav", "Aadhya", "Akash", "Ananya", "Bhavna", "Chethan", "Darshan", "Divya",
  "Elango", "Eshwar", "Farhan", "Gayathri", "Harish", "Hemalatha", "Ilango", "Indira",
  "Jayanth", "Jeeva", "Kamalesh", "Kavya", "Keerthana", "Lakshmi", "Lokesh", "Madhavan",
  "Mythili", "Navaneeth", "Nithya", "Pradeep", "Preethi", "Raghavan", "Ramya", "Sanjay",
  "Saravanan", "Shalini", "Siddharth", "Subhash", "Tamilarasan", "Tharani", "Uma", "Varun",
  "Vasanth", "Vidya", "Vignesh", "Vinoth", "Yamuna", "Yuvaraj", "Zoya", "Archana",
  "Aravind", "Balaji", "Chitra", "Deepak", "Ganesh", "Gomathi", "Hari", "Janani",
  "Kannan", "Latha", "Manikandan", "Naveen", "Pavithra", "Radha", "Santhosh", "Thenmozhi"
];

const LAST_NAMES = [
  "Sharma", "Iyer", "Natarajan", "Pillai", "Chettiar", "Gounder", "Mudaliar", "Naidu",
  "Menon", "Nair", "Reddy", "Verma", "Rao", "Patel", "Venkatesan", "Karthikeyan",
  "Subramanian", "Krishnamurthy", "Srinivasan", "Sundaram", "Swaminathan", "Balakrishnan"
];

const DISH_IDEAS = [
  "Artisan Pizza Margherita", "Loaded Sourdough Melt", "Cheese Podi Uttapam", "Crispy Quesadilla",
  "Baked Penne Alfredo", "Four-Cheese Calzone", "Truffle Brie Tartlet", "Herb Gouda Panini",
  "Smoked Cheddar Cheese Fries", "Cheese Stuffed Mirchi Bajji", "Burrata Caprese Toast",
  "Bocconcini Cherry Tomato Skewers", "Creamy Ricotta Pasta", "Gourmet Fondue Platter",
  "Spicy Paneer Tikka Burger", "Cheesy Loaded Nachos", "Aged Cheddar Omelette Roll",
  "Garlic Herb Cheese Bombs", "Triple Cheese Club Sandwich", "Cheesy Kothu Parotta Twist"
];

const TAMIL_CITIES = ["Pondicherry", "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur"];

/**
 * Helper to auto-seed realistic contestants up to ~350 total if collection is low
 */
async function ensureSeedContestants() {
  try {
    const count = await ChallengeContestant.countDocuments();
    if (count >= 300) return;

    console.log(`[ChallengeSeed] Current contestants: ${count}. Seeding up to 350 realistic contestants...`);
    const bulkData = [];

    // First insert the top curated contenders
    SEED_CREATORS.forEach((c, idx) => {
      bulkData.push({
        fullName: c.name,
        mobile: `9840${String(100000 + idx).padStart(6, "0")}`,
        email: `${c.handle.replace("@", "")}@gmail.com`,
        instagramHandle: c.handle,
        reelUrl: `https://www.instagram.com/reel/C${1000000 + idx}/`,
        dishName: c.dish,
        city: c.city,
        views: c.baseViews + Math.floor(Math.random() * 200),
        likes: Math.floor((c.baseViews * 0.12) + (Math.random() * 150)),
        shares: Math.floor((c.baseViews * 0.04) + (Math.random() * 80)),
        referenceId: `LPC-CHALLENGE-SEED-${idx + 1}`,
        status: "active",
        isVerified: true,
        createdAt: new Date(Date.now() - (idx * 3600000 * 5)),
      });
    });

    // Generate remaining contestants to reach ~350
    const targetCount = 350;
    const needed = targetCount - bulkData.length;

    for (let i = 0; i < needed; i++) {
      const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const fullName = `${fName} ${lName}`;
      const handle = `@${fName.toLowerCase()}_${lName.toLowerCase().slice(0, 3)}${Math.floor(Math.random() * 99)}`;
      const dish = DISH_IDEAS[Math.floor(Math.random() * DISH_IDEAS.length)];
      const city = TAMIL_CITIES[Math.floor(Math.random() * TAMIL_CITIES.length)];
      
      // Distributed views curve from 35,000 down to 1,200
      const viewDecay = Math.pow((needed - i) / needed, 1.8);
      const views = Math.floor(1200 + (viewDecay * 34000) + Math.floor(Math.random() * 400));
      const likes = Math.floor(views * (0.08 + Math.random() * 0.07));
      const shares = Math.floor(views * (0.02 + Math.random() * 0.04));

      bulkData.push({
        fullName,
        mobile: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i + 1}@example.com`,
        instagramHandle: handle,
        reelUrl: `https://www.instagram.com/reel/C${2000000 + i}/`,
        dishName: dish,
        city,
        views,
        likes,
        shares,
        referenceId: `LPC-CHALLENGE-${Date.now().toString(36).toUpperCase()}-${100 + i}`,
        status: "active",
        isVerified: true,
        createdAt: new Date(Date.now() - (Math.random() * 18 * 24 * 3600000)),
      });
    }

    // Sort by views descending before inserting
    bulkData.sort((a, b) => b.views - a.views);

    await ChallengeContestant.insertMany(bulkData);
    console.log(`[ChallengeSeed] Successfully seeded ${bulkData.length} contestants.`);
  } catch (err) {
    console.error("[ChallengeSeed] Error seeding contestants:", err.message);
  }
}

/**
 * @desc    Submit a new entry into the Le Pondicherry Cheese Cooking Challenge
 * @route   POST /api/challenge/entry
 * @access  Public
 */
const submitChallengeEntry = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      instagramHandle,
      reelUrl,
      isPublicAccount,
      isFirst10SecIntro,
      isTermsAgreed,
      dishName,
    } = req.body;

    if (!fullName || !mobile || !email || !instagramHandle || !reelUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please complete all form inputs.",
      });
    }

    if (!isPublicAccount || !isFirst10SecIntro || !isTermsAgreed) {
      return res.status(400).json({
        success: false,
        message: "Please agree to all mandatory campaign confirmations.",
      });
    }

    // Ensure @ prefix
    const cleanHandle = instagramHandle.trim().startsWith("@")
      ? instagramHandle.trim()
      : `@${instagramHandle.trim()}`;

    // Generate unique reference ID
    const referenceId = `LPC-CHALLENGE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // Calculate initial dynamic views for the submitted reel:
    // Every newly submitted Reel enters with an organic starter audience (e.g., 2,500 - 18,500 views)
    // and grows dynamically!
    const hash = Array.from(reelUrl).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const initialViews = 3200 + (hash % 15000) + Math.floor(Math.random() * 500);
    const initialLikes = Math.floor(initialViews * 0.11);
    const initialShares = Math.floor(initialViews * 0.035);

    // Save to Database
    const newContestant = await ChallengeContestant.create({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      instagramHandle: cleanHandle,
      reelUrl: reelUrl.trim(),
      dishName: dishName || "Signature Cheesy Creation",
      views: initialViews,
      likes: initialLikes,
      shares: initialShares,
      referenceId,
      status: "active",
      isVerified: true,
      isPublicAccount: Boolean(isPublicAccount),
      isFirst10SecIntro: Boolean(isFirst10SecIntro),
      isTermsAgreed: Boolean(isTermsAgreed),
    });

    // Compute live rank
    const higherCount = await ChallengeContestant.countDocuments({
      views: { $gt: newContestant.views },
      status: "active",
    });
    const calculatedRank = higherCount + 1;

    console.log(`[ChallengeEntry] New entry registered: ${fullName} (${cleanHandle}), Views: ${initialViews}, Rank: #${calculatedRank}, Ref: ${referenceId}`);

    return res.status(201).json({
      success: true,
      message: "Challenge entry submitted successfully! You are now live on the Leaderboard.",
      referenceId,
      contestant: {
        id: newContestant._id,
        fullName: newContestant.fullName,
        instagramHandle: newContestant.instagramHandle,
        reelUrl: newContestant.reelUrl,
        dishName: newContestant.dishName,
        views: newContestant.views,
        rank: calculatedRank,
        referenceId: newContestant.referenceId,
        createdAt: newContestant.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting challenge entry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit challenge entry. Please try again.",
    });
  }
};

/**
 * @desc    Get dynamic leaderboard with search, pagination, and ranking
 * @route   GET /api/challenge/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res) => {
  try {
    // Ensure seed data exists so 300-400 contestants are available
    // await ensureSeedContestants(); // Seeding disabled as per user request

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const search = req.query.search ? req.query.search.trim() : "";
    const sortBy = req.query.sortBy || "views"; // views or recent

    const query = { status: "active" };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { fullName: searchRegex },
        { instagramHandle: searchRegex },
        { dishName: searchRegex },
        { city: searchRegex },
        { referenceId: searchRegex },
      ];
    }

    const sortOption = sortBy === "recent" ? { createdAt: -1 } : { views: -1, createdAt: 1 };

    const total = await ChallengeContestant.countDocuments(query);
    const totalContestants = await ChallengeContestant.countDocuments({ status: "active" });

    // Fetch paginated contestants
    const contestants = await ChallengeContestant.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Map ranks accurately
    const rankedContestants = await Promise.all(
      contestants.map(async (item, index) => {
        // If sorting by views, rank is deterministic based on skip + index
        const rank = sortBy === "views" && !search
          ? (page - 1) * limit + index + 1
          : (await ChallengeContestant.countDocuments({
              views: { $gt: item.views },
              status: "active",
            })) + 1;

        return {
          id: item._id,
          rank,
          fullName: item.fullName,
          instagramHandle: item.instagramHandle,
          reelUrl: item.reelUrl,
          dishName: item.dishName || "Artisanal Cheese Dish",
          city: item.city || "Tamil Nadu",
          views: item.views,
          likes: item.likes || Math.floor(item.views * 0.1),
          shares: item.shares || Math.floor(item.views * 0.03),
          referenceId: item.referenceId,
          createdAt: item.createdAt,
          isVerified: item.isVerified,
        };
      })
    );

    // Fetch Top 3 podium items (always absolute top 3 in entire contest)
    const top3Raw = await ChallengeContestant.find({ status: "active" })
      .sort({ views: -1 })
      .limit(3)
      .lean();

    const top3 = top3Raw.map((item, idx) => ({
      rank: idx + 1,
      id: item._id,
      fullName: item.fullName,
      instagramHandle: item.instagramHandle,
      reelUrl: item.reelUrl,
      dishName: item.dishName,
      city: item.city,
      views: item.views,
      likes: item.likes,
      referenceId: item.referenceId,
    }));

    // Stats
    const leadingViews = top3[0] ? top3[0].views : 0;
    const stats = {
      totalContestants,
      leadingViews,
      totalViewsRecorded: (await ChallengeContestant.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]))[0]?.total || 0,
      activeReachPeriodDays: 21,
      prizeName: "Electric Scooter",
    };

    return res.status(200).json({
      success: true,
      contestants: rankedContestants,
      top3,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching challenge leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load leaderboard data.",
    });
  }
};

/**
 * @desc    Simulate/sync live view increments across random active contestants
 * @route   POST /api/challenge/sync-views
 * @access  Public
 */
const syncViews = async (req, res) => {
  try {
    // Pick 15 random active contestants and bump their views by +12 to +95
    const sample = await ChallengeContestant.aggregate([
      { $match: { status: "active" } },
      { $sample: { size: 15 } },
    ]);

    const updates = sample.map(async (doc) => {
      const increment = Math.floor(15 + Math.random() * 65);
      return ChallengeContestant.findByIdAndUpdate(doc._id, {
        $inc: { views: increment, likes: Math.floor(increment * 0.1) },
      });
    });

    await Promise.all(updates);

    return res.status(200).json({
      success: true,
      message: "Views dynamically synced.",
      syncedCount: sample.length,
    });
  } catch (error) {
    console.error("Error syncing views:", error);
    return res.status(500).json({ success: false, message: "Sync failed" });
  }
};

// Recalculate views for all contestants based on reel URL hash
const recalcAllViews = async (req, res) => {
  try {
    const contestants = await ChallengeContestant.find({});
    const bulkOps = contestants.map((c) => {
      const hash = Array.from(c.reelUrl).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const newViews = 3200 + (hash % 15000) + Math.floor(Math.random() * 500);
      const newLikes = Math.floor(newViews * 0.11);
      const newShares = Math.floor(newViews * 0.035);
      return {
        updateOne: {
          filter: { _id: c._id },
          update: { views: newViews, likes: newLikes, shares: newShares },
        },
      };
    });
    if (bulkOps.length) await ChallengeContestant.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: "Views recalculated for all contestants." });
  } catch (error) {
    console.error("Error recalculating views:", error);
    return res.status(500).json({ success: false, message: "Failed to recalculate views." });
  }
};

const deleteAllContestants = async (req, res) => {
  try {
    await ChallengeContestant.deleteMany({});
    return res.status(200).json({ success: true, message: "All contestants removed." });
  } catch (error) {
    console.error("Error deleting contestants:", error);
    return res.status(500).json({ success: false, message: "Failed to delete contestants." });
  }
};

module.exports = {
  submitChallengeEntry,
  getLeaderboard,
  syncViews,
  deleteAllContestants,
  recalcAllViews,
};

