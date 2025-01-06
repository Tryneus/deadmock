import {cloneElement} from 'preact';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

// The maximum amount of time (in ms) that can pass between two clicks for them
// to still count as a double-click.
const doubleClickWindow = 500;

// Adds a 'mousedown' listener to the child element and calls the given
// callback on a click and on any subsequent double-click.  If the user click
// outside the element between the two clicks of a double-click, it does not
// count.
const DoubleClickListener = ({children, onClick, onDoubleClick}) => {
  const ref = useRef();
  const [timestamp, setTimestamp] = useState(null);
  const onMouseDown = useCallback((ev) => {
    if (timestamp && timestamp + doubleClickWindow > ev.timeStamp) {
      onDoubleClick();
    } else {
      onClick();
    }
    setTimestamp(ev.timeStamp);
  }, [timestamp, setTimestamp, onClick, onDoubleClick]);

  useEffect(() => {
    if (timestamp) {
      const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setTimestamp(null);
        }
      };

      window.addEventListener('mousedown', handleClick);
      return () => window.removeEventListener('mousedown', handleClick);
    }
  }, [ref, timestamp, setTimestamp]);

  return cloneElement(children, {ref, onMouseDown});
};

export {DoubleClickListener};
