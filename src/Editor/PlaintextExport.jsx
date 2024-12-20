import {renameAbilityHeaderStat} from './ExportCommon';

const stripMarkdown = (s) => s.replaceAll(/[*_]/g, '');
const gridValues = (grid) => grid.cells.concat(grid.values);
const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const formatValue = (value) => {
  const sign = value.signed && value.value > 0 ? '+' : '';
  const scaling = value.spiritScaling ? ` (+${value.spiritScaling} x Spirit)` : '';
  const conditional = value.conditional ? ` (Conditional)` : '';
  return `${sign}${value.value}${value.units} ${value.stat}${scaling}${conditional}`;
};

const formatValueList = (list) => {
  return list.length === 0 ? '' : list.map((x) => `* ${formatValue(x)}`).join('\n');
};

const formatDetails = (details) => {
  const sections = details.sections.map((x) => {
    if (x.markdownData) {
      return '\n\n' + stripMarkdown(x.markdownData);
    }
    return '\n\n' + formatValueList(gridValues(x.gridData));
  }).join('');
  return `${stripMarkdown(details.description)}${sections}`
};

const formatItemEffect = (effect) => {
  const cooldown = effect.cooldown !== 0 ? ` (${effect.cooldown}s Cooldown)` : '';
  const details = formatDetails(effect.details);
  return `
${effect.active ? 'Active' : 'Passive'}${cooldown}:
${details}
`.trim();
};

const formatComponents = (names) => {
  const formattedNames = names.join(', ');
  return formattedNames ? `Components: ${formattedNames}\n` : '';
};

const formatItem = (model) => {
  const stats = formatValueList(model.stats);
  const components = formatComponents(model.components);
  const effects = model.effects.map((x) => '\n\n' + formatItemEffect(x)).join('');
  return `
${model.name}
${capitalize(model.category)} Tier ${model.tier}
${components}${model.cost} Souls

${stats}${effects}
`.trim();
};

const formatAbilityStats = (stats) => {
  const result = stats.map(renameAbilityHeaderStat).filter((x) => x).map(formatValue).join(' | ');
  return result ? `${result}\n` : '';
};

const stripWhitespace = (s) => s.replaceAll(/[\r\n\t]+/g, ' ');
const formatAbilityUpgrades = (upgrades) => {
  return upgrades.map((x, i) => `Tier ${i + 1}: ${stripWhitespace(stripMarkdown(x))}`).join('\n');
};

const formatAbility = (model) => {
  const stats = formatAbilityStats(model.stats);
  const details = formatDetails(model.details);
  const upgrades = formatAbilityUpgrades(model.upgrades);
  return `
${model.name}
${stats}${details}

${upgrades}
`.trim();
};

const plaintext = {formatItem, formatAbility};
export {plaintext};
