import classNames from 'classnames';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

const observerConfig = { attributes: true, childList: true, subtree: true, characterData: true };

const AnimatedDiv = ({className, children}) => {
  const classes = classNames('mock-animated-div', className);
  const ref = useRef();
  const [height, setHeight] = useState(0);
  const style = {height: `${height}px`};

  const updateHeight = useCallback(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
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
    <div className={classes} style={style}>
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
};

export {AnimatedDiv};
