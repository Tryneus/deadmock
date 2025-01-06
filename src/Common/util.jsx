import {action} from 'mobx';
import {useCallback, useEffect, useState} from 'preact/hooks';

const clickInsideElement = (el, ev) => {
  const rect = el.getBoundingClientRect();
  return ev.clientX > rect.x && ev.clientX < rect.x + rect.width &&
    ev.clientY > rect.y && ev.clientY < rect.y + rect.height;
};

const deepCopy = (x) => JSON.parse(JSON.stringify(x));

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

const isString = (x) => typeof x === 'string' || x instanceof String;

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (x) => Boolean(x && x.match(uuidRegex));

const partition = (arr, count) => arr.reduce((acc, x) => {
  if (acc.length === 0 || acc[acc.length - 1].length === count) {
    acc.push([]);
  }
  acc[acc.length - 1].push(x);
  return acc;
}, []);

const prettyTimeDelta = (timestamp, now) => {
  if (!timestamp || !now) {
    return null;
  }

  const delta = (now - timestamp) / 1000;
  if (delta < 0) {
    return '';
  }
  if (delta < 60) {
    return `${Math.floor(delta)} sec ago`;
  } else if (delta < 3600) {
    return `${Math.floor(delta / 60)} min ago`;
  } else if (delta < 172800) {
    return `${Math.floor(delta / 3600)} hr ago`;
  }
  return `${Math.floor(delta / 86400)} days ago`;
};

// eslint-disable-next-line react-hooks/exhaustive-deps
const useAction = (cb, deps) => useCallback(action(cb), deps);

// call the given callback if the user clicks outside the given ref
const useClickOutside = (ref, cb) => useEffect(() => {
  const handleClick = (ev) => {
    if (ref.current && !ref.current.contains(ev.target)) {
      cb();
    }
  };

  window.addEventListener('mousedown', handleClick);
  return () => window.removeEventListener('mousedown', handleClick);
}, [ref, cb]);

const useNow = () => {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [setNow]);
  return now;
};

const useResize = (cb) => useEffect(() => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
}, [cb]);

export {
  clickInsideElement,
  deepCopy,
  isFirefox,
  isString,
  isUUID,
  partition,
  prettyTimeDelta,
  useAction,
  useClickOutside,
  useNow,
  useResize,
};
