
'use client';

import { useEffect } from "react";

/**
 * A hook to fix the viewport height on mobile devices when the on-screen keyboard appears.
 * It prevents the layout from being pushed up by setting a fixed body height.
 */
export function useMobileViewportFix() {
  useEffect(() => {
    // These handlers explicitly set the body height to 100vh when an input is focused,
    // preventing the browser from resizing the viewport and pushing the layout up,
    // which is a common issue on mobile browsers with on-screen keyboards.
    const handleFocus = () => {
      document.body.style.height = "100vh";
    };

    const handleBlur = () => {
      // Resetting the height allows the layout to behave normally when the keyboard is dismissed.
      document.body.style.height = "100vh";
    };

    // 'focusin' and 'focusout' bubble up, so we can listen on the window to catch
    // focus events from any input field in the document.
    window.addEventListener("focusin", handleFocus);
    window.addEventListener("focusout", handleBlur);

    // Cleanup function to remove event listeners when the component unmounts.
    return () => {
      window.removeEventListener("focusin", handleFocus);
      window.removeEventListener("focusout", handleBlur);
    };
  }, []);
}
