import {toChildArray} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

import {DragList} from '../DragList';
import {AnimatedDiv} from './AnimatedDiv';

const removedEntryTimeout = 5000;

// Make an attempt to preserve key order for removed keys while their divs
// expire, but the order of 'newKeys' must always be used.
const mergeKeys = (oldKeys, newKeys) => {
  const newSet = new Set(newKeys);
  const result = [];

  let i = 0;
  let j = 0;
  while (i < oldKeys.length && j < newKeys.length) {
    if (!newSet.has(oldKeys[i])) {
      result.push(oldKeys[i]);
      ++i;
    } else if (oldKeys[i] === newKeys[j]) {
      result.push(oldKeys[i]);
      ++i;
      ++j;
    } else {
      result.push(newKeys[j]);
      ++j;
    }
  }

  if (i < oldKeys.length) {
    const resultSet = new Set(result);
    result.push(...oldKeys.slice(i).filter((x) => !resultSet.has(x)));
  } else if (j < newKeys.length) {
    result.push(...newKeys.slice(j));
  }

  console.log(JSON.stringify({oldKeys, newKeys, result}, ' '));

  return result;
};

const AnimatedList = ({children, draggable, onMove}) => {
  const [allKeys, setAllKeys] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  // Track which keys are being rendered, and create a timeout entry when one is removed
  useEffect(() => {
    const childArray = toChildArray(children);
    const childKeys = childArray.map((x) => x.key);
    setAllKeys(mergeKeys(allKeys, childKeys));

    const leavingKeys = (new Set(allKeys)).difference(new Set(childKeys));
    if (leavingKeys.size > 0) {
      const timestamp = Date.now() + removedEntryTimeout;
      setTimeouts((prev) => prev.concat(Array.from(leavingKeys).map((id) => ({id, timestamp}))));
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
      <AnimatedDiv key={x}>
        {keyedChildren[x]}
      </AnimatedDiv>
    );
  });

  // Shitty workaround because I can't get walking the virtual dom to work for some reason
  if (draggable) {
    return (
      <DragList onMove={onMove}>
        {wrappedChildren}
      </DragList>
    );
  }

  return <>{wrappedChildren}</>;
};

export {AnimatedList};
