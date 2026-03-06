import { useEffect, useState } from "react";

function App() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000/places");
      const data = await response.json();
      setPlaces(data.places);
    }

    fetchData();
  }, []);

  return (
    <div>
      {places.map((place) => (
        <div key={place.id}>
          <h2>{place.title}</h2>
          <img
            src={`http://localhost:3000/${place.image.src}`}
            alt={place.image.alt}
          />
          <p>{place.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
