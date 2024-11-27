import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import {EditableIcon, EditableText, StylePicker, TooltipContainer} from './EditableText';
import {useAction} from './common';
import {Icon} from './icon';
import {SpiritScaling} from './spiritScaling';
import {SemiBold, Text} from './text';
import {Value} from './value';

import './grid.css';


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

const Grid = observer(({data}) => {
  const cellContents = (x) => {
    if (x.type === 'values') {
      return <>{x.values.map((model, i) => <GridCellValuesItem key={i} model={data} index={i} />)}</>;
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
              <GridCellHoverButtons data={data} cell={cell} />
              <div className={classes}>
                {cellContents(cell)}
              </div>
            </div>
          </SpiritScalingContainer>
        );
      })}
    </div>
  ));

  return (
    <div className="mock-grid">
      {cells}
    </div>
  );
});

const GridCellHoverButtons = observer(({data, cell}) => {
  if (cell.type === 'values') {
    return null;
  }

  const onDelete = useAction(() => {
    const index = data.cells.indexOf(cell);
    if (index === -1) {
      console.error('grid cell not found', cell);
    } else {
      data.removeCell(index);
    }
  });

  const onSpiritScaling = useAction(() => {
    if (cell.spiritScaling === null || cell.spiritScaling === undefined) {
      cell.spiritScaling = 0;
    } else {
      cell.spiritScaling = null;
    }
  });

  const renderStylePicker = useCallback(() => <StylePicker model={cell} />);

  return (
    <div className="mock-grid-cell-hover-buttons">
      <Icon color="red" image="cancel" size={12} onClick={onDelete} />
      <TooltipContainer click direction="up" renderTooltip={renderStylePicker}>
        <Icon color="grey" image="text_style" size={12} />
      </TooltipContainer>
      <Icon color="purple" image="spirit" size={12} onClick={onSpiritScaling} />
    </div>
  );
});

const GridCellValuesItem = observer(({model, index}) => {
  const value = model.values[index];
  const onChange = useAction((x) => (value.stat = x), [value]);
  const onDelete = useAction(() => model.removeValue(index), [model, index]);

  return (
    <div className="mock-grid-cell-values-item">
      <EditableIcon model={value.icon} />
      &nbsp;
      <Value model={value} />
      &nbsp;&nbsp;
      <EditableText size={15} onChange={onChange}>
        <Text bright>{value.stat}</Text>
      </EditableText>
      <div className="mock-grid-cell-values-item-delete">
        <Icon color="red" image="cancel" size={12} onClick={onDelete} />
      </div>
    </div>
  );
});

const colors = {
  bright: '#ffefd7',
  normal: '#c8c6ca',
  muted:  '#968291',
  purple: '#c78bf7',
  orange: '#d49f50',
};

const GridCellValue = observer(({model}) => {
  const onChange = useAction((x) => (model.stat = x), [model]);
  return (
    <>
      <div className="mock-grid-cell-line">
        <EditableIcon model={model.icon} />
        &nbsp;
        <Value model={model} />
      </div>
      <EditableText color={colors[model.color || 'bright']} weight={model.weight} size={15} onChange={onChange}>
        {model.stat}
      </EditableText>
      {model.conditional ? <SemiBold italic muted size={15}>Conditional</SemiBold> : null}
    </>
  );
});

export {Grid};
export default Grid;
