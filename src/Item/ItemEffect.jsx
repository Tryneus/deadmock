import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {isString, useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {EditableMarkdown, EditableText} from '../Editable';
import {Grid} from '../Grid';
import {Icon} from '../Icon';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {Bold, SemiBold, Text} from '../Text';

// TODO: almost identical to AbilitySection, any way to abstract these?
const ItemEffectSection = observer(({model, index}) => {
  const value = model.sections[index];

  // onChange is only used for markdown sections, as the grid is given its own model for updating
  const onDelete = useAction(() => model.removeSection(index), [index, model]);
  const onChangeMarkdown = useAction((x) => {
    if (x.length === 0) {
      onDelete();
    } else {
      model.sections[index] = x;
    }
  }, [model, index, onDelete]);

  if (isString(value)) {
    return (
      <div className="mock-item-effect-markdown">
        <EditableMarkdown text={value} onChange={onChangeMarkdown} />
      </div>
    );
  }
  return <Grid data={value} onEmpty={onDelete} />;
});

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
  const onChangeDescription = useAction((x) => (model.description = x), [model]);

  const onAddMarkdown = useAction(() => model.addMarkdownSection(), [model]);
  const onAddGrid = useAction(() => model.addGridSection(), [model]);

  const onDelete = useAction(() => {
    const index = item.effects.indexOf(model);
    if (index === -1) {
      console.error('item effect not found', model);
    } else {
      item.removeEffect(index);
    }
  }, [item, model]);

  const effectType = model.active ?
    <Bold color="bright">Active</Bold> :
    <SemiBold italic>Passive</SemiBold>;

  const renderCooldown = () => {
    const classes = classNames('mock-item-effect-cooldown', {'mock-item-effect-no-cooldown': !model.cooldown});
    return (
      <div className={classes}>
        <Icon image="stat/cooldown" />
        <EditableText onChange={onChangeCooldown}>
          <Text color="bright">{model.cooldown || 0}</Text>
        </EditableText>
        <Bold>
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

  const headerClasses = classNames('mock-item-effect-header', {
    'mock-item-effect-header-active': model.active,
  });

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-item-effect">
        <div className={headerClasses}>
          <Deleteable onClick={onDelete}>
            <span className="mock-item-effect-type" onClick={onChangeActive}>
              {effectType}
            </span>
          </Deleteable>
          {renderCooldown()}
        </div>
        <div className="mock-item-effect-body">
          <div className="mock-item-effect-markdown">
            <EditableMarkdown text={model.description} onChange={onChangeDescription} />
          </div>
          {model.sections.map((x, i) => <ItemEffectSection key={i} index={i} model={model} />)}
        </div>
      </div>
    </SidebarButtons>
  );
});

export {ItemEffect};
