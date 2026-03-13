import { sortPlacesByDistance } from "./loc.js";

export function getSortedPlacesByUserLocation(
  places,
  successCallback,
  errorCallback,
) {
  if (!navigator.geolocation) {
    errorCallback && errorCallback("위치 API 지원 안됨");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const sorted = sortPlacesByDistance(places, userLat, userLon);
      successCallback(sorted);
    },
    (error) => {
      errorCallback && errorCallback(error);
    },
  );
}
