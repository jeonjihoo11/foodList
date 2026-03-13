import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import "./index.css";
import { getSortedPlacesByUserLocation } from "./location.js";
function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVearBy, setShowVearBy] = useState(false);
  const [sortedPlaces, setSortedPlaces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/places");
        const data = await response.json();
        console.log("받은 데이터확인", data);
        setPlaces(data.places);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    console.log(places);
  }, []);

  function handleNearbyClick() {
    getSortedPlacesByUserLocation(
      places,
      (sorted) => {
        setSortedPlaces(sorted);
        setShowVearBy(true);
      },
      (error) => console.error(error),
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-pink-50">
        <p className="text-center text-xl font-semibold">
          맛집을 불러오는 중입니다...
        </p>
      </div>
    );
  }
  const displayPlaces = showVearBy ? sortedPlaces : places;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {displayPlaces.map((place) => (
                <div key={place.id}>
                  <h2>{place.title}</h2>
                  <img
                    src={`http://localhost:3000/${place.image.src}`}
                    alt={place.image.alt}
                    width="300"
                  />
                  <p>{place.description}</p>
                </div>
              ))}
              <button onClick={handleNearbyClick}>근처 맛집 보기</button>
            </div>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
