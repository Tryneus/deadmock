import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {useResize} from '/src/Common';

const observerConfig = {attributes: true, childList: true, subtree: true, characterData: true};

// TODO: this will likely clobber existing onload handlers
const recurseOnLoad = (el, trigger) => {
  Array.from(el.children).forEach((child) => {
    if (child.nodeName === 'IMG' && !child.complete) {
      child.onload = trigger;
    } else {
      recurseOnLoad(child, trigger);
    }
  });
};

const MeasuredDiv = ({onHeight, onWidth, children, ...props}) => {
  const [, setDimensions] = useState({});
  const ref = useRef();

  const handleChanges = useCallback(() => {
    if (ref.current) {
      const {width, height} = ref.current.getBoundingClientRect();
      const rect = {width, height};

      recurseOnLoad(ref.current, handleChanges);
      setDimensions((old) => {
        rect.height !== old.height && onHeight && onHeight(rect.height);
        rect.width !== old.width && onWidth && onWidth(rect.width);
        return rect;
      });
    }
  }, [ref, setDimensions, onHeight, onWidth]);

  useEffect(() => {
    if (ref.current) {
      handleChanges();
      const observer = new MutationObserver(handleChanges);
      observer.observe(ref.current, observerConfig);
      return () => observer.disconnect();
    }
  }, [ref, handleChanges]);

  useResize(handleChanges);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

export {MeasuredDiv};
