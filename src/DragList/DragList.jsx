import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {toChildArray} from 'preact';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {AnimatedDiv} from '/src/Animated';
import {useAction} from '/src/Common';
import {Icon} from '/src/Icon';

import './DragList.css';

const removedEntryTimeout = 300;

const DragListGrip = () => (
  <div draggable className="mock-drag-list-grip">
    <Icon color="grey" image="grip" />
  </div>
);

const DragListItem = ({children, index, active, onStart, onEnd}) => {
  const classes = classNames({
    'mock-drag-list-item':        index !== null,
    'mock-drag-list-item-unused': index === null,
    'mock-drag-list-item-active': active,
  });
  const onDragStart = useCallback((ev) => {
    onStart(index);
    ev.stopPropagation();
  }, [index, onStart]);

  const onDragEnd = useCallback((ev) => {
    onEnd(ev);
  }, [onEnd]);

  if (index === null) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <div className={classes} onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {children}
    </div>
  );
};

const getRectCenter = (rect, horizontal) =>
  (horizontal ?
    rect.x + rect.width / 2 :
    rect.y + rect.height / 2);

const calcDragPosition = (ev, list, horizontal) => {
  const listItems = Array.from(list.children).filter((x) =>
    x.classList.contains('mock-drag-list-item') ||
    x.classList.contains('mock-animated-div') &&
    Array.from(x.children).some((y) => y.classList.contains('mock-drag-list-item')),
  );
  const centers = listItems.map((x) => getRectCenter(x.getBoundingClientRect()));
  const position = horizontal ? ev.clientX : ev.clientY;
  for (let i = 0; i < centers.length; i++) {
    if (position < centers[i]) {
      return i;
    }
  }
  return centers.length;
};

const renderDivider = (index, target) => {
  const classes = classNames('mock-drag-list-divider', {'mock-drag-list-divider-highlighted': index === target});
  return <div className={classes} />;
};

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

  // TODO: I don't think this handles all cases

  if (i < oldKeys.length) {
    const resultSet = new Set(result);
    result.push(...oldKeys.slice(i).filter((x) => !resultSet.has(x)));
  } else if (j < newKeys.length) {
    result.push(...newKeys.slice(j));
  }

  return result;
};

const wrapChildren = (childArray, dragging, target, onStart, onEnd) => {
  return childArray.flatMap((child, index) => [
    renderDivider(index, target),
    (
      <DragListItem key={child.key} active={index === dragging} index={index} onEnd={onEnd} onStart={onStart}>
        {child}
      </DragListItem>
    ),
  ]);
};

const wrapAnimatedChildren = (allKeys, childArray, dragging, target, onStart, onEnd) => {
  const keyedChildren = Object.fromEntries(childArray.map((x) => [x.key, x]));
  let nextIndex = 0;

  return allKeys.flatMap((key) => {
    const child = keyedChildren[key];
    if (!child) {
      return [<AnimatedDiv key={key} />];
    }

    const index = nextIndex++;
    return [
      renderDivider(index, target),
      (
        <AnimatedDiv key={key}>
          <DragListItem active={index === dragging} index={index} onEnd={onEnd} onStart={onStart}>
            {child}
          </DragListItem>
        </AnimatedDiv>
      ),
    ];
  });
};

const DragList = observer(({horizontal, animated, children, onMove}) => {
  const ref = useRef();
  const [dragging, setDragging] = useState(null);
  const [target, setTarget] = useState(null);
  const [, setDepth] = useState(null);

  // Only used for animated lists, to keep around removed children until the animation finishes
  const [allKeys, setAllKeys] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  const onStart = useCallback((fromIndex) => {
    setDepth(0);
    setDragging(fromIndex);
  }, [setDepth, setDragging]);

  const onDragOver = useCallback((ev) => {
    if (dragging !== null) {
      if (ref.current) {
        setTarget(calcDragPosition(ev, ref.current, horizontal));
      }
      ev.preventDefault();
      ev.stopPropagation();
    }
  }, [dragging, horizontal, setTarget]);

  const onDragEnter = useCallback(() => {
    if (dragging !== null) {
      setDepth((x) => x + 1);
    }
  }, [dragging, setDepth]);

  const onDragLeave = useCallback(() => {
    if (dragging !== null) {
      setDepth((x) => {
        if (x <= 1) {
          setTarget(null);
          return null;
        }
        return x - 1;
      });
    }
  }, [dragging, setDepth, setTarget]);

  const onDrop = useAction((ev) => {
    if (dragging !== null) {
      if (target !== null && (target < dragging || target > dragging + 1)) {
        onMove((list) => {
          const item = list.splice(dragging, 1);
          list.splice(target < dragging ? target : target - 1, 0, ...item);
        });
      }
      setDepth(null);
      setTarget(null);
      setDragging(null);
      ev.stopPropagation();
    }
  }, [dragging, target, setDragging, setTarget, onMove]);

  // Track which keys are being rendered, and create a timeout entry when one is removed
  useEffect(() => {
    if (animated) {
      const newKeys = toChildArray(children).map((x) => x.key);
      setAllKeys(mergeKeys(allKeys, newKeys));

      const leavingKeys = new Set(allKeys).difference(new Set(newKeys));
      if (leavingKeys.size > 0) {
        const timestamp = Date.now() + removedEntryTimeout;
        setTimeouts((prev) => prev.concat(Array.from(leavingKeys).map((id) => ({id, timestamp}))));
      }
    }
  }, [allKeys, animated, children, setAllKeys, setTimeouts]);

  // Whenever timeouts change, create a timer to remove the earliest associated entry
  useEffect(() => {
    if (animated) {
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
    }
  }, [allKeys, animated, timeouts, setAllKeys, setTimeouts]);

  const childArray = toChildArray(children);
  const wrappedChildren = animated ?
    wrapAnimatedChildren(allKeys, childArray, dragging, target, onStart, onDrop) :
    wrapChildren(childArray, dragging, target, onStart, onDrop);

  return (
    <div ref={ref} className="mock-drag-list" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
      {wrappedChildren}
      {renderDivider(childArray.length, target)}
    </div>
  );
});

export {DragList, DragListGrip};
