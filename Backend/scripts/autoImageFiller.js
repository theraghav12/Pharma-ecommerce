// Script to automatically find and fill missing medicine images using Bing Image Search API
// Requirements: npm install mongoose axios dotenv

import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Medicine from '../models/medicine.js';

dotenv.config();

// DuckDuckGo image search (no API key required)
async function searchImageUrl(query) {
  try {
    // Step 1: Get vqd token
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
    const tokenRes = await axios.get(searchUrl);
    const vqdMatch = tokenRes.data.match(/vqd='([\d-]+)'/);
    if (!vqdMatch) {
      console.error(`No vqd token found for query: ${query}`);
      return null;
    }
    const vqd = vqdMatch[1];
    // Step 2: Get images JSON
    const apiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}`;
    const res = await axios.get(apiUrl, { headers: { 'referer': 'https://duckduckgo.com/' } });
    if (res.data.results && res.data.results.length > 0) {
      return res.data.results[0].image;
    }
    return null;
  } catch (err) {
    console.error(`Error fetching image for ${query}:`, err.message);
    return null;
  }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const medicines = await Medicine.find({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } }, { images: null } ] });
  console.log(`Found ${medicines.length} medicines without images.`);

  for (const med of medicines) {
    const query = med.productName || med.genericName || med.brandName;
    if (!query) continue;
    const imageUrl = await searchImageUrl(query);
    if (imageUrl) {
      med.images = [imageUrl];
      await med.save();
      console.log(`✔️ Updated ${med.productName} with image.`);
    } else {
      console.log(`❌ No image found for ${med.productName}`);
    }
    await new Promise(r => setTimeout(r, 1200)); // Wait to avoid rate limits
  }

  mongoose.disconnect();
  console.log('Done!');
}

main();
