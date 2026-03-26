/**
 * Calculates shipping charge based on weight and region.
 * 
 * Logic:
 * - TN + PY: ₹50 per 1kg slab
 * - KL, KA, AP, TS: ₹70 per 1kg slab
 * - Mumbai, Kolkata, Delhi: ₹80 per 1kg slab
 * - Kashmir, Meghalaya, Nagpur: ₹110 per 1kg slab
 * - Rest of India: ₹90 per 1kg slab
 * 
 * @param weightGrams Total weight in grams
 * @param state State name
 * @param city City name
 * @returns Total shipping charge in INR
 */
export const calculateShipping = (weightGrams: number, state: string = "", city: string = ""): number => {
  if (weightGrams <= 0) return 0;

  const s = state.toLowerCase().trim();
  const c = city.toLowerCase().trim();

  let baseRate = 90; // Default: Rest of India

  // Diplomatic Areas (Check first as they are more specific)
  if (
    s.includes("kashmir") || 
    s.includes("meghalaya") || 
    c.includes("nagpur")
  ) {
    baseRate = 110;
  }
  // Metro Cities (Mumbai, Kolkata, Delhi)
  else if (
    c.includes("mumbai") || 
    c.includes("kolkata") || 
    c.includes("delhi") || 
    s.includes("delhi")
  ) {
    baseRate = 80;
  }
  // Tamil Nadu + Pondicherry
  else if (
    s.includes("tamil nadu") || 
    s.includes("tamilnadu") || 
    s.includes("tamilandu") || // handling user's typo
    s.includes("puducherry") || 
    s.includes("pondicherry") ||
    c.includes("puducherry") || 
    c.includes("pondicherry")
  ) {
    baseRate = 50;
  }
  // South India (Kerala, Karnataka, Andhra, Telangana)
  else if (
    s.includes("kerala") || 
    s.includes("karnataka") || 
    s.includes("andhra") || 
    s.includes("telangana")
  ) {
    baseRate = 70;
  }

  const slabs = Math.ceil(weightGrams / 1000);
  return baseRate * slabs;
};
