import classNames from 'classnames';
import {toChildArray} from 'preact';
import {useCallback, useRef, useState} from 'preact/hooks';

import {Icon} from '../Icon';

import './DragList.css';

// TODO: drag lists receive events from other drag lists, need to filter those out

const DragListGrip = () => (
  <div className="mock-drag-list-grip" draggable>
    <Icon color="grey" image="grip" />
  </div>
);

const DragListItem = ({children, index, active, onStart, onEnd}) => {
  const classes = classNames('mock-drag-list-item', {'mock-drag-list-item-active': active});
  const onDragStart = useCallback((ev) => {
    onStart(index);
    ev.stopPropagation();
  }, [onStart]);

  const onDragEnd = useCallback((ev) => {
    onEnd(ev);
  }, [onEnd]);

  console.log(toChildArray(children));

  return (
    <div className={classes} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
    </div>
  );
};

const getRectCenter = (rect, horizontal) =>
  horizontal ?
    rect.x + rect.width / 2 :
    rect.y + rect.height / 2;

const calcDragPosition = (ev, list, horizontal) => {
  const listItems = Array.from(list.children).filter((x) => x.classList.contains('mock-drag-list-item'));
  const centers = listItems.map((x) => getRectCenter(x.getBoundingClientRect()));
  const position = horizontal ? ev.clientX : ev.clientY;
  for (let i = 0; i < centers.length; i++) {
    if (position < centers[i]) {
      return i;
    }
  }
  return centers.length;
};

const interleaveDividers = (items, target) => {
  const makeDivider = (i) => {
    const classes = classNames('mock-drag-list-divider', {'mock-drag-list-divider-highlighted': i === target});
    return <div className={classes} />;
  };
  
  const result = items.flatMap((x, i) => [makeDivider(i), x]);
  result.push(makeDivider(items.length));
  return result;
};

const DragList = ({children, horizontal, onMove}) => {
  const ref = useRef();
  const [dragging, setDragging] = useState(null);
  const [target, setTarget] = useState(null);
  const [depth, setDepth] = useState(null);

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
  }, [dragging, setTarget]);

  const onDragEnter = useCallback((ev) => {
    if (dragging !== null) {
      setDepth((x) => x + 1);
    }
  }, [dragging, setDepth]);

  const onDragLeave = useCallback((ev) => {
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

  const onDrop = useCallback((ev) => {
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
  }, [dragging, target, setDragging, setTarget]);

  const wrappedChildren = toChildArray(children).map((child, index) => (
    <DragListItem index={index} active={index === dragging} onStart={onStart} onEnd={onDrop}>
      {child}
    </DragListItem>
  ));

  return (
    <div className="mock-drag-list" ref={ref} onDragOver={onDragOver} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
      {interleaveDividers(wrappedChildren, target)}
    </div>
  );
};

export {DragList, DragListGrip};
