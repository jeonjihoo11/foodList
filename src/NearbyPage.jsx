import { useEffect, useState } from "react";
import { getSortedPlacesByUserLocation } from "./location";

function NearbyPage({ places }) {
  const [sortedPlaces, setSortedPlaces] = useState([]);

  useEffect(() => {
    getSortedPlacesByUserLocation(
      places,
      (sorted) => {
        setSortedPlaces(sorted);
      },
      (error) => console.error(error),
    );
  }, [places]);

  return (
    <div>
      <h1>근처 맛집</h1>

      {sortedPlaces.map((place) => (
        <div key={place.id}>
          <h2>{place.title}</h2>
        </div>
      ))}
    </div>
  );
}

export default NearbyPage;
