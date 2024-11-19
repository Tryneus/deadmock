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
    } else if (x.type === 'value') {
      return <GridCellValue {...x} />;
    } else if (x.type === 'spirit_damage') {
      return <GridCellSpiritDamage value={x.value} />;
    } else if (x.type === 'weapon_damage') {
      return <GridCellWeaponDamage value={x.value} />;
    } else if (x.type === 'conditional') {
      return <GridCellConditional {...x} />;
    } else {
      return 'undefined';
    }
  };

  const cells = partitionCells(data.cells, data.values).map((row) => (
    <div className="mock-grid-row">
      {row.map((cell) => {
        const classes = classNames('mock-grid-cell', {
          'mock-grid-cell-spirit-scaling': cell.spiritScaling,
          'mock-grid-cell-values': cell.type === 'values',
        });
        return (
          <div className={classes}>
            {cell.spiritScaling ? <SpiritScaling detailed value={cell.spiritScaling} /> : null}
            {cellContents(cell)}
          </div>
        );
      })}
    </div>
  ));

  return (
    <div className="mock-grid">
      {cells}
    </div>
  );
};

const renderIcon = (icon) => {
  if (!icon) {
    return null;
  }
  return (
    <>
      <Icon size={18} icon={icon} color="grey" />
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

const GridCellValue = ({icon, value, units, stat, signed}) => (
  <>
    <div className="mock-grid-cell-line">
      {renderIcon(icon)}
      <Value signed={signed} value={value} units={units} />
    </div>
    <div className="mock-grid-cell-line">
      <SemiBold bright size={15}>{stat}</SemiBold>
    </div>
  </>
);

const GridCellSpiritDamage = ({value}) => (
  <>
    <div className="mock-grid-cell-line">
      <Icon size={18} icon="spirit_damage" color="purple" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div className="mock-grid-cell-line">
      <Bold color="#c78bf7" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellWeaponDamage = ({value}) => (
  <>
    <div className="mock-grid-cell-line">
      <Icon size={18} icon="weapon_damage" color="orange" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div className="mock-grid-cell-line">
      <Bold color="#d49f50" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellConditional = ({icon, value, units, stat, signed}) => (
  <>
    <div className="mock-grid-cell-line">
      {renderIcon(icon)}
      <Value signed={signed} value={value} units={units} />
    </div>
    <div className="mock-grid-cell-line">
      <SemiBold bright size={15}>{stat}</SemiBold>
    </div>
    <div className="mock-grid-cell-line">
      <SemiBold italic muted size={15}>Conditional</SemiBold>
    </div>
  </>
);

export {Grid};
export default Grid;
