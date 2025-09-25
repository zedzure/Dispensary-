import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const getIsMobile = () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

  const [isMobile, setIsMobile] = React.useState<boolean>(getIsMobile);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // ✅ Initialize immediately
    setIsMobile(mql.matches);

    // ✅ Use `addEventListener` if supported, fallback to `addListener` for older browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // @ts-ignore (for Safari <14)
      mql.addListener(onChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore
        mql.removeListener(onChange);
      }
    };
  }, []);

  return isMobile;
}
