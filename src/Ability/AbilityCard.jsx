import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {AnimatedDiv} from '/src/Animated';
import {Details} from '/src/Details';

import {AbilityHeader} from './AbilityHeader';
import {AbilityUpgrade} from './AbilityUpgrade';
import './Ability.css';

// TODO: the sizes used in this file are in pixels since it is based off of the
// rendered size of the content - but the content is specified in 'rem', so it
// may be annoying to line these back up if the scaling is changed.

// const observerConfig = {attributes: true, childList: true, subtree: true, characterData: true};
const observerConfig = {attributes: true};
const borderSize = 2;

const pointsToPath = (points) => {
  const strs = points.map((pair) => `${pair[0]} ${pair[1]}`);
  return "M" + strs.join(" L") + " Z";
};

const pointsToClipPath = (points) => {
  const strs = points.map((pair) => `${pair[0]}px ${pair[1]}px`);
  return 'polygon(' + strs.join(', ') + ')';
}

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

  const viewBox = `0 0 ${width} ${height}`;
  const outlinePoints = [
    [10 + borderSize, borderSize + 15],
    [30, height - borderSize - 19],
    [width - borderSize - 19, height - borderSize - 10],
    [width - borderSize - 10, borderSize + 10],
  ];
  const shadowPoints = [
    [0, height * 0.9],
    [width * 0.75, height],
    [width, height * 0.2],
    [width * 0.15, 0],
  ];
  const clipPath = pointsToClipPath(outlinePoints);
  console.log(clipPath);
  return (
    <div ref={ref} className="mock-ability-card">
      <div className="mock-ability-card-shadow">
        <svg viewBox={viewBox}>
          <path d={pointsToPath(shadowPoints)} fill="#bf86ec" />
        </svg>
      </div>
      <div className="mock-ability-card-border">
        <svg viewBox={viewBox}>
          <path d={pointsToPath(outlinePoints)} stroke="#6f5674" strokeWidth={borderSize * 2} fill="transparent" />
        </svg>
      </div>
      <div className="mock-ability-card-background" style={{clipPath}} />
      <div className="mock-ability-card-noise" style={{clipPath}} />
    </div>
  );
});

export {AbilityCard};
