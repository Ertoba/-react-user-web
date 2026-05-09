import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { GoogleApi } from "../googleApi";
const getDistance = async (origin, destination, mode) => {
  const response = await GoogleApi.distanceApi(origin, destination, mode);
  return response?.data ?? null;
};

export default function useGetDistance(origin, destination, mode) {
  return useQuery(
    ["distance", origin, destination],
    () => getDistance(origin, destination, mode),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
