// Syncs product names and descriptions from the client's SEO config
// (client/src/seo/seoConfig.ts) into the products collection.
// Only `name` and `description` are changed; slugs, prices, images,
// timestamps and everything else are left untouched.
//
// Usage:
//   node scripts/syncProductSeoContent.js                 # dry run, shows changes
//   node scripts/syncProductSeoContent.js --apply         # writes changes
//   node scripts/syncProductSeoContent.js --apply --backup <file.json>
//   node scripts/syncProductSeoContent.js --restore <file.json>
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");

const SEO_CONFIG = path.join(__dirname, "../../client/src/seo/seoConfig.ts");

function loadProductSeo() {
  const source = fs.readFileSync(SEO_CONFIG, "utf8");
  const match = source.match(/const PRODUCT_SEO[^=]*=\s*(\{[\s\S]*?\n\});/);
  if (!match) throw new Error(`PRODUCT_SEO not found in ${SEO_CONFIG}`);
  // The object is a plain literal (strings only), safe to evaluate.
  return new Function(`return ${match[1]}`)();
}

const argValue = (flag) => {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : undefined;
};

async function run() {
  const apply = process.argv.includes("--apply");
  const restoreFile = argValue("--restore");
  const backupFile = argValue("--backup") || path.join(__dirname, `product-content-backup-${Date.now()}.json`);

  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) throw new Error("MONGODB_URI missing");
  await mongoose.connect(dbUri, { dbName: process.env.DB_NAME });
  console.log("🔌 Connected to MongoDB");

  if (restoreFile) {
    const backup = JSON.parse(fs.readFileSync(restoreFile, "utf8"));
    for (const p of backup) {
      await Product.updateOne(
        { _id: p._id },
        { $set: { name: p.name, description: p.description } },
        { timestamps: false },
      );
      console.log(`↩️  Restored ${p.slug}: ${p.name}`);
    }
    return;
  }

  const seoBySlug = loadProductSeo();
  const products = await Product.find({ slug: { $in: Object.keys(seoBySlug) } })
    .select("_id slug name description")
    .lean();

  const missing = Object.keys(seoBySlug).filter((slug) => !products.some((p) => p.slug === slug));
  if (missing.length) console.warn(`⚠️  No product found for slugs: ${missing.join(", ")}`);

  const changes = products.filter((p) => {
    const seo = seoBySlug[p.slug];
    return p.name !== seo.productName || p.description !== seo.productDescription;
  });

  for (const p of changes) {
    const seo = seoBySlug[p.slug];
    console.log(`\n📦 ${p.slug} (${p._id})`);
    if (p.name !== seo.productName) console.log(`   name: "${p.name}" -> "${seo.productName}"`);
    if (p.description !== seo.productDescription) {
      console.log(`   description (old): ${p.description}`);
      console.log(`   description (new): ${seo.productDescription}`);
    }
  }
  console.log(`\n${changes.length} of ${products.length} products need updating.`);

  if (!apply || !changes.length) {
    if (!apply) console.log("Dry run only - re-run with --apply to write changes.");
    return;
  }

  fs.writeFileSync(backupFile, JSON.stringify(changes, null, 2));
  console.log(`💾 Backup of current values: ${backupFile}`);

  for (const p of changes) {
    const seo = seoBySlug[p.slug];
    await Product.updateOne(
      { _id: p._id },
      { $set: { name: seo.productName, description: seo.productDescription } },
      { timestamps: false },
    );
    console.log(`✅ Updated ${p.slug}`);
  }
}

run()
  .catch((err) => {
    console.error("❌", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
