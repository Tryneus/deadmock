import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {AnimatedDiv} from '/src/Animated';
import {Details} from '/src/Details';

import {AbilityHeader} from './AbilityHeader';
import {AbilityUpgrade} from './AbilityUpgrade';
import './Ability.css';

// const observerConfig = {attributes: true, childList: true, subtree: true, characterData: true};
const observerConfig = {attributes: true};

const pointsToPath = (points) => {
  const strs = points.map((pair) => `${pair[0]} ${pair[1]}`);
  return "M" + strs.join(" L") + " Z";
};

const AbilityCard = observer(() => {
  const ref = useRef();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const onResize = useCallback(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
      setWidth(ref.current.clientWidth);
    }
  }, [ref, setHeight, setWidth]);

  useEffect(() => {
    onResize();
    if (ref.current) {
      const observer = new ResizeObserver(onResize);
      observer.observe(ref.current, observerConfig);
      return () => observer.disconnect();
    }
  }, [ref, onResize]);

  const outlinePoints = [[0, 20], [40, height - 20], [width, height], [width, 0]];
  const shadowPoints = [[0, 90], [75, 100], [95, 20], [15, 0]];
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <div ref={ref} className="mock-ability-card">
      <div className="mock-ability-card-background" />
      <div className="mock-ability-card-noise" />
      <div className="mock-ability-card-shadow">
        <svg viewBox={viewBox}>
          <path d={pointsToPath(shadowPoints)} fill="#bf86ec" />
        </svg>
      </div>
      <div className="mock-ability-card-border">
        <svg viewBox={viewBox}>
          <path d={pointsToPath(outlinePoints)} stroke="#6f5674" strokeWidth="4" fill="transparent" />
        </svg>
      </div>
    </div>
  );
});

export {AbilityCard};
