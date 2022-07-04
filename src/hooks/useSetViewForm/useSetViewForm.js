import { useEffect } from "react";

function useSetViewForm(disabled) {
  useEffect(() => {
    if (!disabled) return;
    const form = document.querySelector(".update-form");
    if (!form) return;
    [...form.elements].forEach(
      (element) =>
        element.type !== "button" && element.setAttribute("disabled", true)
    );
  }, [disabled]);
}

export default useSetViewForm;
