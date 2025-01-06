import {deepCopy} from '/src/Common';

const gridValues = (grid) => grid.cells.concat(grid.values || []);
const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

// The Editor doesn't make it possible to specify the stat name for header
// stats, so (aside from the hard-coded ones like cooldown and charges),
// attempt a best-guess at what they are.  Omit any not specified because it
// would look dumb.
const iconToStatName = {
  'stat/cooldown':                'Cooldown',
  'stat/charge':                  'Charges',
  'stat/charge_cooldown':         'Charge Cooldown',
  'stat/duration':                'Duration',
  'stat/range':                   'Range',
  'stat/aoe':                     'Area of Effect',
};

const renameAbilityHeaderStat = (stat) => {
  if (!iconToStatName[stat.icon.image]) {
    return null;
  }

  const newValue = deepCopy(stat);
  newValue.stat = iconToStatName[stat.icon.image];
  if (newValue.stat === 'Charges' && newValue.value === 1) {
    newValue.stat = 'Charge';
  }
  return newValue;
};

const groupPartitions = {
  weapon:   (stats) => [stats.slice(0, 4), stats.slice(4)],
  vitality: (stats) => [stats.slice(0, 2), stats.slice(2, 4), stats.slice(4)],
};

const partitionHeroStats = (statGroups) => {
  return statGroups.map((group) => groupPartitions[group.label.toLowerCase()](group.stats));
};

export {
  capitalize,
  gridValues,
  partitionHeroStats,
  renameAbilityHeaderStat,
};
