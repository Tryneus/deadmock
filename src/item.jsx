import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import {action} from 'mobx';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {Grid} from './grid';
import {EditableText, EditableMarkdown} from './EditableText';

import './item.css';

const Item = ({model}) => {
  const classes = classNames("mock-item", `mock-item-${model.category}`);
  return (
    <div className={classes}>
      <Header model={model} />
      <Components model={model} />
      <Stats model={model} />
      {model.effects.map((x) => <ItemEffect model={x} />)}
    </div>
  );
};

const categoryBonuses = {
  spirit: {
    tier: [0, 4, 8, 12, 16],
    stat: "Spirit Power",
    image: "spirit",
  },
  weapon: {
    units: "%",
    tier: [0, 6, 10, 14, 18],
    stat: "Weapon Damage",
    image: "weapon",
  },
  vitality: {
    units: "%",
    tier: [0, 11, 14, 17, 20],
    stat: "Base Health",
    image: "vitality",
  },
};

const soulsFormatOptions = {};
const soulsFormatter = new Intl.NumberFormat('en-US', soulsFormatOptions);

const Header = ({model}) => {
  const onChangeName = useCallback(action((x) => model.name = x));
  const onChangeCost = useCallback(action((x) => {
  }));

  const bonus = categoryBonuses[model.category];
  if (!bonus) {
    throw new Error(`invalid category: ${model.category}`)
  }

  return (
    <div className="mock-header">
      <div>
        <div className="item-name">
          <EditableText onChange={onChangeName}>{model.name}</EditableText>
        </div>
        <div className="item-cost">
          <Icon image="soul" />
          <EditableText onChange={onChangeCost}>{soulsFormatter.format(model.cost)}</EditableText>
        </div>
      </div>
      <div>
        <div className="item-bonus-value">
          <SemiBold>
            +<Bold bright>{bonus.tier[model.tier]}</Bold>{bonus.units}
          </SemiBold>
          <Icon size={15} image={bonus.image} />
        </div>
        <div className="item-bonus-stat">{bonus.stat}</div>
      </div>
    </div>
  );
};

const Components = observer(({model}) => {
  if (model.components.length === 0) {
    return null;
  }

  const lines = model.componentInfo.map((x) => {
    console.log(x);
    const classes = classNames('mock-components-badge-icon', `mock-components-badge-${x.category}`);
    return (
      <div className="mock-components-badge" key={x.name}>
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

const StatLine = observer(({model}) => {
  const onChangeStat = useCallback(action((x) => model.stat = x));
  return (
    <div>
      <Value model={model} />
      &nbsp;&nbsp;
      <EditableText onChange={onChangeStat}>{model.stat}</EditableText>
    </div>
  );
});

const Stats = ({model}) => {
  return (
    <div className="mock-stats">
      {model.stats.map((x) => <StatLine model={x} key={model.stat} />)}
    </div>
  );
};

const ItemEffectSection = observer(({model}) => {
  // onChange is only used for markdown sections, as the grid is given its own model for updating
  const onChange = useCallback(action((x) => model.data = x));

  if (model.type === 'markdown') {
    return <EditableMarkdown text={model.data} onChange={onChange} />;
  } else if (model.type === 'grid') {
    return <Grid data={model.data} />;
  }
  return null;
});

const ItemEffect = ({model}) => {
  const onChangeCooldown = useCallback(action((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.cooldown = newValue;
    }
  }));

  const effectType = model.active ?
    <Bold bright>Active</Bold> :
    <SemiBold italic>Passive</SemiBold>;

  const renderCooldown = () => {
    if (!model.cooldown) {
      return null;
    }

    return (
      <div>
        <Icon size={15} image="cooldown" />
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
        {model.sections.map((x) => <ItemEffectSection model={x} />)}
      </div>
    </div>
  );
};

export {Item};
export default Item;
