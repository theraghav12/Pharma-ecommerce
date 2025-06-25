import Medicine from '../models/medicine.js';
import axios from 'axios';

// DuckDuckGo image search (no API key required)
async function searchImageUrl(query) {
  try {
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
    const tokenRes = await axios.get(searchUrl);
    const vqdMatch = tokenRes.data.match(/vqd='([\d-]+)'/);
    if (!vqdMatch) {
      console.error(`No vqd token found for query: ${query}`);
      return null;
    }
    const vqd = vqdMatch[1];
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

export const getMedicinesWithoutImages = async (req, res) => {
  const medicines = await Medicine.find({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } }, { images: null } ] });
  res.json(medicines);
};


export const getSuggestedImage = async (req, res) => {
  const { name, id } = req.query;
  let imageUrl = null;
  // Try productName first
  if (name) {
    imageUrl = await searchImageUrl(name);
  }
  // If not found, try genericName if id is provided
  if (!imageUrl && id) {
    try {
      const med = await Medicine.findById(id);
      if (med && med.genericName) {
        imageUrl = await searchImageUrl(med.genericName);
      }
    } catch (err) {
      console.error('Error fetching medicine for fallback:', err.message);
    }
  }
  res.json({ imageUrl });
};

export const approveImage = async (req, res) => {
  const { imageUrl } = req.body;
  const { id } = req.params;
  const med = await Medicine.findById(id);
  if (!med) return res.status(404).json({ error: 'Medicine not found' });
  med.images = [imageUrl];
  await med.save();
  res.json({ success: true });
};
