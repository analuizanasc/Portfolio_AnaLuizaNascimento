// Haversine formula to compute distance in kilometers between two coords
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineDistance(c1, c2) {
  if (!c1 || !c2) return Infinity;
  const R = 6371; // km
  const dLat = toRad(c2.lat - c1.lat);
  const dLon = toRad(c2.lng - c1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = { haversineDistance };
