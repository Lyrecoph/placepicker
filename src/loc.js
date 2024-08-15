{/* Ce fichier permet de trier les lieux disponibles en fonction de la distance 
  par rapport à l’utilisateur c’est à dire si vous vivez près du désert du sahara 
  cette carte devrait venir en premier et les autres cartes devraient être triées 
  en fonction de la distance par rapport à votre lieu de résidence */}

function toRad(value) {
  return (value * Math.PI) / 180;
}

// Cette fonction permet de calculer la distance entre deux points sur la terre
// ou chaque point est décrit par une coordonnée de latitude et de longitude

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const l1 = toRad(lat1);
  const l2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

// cette fonction utilitaire de tri des lieux par distance qui prend en entrée
// un tableau de lieux, c'est à dire les lieux tels qu'ils sont définis dans 
// data.js et qui à la fin me donne la même liste triée par distance par rapport 
// à l'emplacement de l'utilisateur
export function sortPlacesByDistance(places, lat, lon) {
  const sortedPlaces = [...places];
  sortedPlaces.sort((a, b) => {
    const distanceA = calculateDistance(lat, lon, a.lat, a.lon);
    const distanceB = calculateDistance(lat, lon, b.lat, b.lon);
    return distanceA - distanceB;
  });
  return sortedPlaces;
}
