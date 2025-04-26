"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

const useBlockNavigation = (
  hasUnsavedChanges: boolean,
  allowedRoutes: string[] = []
) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAttemptingNavigation, setIsAttemptingNavigation] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const originalPushRef = useRef<typeof router.push | null>(null);
  const lastLocationRef = useRef<string | null>(null);

  // Check if navigation to a specific URL is allowed
  const canNavigate = useCallback(
    (url: string) => {
      try {
        const { pathname: targetPath } = new URL(url, window.location.origin);
        return (
          !hasUnsavedChanges ||
          allowedRoutes.some(
            (route) =>
              targetPath === route || targetPath.startsWith(route + "/")
          ) ||
          pathname === targetPath
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // If URL parsing fails, default to requiring confirmation
        return !hasUnsavedChanges;
      }
    },
    [allowedRoutes, hasUnsavedChanges, pathname]
  );

  // Handle router push override
  useEffect(() => {
    if (!originalPushRef.current) {
      originalPushRef.current = router.push;
    }

    const handleNavigation = (url: string) => {
      // If navigation is allowed, proceed immediately
      if (canNavigate(url)) {
        if (originalPushRef.current) {
          originalPushRef.current(url);
        }
        return;
      }

      // Block navigation & ask for confirmation
      setIsAttemptingNavigation(true);
      setNextRoute(url);
      return false;
    };

    // Override router.push
    router.push = ((url: string) => {
      return handleNavigation(url);
    }) as typeof router.push;

    return () => {
      // Restore original push when component unmounts
      if (originalPushRef.current) {
        router.push = originalPushRef.current;
      }
    };
  }, [hasUnsavedChanges, pathname, allowedRoutes, router, canNavigate]);

  // Handle Link component clicks
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleLinkClick = (e: MouseEvent) => {
      // Check if it's a link click
      const target = e.target as Element;
      const anchor = target.closest("a");

      if (!anchor) return;

      // If it's an external link or special link, don't interfere
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel") === "external"
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Don't block navigation to allowed routes
      if (canNavigate(href)) return;

      // Block the navigation
      e.preventDefault();
      e.stopPropagation();

      // Show the confirmation dialog
      setNextRoute(href);
      setIsAttemptingNavigation(true);
    };

    // Add event listener with capture to catch all link clicks
    document.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [hasUnsavedChanges]);

  // Handle reload prevention
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle back button with history tracking
  useEffect(() => {
    // Store current location
    lastLocationRef.current = pathname;

    const handlePopState = () => {
      if (hasUnsavedChanges) {
        // Prevent the default back action
        history.pushState(null, "", window.location.href);

        // Show confirmation dialog
        setIsAttemptingNavigation(true);
        setNextRoute(document.referrer || "/");
      }
    };

    // Add state to history so popstate can be triggered
    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, pathname]);

  const proceedNavigation = () => {
    setIsAttemptingNavigation(false);
    console.log({ nextRoute, originalPushRef });

    if (nextRoute) {
      if (
        nextRoute.startsWith("/") ||
        nextRoute.startsWith(window.location.origin)
      ) {
        // Internal navigation - use Router
        if (originalPushRef.current) {
          originalPushRef.current(nextRoute);
        }
      } else {
        // External navigation - use window.location
        window.location.href = nextRoute;
      }
      setNextRoute(null);
    }
  };

  const cancelNavigation = () => {
    setIsAttemptingNavigation(false);
    setNextRoute(null);
  };

  return { isAttemptingNavigation, proceedNavigation, cancelNavigation };
};

export default useBlockNavigation;
