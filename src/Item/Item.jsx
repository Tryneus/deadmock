import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {AnimatedDiv} from '/src/Animated';
import {useAction} from '/src/Common';
import {DragList} from '/src/DragList';

import {ItemComponents} from './ItemComponents';
import {ItemEffect} from './ItemEffect';
import {ItemHeader} from './ItemHeader';
import {ItemStats} from './ItemStats';
import './Item.css';

const Item = observer(({model}) => {
  const classes = classNames('mock-item', `mock-item-${model.category}`);
  const onMove = useAction((mutation) => mutation(model.effects), [model]);

  return (
    <div className={classes}>
      <AnimatedDiv className="mock-item-header-animated">
        <ItemHeader model={model} />
      </AnimatedDiv>
      <AnimatedDiv className="mock-item-components-animated">
        <ItemComponents model={model} />
      </AnimatedDiv>
      <AnimatedDiv className="mock-item-stats-animated">
        <ItemStats model={model} />
      </AnimatedDiv>
      <DragList animated onMove={onMove}>
        {model.effects.map((x) => <ItemEffect key={x.id} item={model} model={x} />)}
      </DragList>
    </div>
  );
});

export {Item};
