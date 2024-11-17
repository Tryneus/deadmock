import classNames from 'classnames';
import {Icon} from './icon';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {SpiritScaling} from './spiritScaling';

import './grid.css';

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

  const rows = data.map((x) => (
    <div className="mock-grid-row">
      {x.map((x) => (
        <div className={classNames('mock-grid-cell', {'mock-grid-cell-spirit-scaling': x.spiritScaling})}>
          {x.spiritScaling ? <SpiritScaling detailed value={x.spiritScaling} /> : null}
          {cellContents(x)}
        </div>
      ))}
    </div>
  ));

  return (
    <div className="mock-grid">
      {rows}
    </div>
  );
};

const GridCellValues = ({values}) => (
  <>
    {values.map(({icon, value, units, stat}) => (
      <div className="mock-grid-cell-line">
        {icon ? <Icon small icon={icon} color="grey" /> : null}
        &nbsp;
        <Value noPos value={value} units={units} />
        <Medium>&nbsp;&nbsp;{stat}</Medium>
      </div>
    ))}
  </>
);

const GridCellValue = ({icon, value, units, stat, noPos}) => (
  <>
    <div className="mock-grid-cell-line">
      {icon ? <Icon small icon={icon} color="grey" /> : null}
      <Value noPos={noPos} value={value} units={units} />
    </div>
    <div className="mock-grid-cell-line">
      <SemiBold bright size={15}>{stat}</SemiBold>
    </div>
  </>
);

const GridCellSpiritDamage = ({value}) => (
  <>
    <div className="mock-grid-cell-line">
      <Icon icon="spirit_damage" color="purple" />
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
      <Icon icon="weapon_damage" color="orange" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div className="mock-grid-cell-line">
      <Bold color="#d49f50" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellConditional = ({icon, value, units, stat, noPos}) => (
  <>
    <div className="mock-grid-cell-line">
      {icon ? <Icon small icon={icon} color="grey" /> : null}
      <Value noPos={noPos} value={value} units={units} />
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
