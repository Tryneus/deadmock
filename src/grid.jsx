import classNames from 'classnames';
import {Icon} from './icon';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {SpiritScaling} from './spiritScaling';

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

const Grid = ({data}) => {
  const cellContents = (x) => {
    if (x.type === 'values') {
      return <GridCellValues values={x.values} />;
    } else {
      return <GridCellValue {...x} />;
    }
  };

  const renderSpiritScaling = (spiritScaling, children) => {
    if (spiritScaling === undefined) {
      return children;
    }
    return (
      <div>
        <SpiritScaling detailed value={spiritScaling} />
        {children}
      </div>
    );
  };

  const cells = partitionCells(data.cells, data.values).map((row) => (
    <div className="mock-grid-row">
      {row.map((cell) => {
        const classes = classNames('mock-grid-cell', {
          'mock-grid-cell-values': cell.type === 'values',
          'mock-grid-cell-spirit-scaling': cell.spiritScaling,
        });
        const renderedCell = (
          <div className={classes}>
            {cellContents(cell)}
          </div>
        );
        return renderSpiritScaling(cell.spiritScaling, renderedCell);
      })}
    </div>
  ));

  return (
    <div className="mock-grid">
      {cells}
    </div>
  );
};

const renderIcon = (iconProps) => {
  const props = {color: 'grey', ...iconProps};
  if (!iconProps) {
    return null;
  }
  return (
    <>
      <Icon size={18} {...props} />
      &nbsp;
    </>
  );
};

const GridCellValues = ({values}) => {
  return (
    <>
      {values.map(({icon, value, units, stat, signed}) => (
        <div className="mock-grid-cell-values-item">
          {renderIcon(icon)}
          <Value signed={signed} value={value} units={units} />
          &nbsp;&nbsp;
          <Medium bright size={15}>{stat}</Medium>
        </div>
      ))}
    </>
  );
};

const colors = {
  purple: '#c78bf7',
  orange: '#d49f50',
};

const GridCellValue = ({icon, value, units, stat, signed, conditional, color}) => {
  return (
    <>
      <div className="mock-grid-cell-line">
        {renderIcon(icon)}
        <Value size={20} signed={signed} value={value} units={units} />
      </div>
      <SemiBold bright color={colors[color]} size={15}>{stat}</SemiBold>
      {conditional ? <SemiBold italic muted size={15}>Conditional</SemiBold>: null}
    </>
  );
};

export {Grid};
export default Grid;
