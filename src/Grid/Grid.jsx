import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {useAction} from '/src/Common';
import {Deleteable} from '/src/Deleteable';
import {EditableIcon, Icon} from '/src/Icon';
import {SidebarButton, SidebarButtons} from '/src/SidebarButtons';
import {StylePicker} from '/src/StylePicker';
import {EditableText, SemiBold, Text} from '/src/Text';
import {TooltipContainer} from '/src/Tooltip';
import {EditableValue} from '/src/Value';

import {Scaling} from './Scaling';
import './Grid.css';

const Grid = observer(({data, onEmpty}) => {
  const onAddCell = useAction(() => data.addCell(), [data]);
  const onAddValue = useAction(() => data.addValue(), [data]);

  const renderSidebarButtons = () => (
    <>
      <SidebarButton label="Cell" onClick={onAddCell} />
      <SidebarButton label="Value" onClick={onAddValue} />
    </>
  );

  const cells = data.cells.map((cell, i) => (
    <div key={i} className="mock-grid-cell">
      <div className="mock-grid-cell-position">
        <Scaling detailed model={cell} />
        <GridCellHoverButtons data={data} model={cell} onEmpty={onEmpty} />
      </div>
      <div className="mock-grid-cell-contents">
        <GridCellValue model={cell} />
      </div>
    </div>
  ));

  const values = data.values.length === 0 ?
    null :
    (
      <div className="mock-grid-values-cell">
        {data.values.map((value, i) =>
          <GridCellValuesItem key={i} index={i} model={data} onEmpty={onEmpty} />,
        )}
      </div>
    );

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-grid">
        {cells}
        {values}
      </div>
    </SidebarButtons>
  );
});

const GridCellHoverButtons = observer(({data, model, onEmpty}) => {
  const onDelete = useAction(() => {
    const index = data.cells.indexOf(model);
    if (index === -1) {
      console.error('grid cell not found', model);
    } else {
      data.removeCell(index);
      if (onEmpty && data.cells.length === 0 && data.values.length === 0) {
        onEmpty();
      }
    }
  }, [data, model, onEmpty]);

  const onSwitchScaling = useAction(() => {
    if (model.spiritScaling !== null && model.spiritScaling !== undefined) {
      model.spiritScaling = null;
      model.meleeScaling = 0;
    } else if (model.meleeScaling !== null && model.meleeScaling !== undefined) {
      model.meleeScaling = null;
      model.boonScaling = 0;
    } else if (model.boonScaling !== null && model.boonScaling !== undefined) {
      model.boonScaling = null;
    } else {
      model.spiritScaling = 0;
    }
  }, [model]);

  const onConditional = useAction(() => (model.conditional = !model.conditional), [model]);

  const renderStylePicker = useCallback(() => <StylePicker model={model} />, [model]);

  return (
    <div className="mock-grid-cell-hover-buttons">
      <Icon color="red" image="cancel" onMouseDown={onDelete} />
      <TooltipContainer click direction="up" renderTooltip={renderStylePicker}>
        <Icon color="white" image="font" />
      </TooltipContainer>
      <Icon color="purple" image="spirit" onMouseDown={onSwitchScaling} />
      <Icon color="white" image="hourglass_half" onMouseDown={onConditional} />
    </div>
  );
});

const GridCellValuesItem = observer(({model, index, onEmpty}) => {
  const value = model.values[index];
  const onChange = useAction((x) => (value.stat = x), [value]);
  const onDelete = useAction(() => {
    model.removeValue(index);
    if (model.cells.length === 0 && model.values.length === 0) {
      onEmpty();
    }
  }, [index, model, onEmpty]);

  return (
    <div className="mock-grid-values-cell-item">
      <Deleteable onMouseDown={onDelete}>
        <span className="mock-grid-values-cell-value">
          <EditableIcon model={value.icon} />
          <EditableValue model={value} />
        </span>
        <EditableText onChange={onChange}>
          <Text>{value.stat}</Text>
        </EditableText>
      </Deleteable>
    </div>
  );
});

const GridCellValue = observer(({model}) => {
  const onChange = useAction((x) => (model.stat = x), [model]);
  return (
    <>
      <div className="mock-grid-cell-value">
        <EditableIcon resize model={model.icon} />
        <EditableValue model={model} />
      </div>
      <EditableText onChange={onChange}>
        <Text color={model.color || 'bright'} weight={model.weight || 600}>
          {model.stat}
        </Text>
      </EditableText>
      {model.conditional ? <SemiBold italic color="muted">Conditional</SemiBold> : null}
    </>
  );
});

export {Grid};
