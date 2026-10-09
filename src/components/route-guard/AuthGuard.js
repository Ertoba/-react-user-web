import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthGuard = (props) => {
  const { children, from, requireToken = false } = props;
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      const token = localStorage.getItem("token");
      const guest = localStorage.getItem("guest_id");
      // Personal account pages require a signed-in user, not just the guest ID
      // that checkout creates for anonymous visitors.
      if (requireToken ? Boolean(token) : Boolean(token || guest)) {
        setChecked(true);
      }
      else {
        setChecked(false);
        router.push(
          {
            pathname: "/",
            query: { from: from },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath, requireToken]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

export default AuthGuard;
