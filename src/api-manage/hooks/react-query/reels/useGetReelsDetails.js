import MainApi from "../../../MainApi";
import { reels_details_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiContent } from "../../../getApiContent";

const getData = async (reelId, guestId) => {
  const guestParam = guestId ? `&guest_id=${guestId}` : "";
  // Metadata/stats request must return JSON, not a partial video download.
  // Streaming media is handled separately by the Next.js reel proxy.
  const { data } = await MainApi.get(
    `${reels_details_api}?reel_id=${reelId}${guestParam}`,
  );
  return getApiContent(data);
};

export default function useGetReelsDetails(reelId, options = {}, guestId) {
  return useQuery(
    ["reels-details", reelId, guestId],
    () => getData(reelId, guestId),
    {
      enabled: !!reelId,
      onError: onSingleErrorResponse,
      ...options,
    }
  );
}
