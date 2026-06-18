import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import toast from "react-hot-toast";
import { setModules } from "redux/slices/configData";
import { getSavedModuleIdentifier, saveModuleParam } from "../../utils/moduleParamManager";

const getQueryValue = (value) => (Array.isArray(value) ? value[0] : value);

const getRouteModuleIdentifier = (router) =>
  getQueryValue(router.query.module || router.query.module_id);

const getStoredModule = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("module") || "null");
  } catch {
    return null;
  }
};

const moduleMatchesIdentifier = (moduleItem, identifier) => {
  if (!moduleItem || !identifier) return false;
  const identifierString = String(identifier);
  return (
    String(moduleItem?.slug) === identifierString ||
    String(moduleItem?.id) === identifierString
  );
};

const ModuleChecker = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, refetch } = useGetModule();
  
// useEffect(() => {
//     if (data) {
//       dispatch(setModules(data));
//     }
//   }, [data]);
  // Sync Storage -> URL (keep module param on every route)
  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    const moduleFromUrl = getQueryValue(router.query.module);
    const legacyModuleId = getQueryValue(router.query.module_id);
    const storedModule = getStoredModule();

    const storedIdentifier =
      getSavedModuleIdentifier() ||
      storedModule?.slug ||
      storedModule?.id;

    const identifierToUse = moduleFromUrl || legacyModuleId || storedIdentifier;

    if (!identifierToUse) return;

    // Add module if missing, and/or remove legacy module_id
    if (!moduleFromUrl || legacyModuleId) {
      const { module_id: _legacy, ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: { ...restQuery, module: String(identifierToUse) },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  }, [router.isReady, router.asPath]);

  // Sync URL -> Storage
  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    const moduleIdFromUrl = getRouteModuleIdentifier(router);
    const storedModule = getStoredModule();

    if (moduleIdFromUrl && !moduleMatchesIdentifier(storedModule, moduleIdFromUrl)) {
      refetch();
    }
  }, [router.isReady, router.query.module, router.query.module_id, refetch]);

  useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    const moduleIdFromUrl = getRouteModuleIdentifier(router);
    const storedModule = getStoredModule();
   
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      moduleIdFromUrl &&
      !moduleMatchesIdentifier(storedModule, moduleIdFromUrl)
    ) {
      const moduleIdStr = String(moduleIdFromUrl);
      const selectedModule = data.find(
        (item) =>
          String(item?.slug) === moduleIdStr || String(item?.id) === moduleIdStr
      );
      if (selectedModule) {
        localStorage.setItem("module", JSON.stringify(selectedModule));
        saveModuleParam(selectedModule?.id, selectedModule?.slug);
        dispatch(setSelectedModule(selectedModule));
      }else{
        toast.error("Selected module is not available");
        localStorage.removeItem("module");
        router.replace(
          { pathname: "/", query: {} },
          undefined,
          { shallow: false }
        );
      }
    }
  }, [data, router.isReady, router.query.module, router.query.module_id, dispatch, router]);

  return null;
};

export default ModuleChecker;
