import { useInfiniteQuery } from "react-query";

import { get_conversations_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params, pageParam) => {
  const { channelId, apiFor, page_limit } = params;
  const query = new URLSearchParams({
    [apiFor]: String(channelId === "admin" ? 0 : channelId),
    offset: String(pageParam),
    limit: String(page_limit),
  });

  const { data } = await MainApi.get(
    get_conversations_api + "?" + query.toString()
  );
  return data;
};
export const useGetConversation = (params) => {
  return useInfiniteQuery(
    ["get_conversation", params.apiFor, params.channelId, params.page_limit],
    ({ pageParam = params.offset }) => getData(params, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.messages?.length > 0 ? nextPage : undefined;
      },
      enabled: false,
      onError: onErrorResponse,
    }
  );
};
