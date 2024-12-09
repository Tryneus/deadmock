import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {ItemComponents} from './ItemComponents';
import {ItemEffect} from './ItemEffect';
import {ItemHeader} from './ItemHeader';
import {ItemStats} from './ItemStats';

import './Item.css';

const Item = observer(({model}) => {
  const classes = classNames('mock-item', `mock-item-${model.category}`);
  return (
    <div className={classes}>
      <ItemHeader model={model} />
      <ItemComponents model={model} />
      <ItemStats model={model} />
      {model.effects.map((x, i) => <ItemEffect key={i} item={model} model={x} />)}
    </div>
  );
});

export {Item};
