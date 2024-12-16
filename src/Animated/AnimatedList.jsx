import {toChildArray} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

import {AnimatedDiv} from './AnimatedDiv';

const removedEntryTimeout = 200;

// TODO: check if order of keys has changed and update allKeys accordingly, but presently nothing is reordered anyway
const mergeNewKeys = (allKeys, childKeys) => {
  const acc = [];
  childKeys.forEach((x) => {
    const idx = allKeys.indexOf(x);
    if (idx === -1) {
      acc.push(x);
    } else if (acc.length > 0) {
      allKeys.splice(idx, 0, ...acc);
    }
  });
  return allKeys.concat(acc);
};

const AnimatedList = ({className, children}) => {
  const [allKeys, setAllKeys] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  // Track which keys are being rendered, and create a timeout entry when one is removed
  useEffect(() => {
    const childArray = toChildArray(children);
    const childKeys = childArray.map((x) => x.key);
    setAllKeys(mergeNewKeys(allKeys, childKeys));

    const leavingKeys = (new Set(allKeys)).difference(new Set(childKeys));
    if (leavingKeys.size > 0) {
      const timestamp = Date.now() + removedEntryTimeout;
      setTimeouts((prev) => {
        leavingKeys.forEach((id) => prev.push({id, timestamp}));
        return prev;
      });
    }
  }, [children, setAllKeys, setTimeouts]);

  // Whenever timeouts change, create a timer to remove the earliest associated entry
  useEffect(() => {
    let modifiedKeys = false;
    let modifiedTimeouts = false;
    const now = Date.now();
    while (timeouts.length > 0 && timeouts[0].timestamp < now) {
      const idx = allKeys.indexOf(timeouts[0].id);
      if (idx !== -1) {
        allKeys.splice(idx, 1);
        modifiedKeys = true;
      }
      modifiedTimeouts = true;
      timeouts.shift();
    }
    if (modifiedTimeouts) {
      setTimeouts(Array.from(timeouts));
    }
    if (modifiedKeys) {
      setAllKeys(allKeys);
    }
    if (timeouts.length > 0) {
      const timer = setTimeout(() => setTimeouts((x) => Array.from(x)), timeouts[0].timestamp - now);
      return () => clearTimeout(timer);
    }
  }, [allKeys, timeouts, setAllKeys, setTimeouts]);

  const keyedChildren = Object.fromEntries(toChildArray(children).map((x) => [x.key, x]));
  const wrappedChildren = allKeys.map((x) => {
    return (
      <AnimatedDiv className={className} key={x}>
        {keyedChildren[x]}
      </AnimatedDiv>
    );
  });

  return <>{wrappedChildren}</>;
};

export {AnimatedList};
