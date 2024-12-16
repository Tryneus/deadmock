import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {AnimatedDiv, AnimatedList} from '../Animated';
import {ItemComponents} from './ItemComponents';
import {ItemEffect} from './ItemEffect';
import {ItemHeader} from './ItemHeader';
import {ItemStats} from './ItemStats';

import './Item.css';

const Item = observer(({model}) => {
  const classes = classNames('mock-item', `mock-item-${model.category}`);
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
      <AnimatedList className="mock-item-effect-animated">
        {model.effects.map((x) => <ItemEffect key={x.id} item={model} model={x} />)}
      </AnimatedList>
    </div>
  );
});

export {Item};
