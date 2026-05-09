import MainApi from "../../MainApi";

const toCoordinate = (value) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

const getLatitude = (location) => toCoordinate(location?.latitude ?? location?.lat);
const getLongitude = (location) => toCoordinate(location?.longitude ?? location?.lng);

export const hasDistanceCoordinates = (origin, destination) =>
  getLatitude(origin) !== null &&
  getLongitude(origin) !== null &&
  getLatitude(destination) !== null &&
  getLongitude(destination) !== null;

export const GoogleApi = {
  placeApiAutocomplete: (search) => {
    if (search && search !== "") {
      return MainApi.get(
        `/api/v1/config/place-api-autocomplete?search_text=${search}`
      );
    }
  },
  placeApiDetails: (placeId) => {
    return MainApi.get(`/api/v1/config/place-api-details?placeid=${placeId}`);
  },
  getZoneId: (location) => {
    return MainApi.get(
      `/api/v1/config/get-zone-id?lat=${location.lat}&lng=${location.lng}`
    );
  },
  hasDistanceCoordinates,
  distanceApi: (origin, destination, mode = "WALK") => {
    if (!hasDistanceCoordinates(origin, destination)) {
      return Promise.resolve(null);
    }

    return MainApi.get(
      `/api/v1/config/distance-api?origin_lat=${getLatitude(
        origin
      )}&origin_lng=${getLongitude(origin)}&destination_lat=${getLatitude(
        destination
      )}&destination_lng=${getLongitude(destination)}&mode=${mode}`
    );
  },
  geoCodeApi: (location) => {
    return MainApi.get(
      `/api/v1/config/geocode-api?lat=${location.lat}&lng=${location.lng}`
    );
  },
};
