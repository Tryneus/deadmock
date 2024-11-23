import classNames from 'classnames';
import {action} from 'mobx';
import {useCallback} from 'preact/hooks';
import {observer} from 'mobx-react-lite';
import {Icon} from './icon';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {SpiritScaling} from './spiritScaling';
import {EditableText, EditableIcon} from './EditableText';

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

  if (values) {
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
  const onChange = useCallback(action((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.spiritScaling = newValue;
    }
  }));

  if (!model.spiritScaling) {
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
      return <>{x.values.map((model) => <GridCellValuesItem model={model} />)}</>
    } else {
      return <GridCellValue model={x} />;
    }
  };

  const cells = partitionCells(data.cells, data.values).map((row) => (
    <div className="mock-grid-row">
      {row.map((cell) => {
        const classes = classNames('mock-grid-cell', {
          'mock-grid-cell-values': cell.type === 'values',
        });
        return (
          <SpiritScalingContainer model={cell}>
            <div className={classes}>
              {cellContents(cell)}
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

const GridCellValuesItem = observer(({model}) => {
  const onChange = useCallback(action((x) => model.stat = x));

  return (
    <div className="mock-grid-cell-values-item">
      <EditableIcon model={model.icon} />
      <Value model={model} />
      &nbsp;&nbsp;
      <EditableText size={15} onChange={onChange}>
        <Text bright>{model.stat}</Text>
      </EditableText>
    </div>
  );
});

const colors = {
  purple: '#c78bf7',
  orange: '#d49f50',
};

const GridCellValue = observer(({model}) => {
  const onChange = useCallback(action((x) => model.stat = x));
  return (
    <>
      <div className="mock-grid-cell-line">
        <EditableIcon model={model.icon} />
        <Value model={model} />
      </div>
      <EditableText color={colors[model.color || 'bright']} size={15} onChange={onChange}>
        {model.stat}
      </EditableText>
      {model.conditional ? <SemiBold italic muted size={15}>Conditional</SemiBold>: null}
    </>
  );
});

export {Grid};
export default Grid;
