// Writes the 1,000 products both apps show: 40 words x 25 foods, prices in cents. With a count after the file
// (10000), it writes that many, in packs: "Crunchy Apples, pack 2".
import fs from 'node:fs';
const words = ['Crunchy','Golden','Sweet','Smoky','Fresh','Spicy','Tiny','Giant','Juicy','Zesty','Wild','Toasted','Creamy','Salty','Tangy','Ripe','Honey','Garden','Rustic','Royal','Sunny','Misty','Lucky','Happy','Brave','Calm','Fancy','Humble','Jolly','Mellow','Nutty','Peppery','Rosy','Silky','Snowy','Velvet','Warm','Crisp','Bold','Dreamy'];
const foods = ['Apples','Bagels','Carrots','Dates','Eggs','Figs','Grapes','Honeydew','Ice Cream','Jam','Kale','Lemons','Mangoes','Noodles','Olives','Pears','Quiche','Radishes','Strawberries','Tomatoes','Udon','Vanilla','Walnuts','Yogurt','Zucchini'];
const count = Number(process.argv[3] || 1000);
const products = [];
for (let pack = 1; products.length < count; pack++) for (const w of words) for (const f of foods) {
  if (products.length === count) break;
  const id = products.length + 1;
  products.push({ id, name: pack === 1 ? `${w} ${f}` : `${w} ${f}, pack ${pack}`, cents: 99 + ((id * 37) % 900) });
}
fs.writeFileSync(process.argv[2], JSON.stringify(products) + '\n');
console.log(products.length, 'products, first', JSON.stringify(products[0]), 'last', JSON.stringify(products.at(-1)));
