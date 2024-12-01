import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';
import {EditableMarkdown, EditableText, ItemPicker, TooltipContainer} from './EditableText';
import {SidebarButton, SidebarButtons} from './SidebarButtons';
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
      <ItemComponents model={model} />
      <Stats model={model} />
      {model.effects.map((x, i) => <ItemEffect key={i} item={model} model={x} />)}
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
  const onChangeTier = useAction(() => (model.tier = model.tier % 4 + 1), [model]);
  const onChangeCategory = useAction(() => {
    const idx = categories.indexOf(model.category) + 1;
    model.category = categories[idx % categories.length];
  }, [model]);
  const onAddComponent = useAction(() => model.addComponent());
  const onAddEffect = useAction(() => model.addEffect());
  const renderSidebarButtons = useCallback(() => (
    <>
      <SidebarButton label="Component" onClick={onAddComponent} />
      <SidebarButton label="Effect" onClick={onAddEffect} />
    </>
  ), [onAddComponent, onAddEffect]);

  const bonus = categoryBonuses[model.category];
  if (!bonus) {
    throw new Error(`invalid category: ${model.category}`);
  }

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-header">
        <div>
          <div className="item-name">
            <EditableText color="bright" onChange={onChangeName}>{model.name}</EditableText>
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
              <Bold color="bright">{bonus.tier[model.tier]}</Bold>
              {bonus.units}
            </SemiBold>
            <Icon color={bonus.color} image={bonus.image} size={15} />
          </div>
          <div className="item-bonus-stat" onClick={onChangeCategory}>{bonus.stat}</div>
        </div>
      </div>
    </SidebarButtons>
  );
});

Header.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemComponent = observer(({model, index}) => {
  const onDelete = useAction(() => model.removeComponent(index));
  const onChange = useAction((x) => (model.components[index] = x.name));

  const item = model.componentInfo[index];
  const classes = classNames('mock-item-component-badge-icon', `mock-item-component-badge-${item.category}`);

  const renderItemPicker = useCallback(() => <ItemPicker onChange={onChange} />, [onChange]);

  return (
    <div className="mock-item-component">
      <div className="mock-item-component-badge">
        <TooltipContainer click direction="down" renderTooltip={renderItemPicker}>
          <div className={classes}>
            <Icon image={item.icon} />
          </div>
        </TooltipContainer>
        <div className="mock-item-component-badge-name"><Bold>{item.name}</Bold></div>
      </div>
      <div className="mock-item-component-hover-buttons">
        <Icon color="red" image="cancel" size={12} onClick={onDelete} />
      </div>
    </div>
  );
});

const ItemComponents = observer(({model}) => {
  if (model.components.length === 0) {
    return null;
  }

  return (
    <div className="mock-components">
      <div><Bold>COMPONENTS:</Bold></div>
      {model.components.map((_, i) => <ItemComponent key={i} index={i} model={model} />)}
    </div>
  );
});

ItemComponents.propTypes = {
  model: PropTypes.object.isRequired,
};

const StatLine = observer(({model, index}) => {
  const onChangeStat = useAction((x) => (model.stats[index].stat = x), [model, index]);
  const onDelete = useAction(() => model.removeStat(index), [model, index]);

  return (
    <div>
      <Value model={model.stats[index]} />
      &nbsp;&nbsp;
      <EditableText onChange={onChangeStat}>{model.stats[index].stat}</EditableText>
      <div className="mock-item-stat-hover-buttons">
        <Icon color="red" image="cancel" size={12} onClick={onDelete} />
      </div>
    </div>
  );
});

StatLine.propTypes = {
  model: PropTypes.object.isRequired,
};

const Stats = observer(({model}) => {
  const onAddStat = useAction(() => model.addStat({signed: true}));
  const renderSidebarButtons = useCallback(() => (
    <>
      <SidebarButton label="Stat" onClick={onAddStat} />
    </>
  ), [onAddStat]);

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-stats">
        {model.stats.map((x, i) => <StatLine key={i} index={i} model={model} />)}
      </div>
    </SidebarButtons>
  );
});

Stats.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemEffectSection = observer(({model, index}) => {
  // onChange is only used for markdown sections, as the grid is given its own model for updating
  const section = model.sections[index];
  const onChange = useAction((x) => (section.data = x), [section]);
  const onEmptyGrid = useAction(() => model.removeSection(index), [model, index]);

  if (section.type === 'markdown') {
    return (
      <div className="mock-item-effect-markdown">
        <EditableMarkdown text={section.data} onChange={onChange} />
      </div>
    );
  } else if (section.type === 'grid') {
    return <Grid data={section.data} onEmpty={onEmptyGrid} />;
  }
  return null;
});

ItemEffectSection.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemEffect = observer(({item, model}) => {
  const onChangeCooldown = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.cooldown = newValue;
    }
  }, [model]);

  const onChangeActive = useAction(() => (model.active = !model.active), [model]);
  const onAddMarkdown = useAction(() => model.addMarkdownSection());
  const onAddGrid = useAction(() => model.addGridSection());
  const onDelete = useAction(() => {
    const index = item.effects.indexOf(model);
    if (index === -1) {
      console.error('item effect not found', model);
    } else {
      item.removeEffect(index);
    }
  });

  const effectType = model.active ?
    <Bold color="bright">Active</Bold> :
    <SemiBold italic>Passive</SemiBold>;

  const renderCooldown = () => {
    if (!model.cooldown) {
      return null;
    }

    return (
      <div>
        <Icon image="stat/cooldown" size={15} />
        &nbsp;
        <EditableText color="bright" weight={700} onChange={onChangeCooldown}>
          {model.cooldown}
        </EditableText>
        <Bold color="bright">
          s
        </Bold>
      </div>
    );
  };

  const renderSidebarButtons = useCallback(() => (
    <>
      <SidebarButton label="Markdown" onClick={onAddMarkdown} />
      <SidebarButton label="Grid" onClick={onAddGrid} />
    </>
  ), [onAddGrid, onAddMarkdown]);

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-item-effect">
        <div className="mock-item-effect-header">
          <div>
            <span onClick={onChangeActive}>
              {effectType}
            </span>
            <div className="mock-item-effect-header-hover-buttons">
              <Icon color="red" image="cancel" size={12} onClick={onDelete} />
            </div>
          </div>
          {renderCooldown()}
        </div>
        <div className="mock-item-effect-body">
          {model.sections.map((x, i) => <ItemEffectSection key={i} index={i} model={model} />)}
        </div>
      </div>
    </SidebarButtons>
  );
});

ItemEffect.propTypes = {
  item: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
};

export {Item};
export default Item;
