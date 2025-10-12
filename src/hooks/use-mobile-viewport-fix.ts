
'use client';

import { useEffect } from "react";

/**
 * A hook to fix the viewport height on mobile devices when the on-screen keyboard appears.
 * It adds a class to the body to prevent the layout from being pushed up.
 */
export function useMobileViewportFix() {
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            document.body.classList.add('keyboard-visible');
        }
    };

    const handleFocusOut = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
         if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            document.body.classList.remove('keyboard-visible');
        }
    };

    // 'focusin' and 'focusout' bubble up, so we can listen on the document.
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.body.classList.remove('keyboard-visible');
    };
  }, []);
}
