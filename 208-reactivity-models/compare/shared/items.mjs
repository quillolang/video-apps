// The 50 items every Groceries app starts with: the same names, prices, quantities and ticks in all six.
// make-items.mjs writes this list into each app's own language (items.js, items.rs, items.qwe).
export const NAMES = ['Apples', 'Bananas', 'Bread', 'Butter', 'Carrots', 'Cheese', 'Chicken', 'Coffee', 'Cucumbers',
  'Eggs', 'Flour', 'Garlic', 'Grapes', 'Ham', 'Honey', 'Ice cream', 'Jam', 'Kale', 'Lemons', 'Lettuce', 'Milk',
  'Mushrooms', 'Noodles', 'Oats', 'Olive oil', 'Onions', 'Oranges', 'Pasta', 'Peanut butter', 'Pears', 'Peppers',
  'Pickles', 'Potatoes', 'Rice', 'Salmon', 'Salt', 'Soap', 'Spinach', 'Strawberries', 'Sugar', 'Tea', 'Tofu',
  'Tomatoes', 'Tortillas', 'Tuna', 'Vinegar', 'Water', 'Watermelon', 'Yogurt', 'Zucchini'];
// price in cents, so every app adds whole numbers and writes the total the same way
export const ITEMS = NAMES.map((name, i) => ({ id: i + 1, name, cents: 100 + (i * 37) % 900, qty: 1 + i % 4, done: i % 5 === 0 }));
