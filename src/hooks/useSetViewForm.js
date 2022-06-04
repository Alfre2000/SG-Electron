import { useEffect } from "react"

function useSetViewForm(staticForm) {
  useEffect(() => {
    if (!staticForm) return;
    const form = document.querySelector('.update-form')
    if (!form) return;
    [...form.elements].forEach(element => element.setAttribute('disabled', true))
  }, [staticForm])
}

export default useSetViewForm