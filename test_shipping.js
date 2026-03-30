const calculateShipping = (weightGrams, state = "", city = "") => {
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
    s.includes("tamilandu") || 
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

const test = (weight, state, city, expected) => {
  const result = calculateShipping(weight, state, city);
  console.log(`Weight: ${weight}g, State: "${state}", City: "${city}" => Result: ₹${result} (Expected: ₹${expected}) - ${result === expected ? 'PASS' : 'FAIL'}`);
};

console.log('--- TN & PY ---');
test(500, 'Tamil Nadu', '', 50);
test(1000, 'Tamil Nadu', '', 50);
test(1001, 'Tamil Nadu', '', 100);
test(2500, 'Puducherry', '', 150);

console.log('--- South India ---');
test(500, 'Kerala', '', 70);
test(1500, 'Karnataka', '', 140);
test(2500, 'Telangana', '', 210);

console.log('--- Metro Cities ---');
test(500, '', 'Mumbai', 80);
test(1500, '', 'Kolkata', 160);
test(500, 'Delhi', '', 80);
test(500, '', 'Delhi', 80);

console.log('--- Diplomatic Areas ---');
test(500, 'Jammu and Kashmir', '', 110);
test(500, 'Meghalaya', '', 110);
test(500, '', 'Nagpur', 110);
test(1500, '', 'Nagpur', 220);

console.log('--- Rest of India ---');
test(500, 'Gujarat', '', 90);
test(1500, 'Punjab', '', 180);
test(500, '', 'Pune', 90);
