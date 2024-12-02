import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {useAction} from '../Common';
import {EditableIcon, EditableText, StylePicker, TooltipContainer} from '../Editable';
import {Icon} from '../Icon';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {SpiritScaling} from './SpiritScaling';
import {SemiBold, Text} from '../Text';
import {Value} from '../Value';

import './Grid.css';


// Partition the cells such that:
// A 'values' cell goes on its own row at the end unless there is only one other cell
// The other cells are arranged so that no row has less than two or more than three cells
// There is probably a simpler way of doing this
const partitionCells = (cells, values) => {
  const rows = [];

  let idx = 0;
  while (idx < cells.length) {
    const remainder = cells.length - idx;
    if (remainder < 4) {
      rows.push(cells.slice(idx, cells.length));
    } else if (remainder === 4) {
      rows.push(cells.slice(idx, idx + 2));
    } else {
      rows.push(cells.slice(idx, idx + 3));
    }
    idx += rows[rows.length - 1].length;
  }

  if (values.length > 0) {
    const valuesCell = {type: 'values', values};
    if (cells.length === 1) {
      rows[0].push(valuesCell);
    } else {
      rows.push([valuesCell]);
    }
  }
  return rows;
};

const SpiritScalingContainer = observer(({model, children}) => {
  const onChange = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.spiritScaling = newValue;
    }
  }, [model]);

  if (model.spiritScaling === null || model.spiritScaling === undefined) {
    return children;
  }

  return (
    <div>
      <SpiritScaling detailed value={model.spiritScaling} onChange={onChange} />
      {children}
    </div>
  );
});

const Grid = observer(({data, onEmpty}) => {
  const onAddCell = useAction(() => data.addCell(), [data]);
  const onAddValue = useAction(() => data.addValue(), [data]);

  const renderSidebarButtons = () => (
    <>
      <SidebarButton label="Cell" onClick={onAddCell} />
      <SidebarButton label="Value" onClick={onAddValue} />
    </>
  );

  const cellContents = (x) => {
    if (x.type === 'values') {
      return <>{x.values.map((model, i) => <GridCellValuesItem key={i} index={i} model={data} onEmpty={onEmpty} />)}</>;
    }
    return <GridCellValue model={x} />;
  };

  const cells = partitionCells(data.cells, data.values).map((row, i) => (
    <div key={i} className="mock-grid-row">
      {row.map((cell, j) => {
        const classes = classNames('mock-grid-cell', {
          'mock-grid-cell-values': cell.type === 'values',
        });
        return (
          <SpiritScalingContainer key={j} model={cell}>
            <div className="mock-grid-cell-container">
              <div className={classes}>
                {cellContents(cell)}
              </div>
              <GridCellHoverButtons cell={cell} data={data} onEmpty={onEmpty} />
            </div>
          </SpiritScalingContainer>
        );
      })}
    </div>
  ));

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-grid">
        {cells}
      </div>
    </SidebarButtons>
  );
});

const GridCellHoverButtons = observer(({data, cell, onEmpty}) => {
  if (cell.type === 'values') {
    return null;
  }

  const onDelete = useAction(() => {
    const index = data.cells.indexOf(cell);
    if (index === -1) {
      console.error('grid cell not found', cell);
    } else {
      data.removeCell(index);
      if (onEmpty && data.cells.length === 0 && data.values.length === 0) {
        onEmpty();
      }
    }
  }, [data, cell, onEmpty]);

  const onSpiritScaling = useAction(() => {
    if (cell.spiritScaling === null || cell.spiritScaling === undefined) {
      cell.spiritScaling = 0;
    } else {
      cell.spiritScaling = null;
    }
  });

  const onConditional = useAction(() => (cell.conditional = !cell.conditional), [cell]);

  const renderStylePicker = useCallback(() => <StylePicker model={cell} />, [cell]);

  return (
    <div className="mock-grid-cell-hover-buttons">
      <div>
        <Icon color="red" image="cancel" size={12} onClick={onDelete} />
        <TooltipContainer click direction="up" renderTooltip={renderStylePicker}>
          <Icon color="grey" image="text_style" size={12} />
        </TooltipContainer>
        <Icon color="purple" image="spirit" size={12} onClick={onSpiritScaling} />
        <Icon color="grey" image="therefore" size={12} onClick={onConditional} />
      </div>
    </div>
  );
});

const GridCellValuesItem = observer(({model, index, onEmpty}) => {
  const value = model.values[index];
  const onChange = useAction((x) => (value.stat = x), [value]);
  const onDelete = useAction(() => {
    model.removeValue(index), [model, index];
    if (model.cells.length === 0 && model.values.length === 0) {
      onEmpty();
    }
  });

  return (
    <div className="mock-grid-cell-values-item">
      <EditableIcon model={value.icon} />
      &nbsp;
      <Value model={value} />
      &nbsp;&nbsp;
      <EditableText size={15} onChange={onChange}>
        <Text color="bright">{value.stat}</Text>
      </EditableText>
      <div className="mock-grid-cell-values-item-delete">
        <Icon color="red" image="cancel" size={12} onClick={onDelete} />
      </div>
    </div>
  );
});

const GridCellValue = observer(({model}) => {
  const onChange = useAction((x) => (model.stat = x), [model]);
  return (
    <>
      <div className="mock-grid-cell-line">
        <EditableIcon model={model.icon} />
        &nbsp;
        <Value model={model} />
      </div>
      <EditableText color={model.color || 'bright'} size={15} weight={model.weight} onChange={onChange}>
        {model.stat}
      </EditableText>
      {model.conditional ? <SemiBold italic color="muted" size={15}>Conditional</SemiBold> : null}
    </>
  );
});

export {Grid};
