const crypto = require('crypto');

// Deterministic mock geocoding: converts an address string into lat/lng floats.
// Produces coordinates within Brazil-ish bounding box for realism. This is a deterministic hash -> coordinates.
function geocodeAddress(address) {
  const hash = crypto.createHash('sha256').update(address || '').digest();
  // Use first 4 bytes for lat, next 4 for lng
  const latBits = hash.readUInt32BE(0);
  const lngBits = hash.readUInt32BE(4);

  // Brazil approx lat range: -33 to 5, lng range: -74 to -34
  const lat = -33 + (latBits / 0xffffffff) * (5 - -33);
  const lng = -74 + (lngBits / 0xffffffff) * (-34 - -74);

  // Round to 6 decimals like Google
  return { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 };
}

module.exports = { geocodeAddress };
