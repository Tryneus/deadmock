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

const Item = observer(({model}) => {
  const classes = classNames('mock-item', `mock-item-${model.category}`);
  return (
    <div className={classes}>
      <Header model={model} />
      <Components model={model} />
      <Stats model={model} />
      {model.effects.map((x, i) => <ItemEffect key={i} model={x} />)}
    </div>
  );
});

Item.propTypes = {
  model: PropTypes.object.isRequired,
};

const categoryBonuses = {
  spirit: {
    tier:  [0, 4, 8, 12, 16],
    stat:  'Spirit Power',
    image: 'spirit',
    color: 'purple',
  },
  weapon: {
    units:  '%',
    tier:  [0, 6, 10, 14, 18],
    stat:  'Weapon Damage',
    image: 'weapon',
    color: 'orange',
  },
  vitality: {
    units: '%',
    tier:  [0, 11, 14, 17, 20],
    stat:  'Base Health',
    image: 'vitality',
    color: 'green',
  },
};

const categories = Object.keys(categoryBonuses);

const soulsFormatOptions = {};
const soulsFormatter = new Intl.NumberFormat('en-US', soulsFormatOptions);

const Header = observer(({model}) => {
  const onChangeName = useAction((x) => (model.name = x), [model]);
  const onChangeTier = useAction(() => (model.tier = (model.tier % 4) + 1), [model]);
  const onChangeCategory = useAction(() => {
    const idx = categories.indexOf(model.category) + 1;
    model.category = categories[idx % categories.length];
  }, [model]);

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
          <Icon color="cyan" image="soul" />
          <span>{soulsFormatter.format(model.cost)}</span>
        </div>
      </div>
      <div>
        <div className="item-bonus-value" onClick={onChangeTier}>
          <SemiBold>
            +
            <Bold bright>{bonus.tier[model.tier]}</Bold>
            {bonus.units}
          </SemiBold>
          <Icon color={bonus.color} image={bonus.image} size={15} />
        </div>
        <div className="item-bonus-stat" onClick={onChangeCategory}>{bonus.stat}</div>
      </div>
    </div>
  );
});

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


const StatLineHoverButton = observer(({model, index}) => {
  const onDelete = useAction(() => model.removeStat(index), [model, index]);
  return (
    <div className="mock-item-stat-hover-buttons">
      <Icon color="red" image="cancel" size={12} onClick={onDelete} />
    </div>
  );
});


const StatLine = observer(({model, index}) => {
  const onChangeStat = useAction((x) => (model.stats[index].stat = x), [model, index]);

  return (
    <div>
      <Value model={model.stats[index]} />
      &nbsp;&nbsp;
      <EditableText onChange={onChangeStat}>{model.stats[index].stat}</EditableText>
      <StatLineHoverButton index={index} model={model}/>
    </div>
  );
});

StatLine.propTypes = {
  model: PropTypes.object.isRequired,
};

const Stats = observer(({model}) => {
  return (
    <div className="mock-stats">
      {model.stats.map((x, i) => <StatLine key={i} index={i} model={model} />)}
    </div>
  );
});

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

const ItemEffect = observer(({model}) => {
  const onChangeCooldown = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.cooldown = newValue;
    }
  }, [model]);

  const onChangeActive = useAction(() => (model.active = !model.active), [model]);

  const effectType = model.active ?
    <Bold bright>Active</Bold> :
    <SemiBold italic>Passive</SemiBold>;

  const renderCooldown = () => {
    if (!model.cooldown) {
      return null;
    }

    return (
      <div>
        <Icon image="stat/cooldown" size={15} />
        &nbsp;
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
        <span onClick={onChangeActive}>
          {effectType}
        </span>
        {renderCooldown()}
      </div>
      <div className="mock-item-effect-body">
        {model.sections.map((x, i) => <ItemEffectSection key={i} model={x} />)}
      </div>
    </div>
  );
});

ItemEffect.propTypes = {
  model: PropTypes.object.isRequired,
};

export {Item};
export default Item;
