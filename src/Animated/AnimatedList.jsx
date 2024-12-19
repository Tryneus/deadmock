import {observer} from 'mobx-react-lite';
import {toChildArray} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

import {isString} from '../Common';
import {DragList} from '../DragList';
import {AnimatedDiv} from './AnimatedDiv';

const removedEntryTimeout = 3000;

// TODO: when combined with a DragList, the animated divs cannot capture the
// height of the interleaved dividers, so there is a small pop-in effect when
// an element is removed, once it times out.  The animation is fast enough that
// this is very hard to notice.

// Make an attempt to preserve key order for removed keys while their divs
// expire, but the order of 'newIds' must always be used.
const mergeIds = (oldIds, newIds) => {
  const newSet = new Set(newIds);
  const result = [];

  let i = 0;
  let j = 0;
  while (i < oldIds.length && j < newIds.length) {
    if (!newSet.has(oldIds[i])) {
      result.push(oldIds[i]);
      ++i;
    } else if (oldIds[i] === newIds[j]) {
      result.push(oldIds[i]);
      ++i;
      ++j;
    } else {
      result.push(newIds[j]);
      ++j;
    }
  }

  if (i < oldIds.length) {
    const resultSet = new Set(result);
    result.push(...oldIds.slice(i).filter((x) => !resultSet.has(x)));
  } else if (j < newIds.length) {
    result.push(...newIds.slice(j));
  }

  console.log({oldIds, newIds, result});

  return result;
};

const AnimatedList = observer(({items, draggable, renderItem}) => {
  const [allIds, setAllIds] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  // Track which keys are being rendered, and create a timeout entry when one is removed
  useEffect(() => {
    const newIds = items.map((x) => x.id);
    setAllIds(mergeIds(allIds, newIds));

    const leavingIds = (new Set(allIds)).difference(new Set(newIds));
    if (leavingIds.size > 0) {
      const timestamp = Date.now() + removedEntryTimeout;
      setTimeouts((prev) => prev.concat(Array.from(leavingIds).map((id) => ({id, timestamp}))));
    }
  }, [items, setAllIds, setTimeouts]);

  // Whenever timeouts change, create a timer to remove the earliest associated entry
  useEffect(() => {
    let modifiedIds = false;
    let modifiedTimeouts = false;
    const now = Date.now();
    while (timeouts.length > 0 && timeouts[0].timestamp < now) {
      const idx = allIds.indexOf(timeouts[0].id);
      if (idx !== -1) {
        allIds.splice(idx, 1);
        modifiedIds = true;
      }
      modifiedTimeouts = true;
      timeouts.shift();
    }
    if (modifiedTimeouts) {
      setTimeouts(Array.from(timeouts));
    }
    if (modifiedIds) {
      setAllIds(allIds);
    }
    if (timeouts.length > 0) {
      const timer = setTimeout(() => setTimeouts((x) => Array.from(x)), timeouts[0].timestamp - now);
      return () => clearTimeout(timer);
    }
  }, [allIds, timeouts, setAllIds, setTimeouts]);

  const itemsById = Object.fromEntries(items.map((x) => [x.id, x]));
  const auxItems = allIds.map((id) => itemsById[id] || id);
  const wrappedRender = (item) => {
    if (isString(item)) {
      // This is a placeholder for a deleted entry
      return <AnimatedDiv key={item} />;
    }

    return (
      <AnimatedDiv key={item.id}>
        {item && renderItem(item)}
      </AnimatedDiv>
    );
  };

  // Shitty workaround because I can't get walking the virtual dom to work for some reason
  if (draggable) {
    return <DragList items={items} auxItems={auxItems} renderItem={wrappedRender} />;
  }

  return <>{allIds.map(renderId)}</>;
});

export {AnimatedList};
