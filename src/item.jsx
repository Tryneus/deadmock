import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {EditableMarkdown, EditableText} from './EditableText';
import {useAction} from './common';
import {Grid} from './grid';
import {Icon} from './icon';
import {Bold, SemiBold} from './text';
import {Value} from './value';

import './item.css';

const Item = ({model}) => {
  const classes = classNames('mock-item', `mock-item-${model.category}`);
  return (
    <div className={classes}>
      <Header model={model} />
      <Components model={model} />
      <Stats model={model} />
      {model.effects.map((x, i) => <ItemEffect key={i} model={x} />)}
    </div>
  );
};

Item.propTypes = {
  model: PropTypes.object.isRequired,
};

const categoryBonuses = {
  spirit: {
    tier:  [0, 4, 8, 12, 16],
    stat:  'Spirit Power',
    image: 'spirit',
  },
  weapon: {
    units:  '%',
    tier:  [0, 6, 10, 14, 18],
    stat:  'Weapon Damage',
    image: 'weapon',
  },
  vitality: {
    units: '%',
    tier:  [0, 11, 14, 17, 20],
    stat:  'Base Health',
    image: 'vitality',
  },
};

const soulsFormatOptions = {};
const soulsFormatter = new Intl.NumberFormat('en-US', soulsFormatOptions);

const Header = ({model}) => {
  const onChangeName = useAction((x) => (model.name = x), [model]);

  const bonus = categoryBonuses[model.category];
  if (!bonus) {
    throw new Error(`invalid category: ${model.category}`);
  }

  return (
    <div className="mock-header">
      <div>
        <div className="item-name">
          <EditableText onChange={onChangeName}>{model.name}</EditableText>
        </div>
        <div className="item-cost">
          <Icon image="soul" />
          <span>{soulsFormatter.format(model.cost)}</span>
        </div>
      </div>
      <div>
        <div className="item-bonus-value">
          <SemiBold>
            +
            <Bold bright>{bonus.tier[model.tier]}</Bold>
            {bonus.units}
          </SemiBold>
          <Icon image={bonus.image} size={15} />
        </div>
        <div className="item-bonus-stat">{bonus.stat}</div>
      </div>
    </div>
  );
};

Header.propTypes = {
  model: PropTypes.object.isRequired,
};

const Components = observer(({model}) => {
  if (model.components.length === 0) {
    return null;
  }

  const lines = model.componentInfo.map((x) => {
    const classes = classNames('mock-components-badge-icon', `mock-components-badge-${x.category}`);
    return (
      <div key={x.name} className="mock-components-badge">
        <div className={classes}>
          <Icon image={x.icon} />
        </div>
        <div className="mock-components-badge-name"><Bold>{x.name}</Bold></div>
      </div>
    );
  });
  return (
    <div className="mock-components">
      <div><Bold>COMPONENTS:</Bold></div>
      {lines}
    </div>
  );
});

Components.propTypes = {
  model: PropTypes.object.isRequired,
};

const StatLine = observer(({model}) => {
  const onChangeStat = useAction((x) => (model.stat = x), [model]);
  return (
    <div>
      <Value model={model} />
      &nbsp;&nbsp;
      <EditableText onChange={onChangeStat}>{model.stat}</EditableText>
    </div>
  );
});

StatLine.propTypes = {
  model: PropTypes.object.isRequired,
};

const Stats = ({model}) => {
  return (
    <div className="mock-stats">
      {model.stats.map((x) => <StatLine key={model.stat} model={x} />)}
    </div>
  );
};

Stats.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemEffectSection = observer(({model}) => {
  // onChange is only used for markdown sections, as the grid is given its own model for updating
  const onChange = useAction((x) => (model.data = x), [model]);

  if (model.type === 'markdown') {
    return <EditableMarkdown text={model.data} onChange={onChange} />;
  } else if (model.type === 'grid') {
    return <Grid data={model.data} />;
  }
  return null;
});

ItemEffectSection.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemEffect = ({model}) => {
  const onChangeCooldown = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.cooldown = newValue;
    }
  }, [model]);

  const effectType = model.active ?
    <Bold bright>Active</Bold> :
    <SemiBold italic>Passive</SemiBold>;

  const renderCooldown = () => {
    if (!model.cooldown) {
      return null;
    }

    return (
      <div>
        <Icon image="cooldown" size={15} />
        <Bold bright>
          <EditableText onChange={onChangeCooldown}>
            {model.cooldown}
          </EditableText>
          s
        </Bold>
      </div>
    );
  };

  return (
    <div className="mock-item-effect">
      <div className="mock-item-effect-header">
        {effectType}
        {renderCooldown()}
      </div>
      <div className="mock-item-effect-body">
        {model.sections.map((x, i) => <ItemEffectSection key={i} model={x} />)}
      </div>
    </div>
  );
};

ItemEffect.propTypes = {
  model: PropTypes.object.isRequired,
};

export {Item};
export default Item;
