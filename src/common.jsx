import {action} from 'mobx';
import {useCallback} from 'preact/hooks';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useAction = (cb, deps) => useCallback(action(cb), deps);

export {useAction};
