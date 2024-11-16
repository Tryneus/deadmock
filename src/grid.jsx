import {Icon} from './icon';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';

import './grid.css';

const Grid = ({data}) => {
  const cellContents = (x) => {
    if (x.type === 'values') {
      return <GridCellValues values={x.values} />;
    } else if (x.type === 'spirit_damage') {
      return <GridCellSpiritDamage value={x.value} />;
    } else if (x.type === 'weapon_damage') {
      return <GridCellWeaponDamage value={x.value} />;
    } else if (x.type === 'conditional') {
      return <GridCellConditional icon={x.icon} value={x.value} units={x.units} stat={x.stat} noPos={x.noPos} />;
    } else {
      return 'undefined';
    }
  };

  const rows = data.map((x) => (
    <div className="mock-grid-row">
      {x.map((x) => (
        <div className="mock-grid-cell">
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
    {values.map((x) => (
      <div>
        <Value noPos value={x.value} units={x.units} />
        <Medium>{' ' + x.stat}</Medium>
      </div>
    ))}
  </>
);

const GridCellSpiritDamage = ({value}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon icon="spirit_damage_colored" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div>
      <Bold color="#c78bf7" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellWeaponDamage = ({value}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon icon="weapon_damage_colored" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div>
      <Bold color="#d49f50" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellConditional = ({icon, value, units, stat, noPos}) => (
  <>
    <div>
      <Icon small icon={icon} />
      <Value noPos={noPos} value={value} units={units} />
    </div>
    <div>
      <SemiBold bright size={15}>{stat}</SemiBold>
    </div>
    <div>
      <SemiBold italic muted size={15}>Conditional</SemiBold>
    </div>
  </>
);

export {Grid};
export default Grid;
