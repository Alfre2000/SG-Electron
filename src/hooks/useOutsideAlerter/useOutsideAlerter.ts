import { useEffect, RefObject } from "react";

export default function useOutsideAlerter(
  ref: RefObject<HTMLElement>,
  callback: (event: MouseEvent) => void
): void {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]); // dependencies array for the effect
}
