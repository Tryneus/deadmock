import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableText} from '../Editable';
import {Icon} from '../Icon';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {Bold, SemiBold} from '../Text';


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

const ItemHeader = observer(({model}) => {
  const onChangeName = useAction((x) => (model.name = x), [model]);
  const onChangeTier = useAction(() => (model.tier = model.tier % 4 + 1), [model]);
  const onChangeCategory = useAction(() => {
    const idx = categories.indexOf(model.category) + 1;
    model.category = categories[idx % categories.length];
  }, [model]);

  const onAddComponent = useAction(() => model.addComponent(), [model]);
  const onAddEffect = useAction(() => model.addEffect(), [model]);
  const onAddStat = useAction(() => model.addStat({signed: true}), [model]);

  const renderSidebarButtons = useCallback(() => (
    <>
      <SidebarButton label="Component" onClick={onAddComponent} />
      <SidebarButton label="Effect" onClick={onAddEffect} />
      <SidebarButton label="Stat" onClick={onAddStat} />
    </>
  ), [onAddComponent, onAddEffect, onAddStat]);

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
        <div className="item-bonus">
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

ItemHeader.propTypes = {
  model: PropTypes.object.isRequired,
};

export {ItemHeader};
