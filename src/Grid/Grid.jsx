import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {EditableIcon, EditableText, StylePicker, TooltipContainer} from '../Editable';
import {Icon} from '../Icon';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {SemiBold, Text} from '../Text';
import {EditableValue} from '../Value';
import {SpiritScaling} from './SpiritScaling';

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
  }, [cell]);

  const onConditional = useAction(() => (cell.conditional = !cell.conditional), [cell]);

  const renderStylePicker = useCallback(() => <StylePicker model={cell} />, [cell]);

  return (
    <div className="mock-grid-cell-hover-buttons">
      <div>
        <Icon color="red" image="cancel" onClick={onDelete} />
        <TooltipContainer click direction="up" renderTooltip={renderStylePicker}>
          <Icon color="white" image="font" />
        </TooltipContainer>
        <Icon color="purple" image="spirit" onClick={onSpiritScaling} />
        <Icon color="white" image="hourglass-half" onClick={onConditional} />
      </div>
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
    <div className="mock-grid-cell-values-item">
      <Deleteable onClick={onDelete}>
        <span className="mock-grid-cell-values-value">
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
        <EditableIcon model={model.icon} />
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
