import 'dotenv/config';
import { connectToDatabase } from './db.js';
import { ProductModel } from './models/Product.js';

await connectToDatabase();

const sample = [
  {
    name: 'Wireless Mouse',
    sku: 'MOUSE-WL-001',
    description: 'Comfortable wireless mouse with adjustable DPI.',
    price: 799,
    stock: 25
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'KB-MECH-002',
    description: 'Tactile mechanical keyboard for fast typing.',
    price: 3499,
    stock: 12
  },
  {
    name: 'USB-C Cable',
    sku: 'CABLE-USBC-003',
    description: 'Durable 1m USB-C cable.',
    price: 199,
    stock: 100
  }
];

for (const p of sample) {
  // Upsert and update the sample data so rerunning seed adjusts prices/stock.
  await ProductModel.updateOne({ sku: p.sku }, { $set: p }, { upsert: true });
}

const count = await ProductModel.countDocuments();
// eslint-disable-next-line no-console
console.log(`Seed complete. Products in DB: ${count}`);

process.exit(0);
