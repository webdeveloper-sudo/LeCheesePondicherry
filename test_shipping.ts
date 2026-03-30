import { calculateShipping } from './client/src/lib/shippingUtils';

const test = (weight: number, state: string, city: string, expected: number) => {
  const result = calculateShipping(weight, state, city);
  console.log(`Weight: ${weight}g, State: "${state}", City: "${city}" => Result: ₹${result} (Expected: ₹${expected}) - ${result === expected ? 'PASS' : 'FAIL'}`);
};

console.log('--- TN & PY ---');
test(500, 'Tamil Nadu', '', 50);
test(1000, 'Tamil Nadu', '', 50);
test(1001, 'Tamil Nadu', '', 100);
test(2000, 'Puducherry', '', 100);

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
