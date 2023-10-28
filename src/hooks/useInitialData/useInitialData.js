import { useEffect, useState } from 'react';
import { findElementFromID } from '../../utils';

function useStateInitialData(initialData, query, setInitial = true) {
  const [state, setState] = useState(null);
  const [initialSetupCompleted, setInitialSetupCompleted] = useState(!setInitial);

  useEffect(() => {
    if (query && !initialSetupCompleted) {
      const selectedstate = findElementFromID(initialData, query);
      setState(selectedstate || null);
      setInitialSetupCompleted(true);
    }
  }, [initialData, query, initialSetupCompleted]);

  return [state, setState];
}

export default useStateInitialData;