import classNames from 'classnames';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import './AnimatedDiv.css';

const observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };

// Try to include margins for our computed height, otherwise the contents will overflow
const elementHeight = (el) => {
  const style = document.defaultView.getComputedStyle(el);
  return el.getBoundingClientRect().height + (parseInt(style.marginTop) || 0) + (parseInt(style.marginBottom) || 0);
};

const sumChildrenHeights = (el) => {
  return Array.from(el.children).map(elementHeight).reduce((x, acc) => acc + x, 0);
}

const AnimatedDiv = ({className, children}) => {
  const classes = classNames('mock-animated-div', className);
  const ref = useRef();
  const [height, setHeight] = useState(0);
  const style = {height: `${height}px`};

  const updateHeight = useCallback(() => {
    if (ref.current) {
      setHeight(sumChildrenHeights(ref.current));
      if (ref.current.parentElement) {
        setTimeout(() => ref.current?.parentElement?.scrollTo(0, 0), 0);
      }
    }
  }, [ref, setHeight]);

  useEffect(() => {
    updateHeight();
    if (ref.current) {
      const observer = new MutationObserver(updateHeight);
      observer.observe(ref.current, observerConfig);
      return () => observer.disconnect();
    }
  }, [ref, updateHeight]);

  useEffect(() => {
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [updateHeight]);

  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  );
};

export {AnimatedDiv};
