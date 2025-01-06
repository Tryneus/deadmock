import {useCallback, useState} from 'preact/hooks';

import {partition} from '/src/Common';
import {AbilityDisplay} from './AbilityDisplay';

const AbilityRow = ({index, left, right, onChangeModel}) => {
  const [leftHeight, setLeftHeight] = useState(null);
  const [rightHeight, setRightHeight] = useState(null);
  const minHeight = Math.min(leftHeight, rightHeight);

  const onLeftHeight = useCallback((height) => {
    setLeftHeight(height);
  }, [setLeftHeight]);

  const onRightHeight = useCallback((height) => {
    setRightHeight(height);
  }, [setRightHeight]);

  return (
    <div className="mock-hero-ability-row">
      <AbilityDisplay
        key={left.id}
        foreignModel={left}
        gutterOffset={minHeight}
        number={index * 2 + 1}
        onChangeModel={onChangeModel}
        onHeight={onLeftHeight}
      />
      <AbilityDisplay
        key={right.id}
        foreignModel={right}
        gutterOffset={minHeight}
        number={index * 2 + 2}
        onChangeModel={onChangeModel}
        onHeight={onRightHeight}
      />
    </div>
  );
};

const Abilities = ({model, onChangeModel}) => {
  const partitions = partition(model.abilities, 2);
  return (
    <div className="mock-hero-abilities">
      {partitions.map((x, i) => (
        <AbilityRow
          key={i}
          index={i}
          left={x[0]}
          right={x[1]}
          onChangeModel={onChangeModel}
        />
      ))}
    </div>
  );
};

export {Abilities};
