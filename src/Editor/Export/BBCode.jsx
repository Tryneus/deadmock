import {MarkdownParser} from '/src/Text/MarkdownParser';
import {itemsByName} from '/src/Common';

import {capitalize, gridValues, partitionHeroStats, renameAbilityHeaderStat} from './Common';

const color = (s, c) => (s ? `[COLOR=${c}]${s}[/COLOR]` : '');
const bold = (s) => (s ? `[B]${s}[/B]` : '');
const italic = (s) => (s ? `[I]${s}[/I]` : '');
const indent = (s) => (s ? `[INDENT]${s}[/INDENT]` : '');
const size = (sz, s) => (s ? `[SIZE=${sz}]${s}[/SIZE]` : '');

const generateFormatter = ({orange, purple, green, blue, cyan, grey, red, sanitize}) => {
  const categoryColors = {ability: blue, weapon: orange, vitality: green, spirit: purple};
  const colorByCategory = (s, category) => (categoryColors[category] ? categoryColors[category](s) : s);

  const convertTree = (node, format) => {
    if (node.type === 'document' || node.type === 'paragraph') {
      return node.data.map((x) => convertTree(x, format)).join('');
    } else if (node.type === 'linebreak') {
      return '\n';
    } else if (node.type === 'text') {
      return sanitize(node.data);
    } else if (node.type === 'em') {
      return italic(node.data.map((x) => convertTree(x, format)));
    } else if (node.type === 'strong') {
      return bold(node.data.map((x) => convertTree(x, format)));
    }
    console.error('invalid node type');
  };
  const translateMarkdown = (s) => convertTree(MarkdownParser(s));

  const formatValue = (value) => {
    const sign = value.signed && value.value >= 0 ? '+' : '';
    const scaling =
      value.spiritScaling ? ` (${purple(`+${bold(value.spiritScaling)} x ${bold(`Spirit`)}`)})` :
        value.meleeScaling ? ` (${orange(`+${bold(value.meleeScaling)} x ${bold(`Melee`)}`)})` :
          value.boonScaling ? ` (${cyan(`+${bold(value.boonScaling)} x ${bold(`Boon`)}`)})` :
            '';
    const conditional = value.conditional ? grey(italic(` (Conditional)`)) : '';
    const numberStr = `${grey(sign)}${value.value}${grey(sanitize(value.units))}`;
    return `${bold(numberStr)} ${sanitize(value.stat)}${scaling}${conditional}`;
  };

  const formatValueList = (list) => {
    return list.length === 0 ?
      '' :
      `
[LIST]
${list.map((x) => `[*] ${formatValue(x)}`).join('\n')}
[/LIST]
`.trim();
  };

  const formatDetails = (details) => {
    const sections = details.sections.map((x) => {
      if (x.markdownData) {
        return `\n${translateMarkdown(x.markdownData)}`;
      }
      return `\n${formatValueList(gridValues(x.gridData))}`;
    }).join('');
    return `${translateMarkdown(details.description)}${sections}`;
  };

  const formatItemEffect = (effect) => {
    const cooldown = effect.cooldown !== 0 ? ` (${bold(effect.cooldown)}${bold(grey('s'))} Cooldown)` : '';
    const details = indent(formatDetails(effect.details));
    return `
${bold(effect.active ? 'Active' : 'Passive')}${cooldown}:
${details}
`.trim();
  };

  const formatComponents = (names) => {
    const formattedNames = names.map((x) => (itemsByName[x] ? `${colorByCategory(x, itemsByName[x].category)}` : x)).map(bold).join(', ');
    return formattedNames ? `${bold('Components')}: ${formattedNames}\n` : '';
  };

  const formatItem = (model) => {
    const stats = formatValueList(model.stats);
    const components = formatComponents(model.components);
    const effects = model.effects.map((x) => `\n${indent(formatItemEffect(x))}`).join('');
    return `
${size(5, bold(colorByCategory(sanitize(model.name), model.category)))}
${bold(`${colorByCategory(capitalize(model.category), model.category)} Tier ${model.tier}`)}
${components}${bold(cyan(`§${model.cost} Souls`))}
${stats}${effects}
`.trim();
  };

  const formatAbilityStats = (stats) => {
    const result = stats.map(renameAbilityHeaderStat).filter((x) => x).map(formatValue).join(' | ');
    return result ? `${result}\n` : '';
  };

  const stripWhitespace = (s) => s.replaceAll(/[\r\n\t]+/g, ' ');
  const formatAbilityUpgrades = (upgrades) => {
    return upgrades.map((x, i) => `${bold(`Tier ${i + 1}`)}: ${translateMarkdown(stripWhitespace(x))}`).join('\n');
  };

  const formatAbility = (model) => {
    const stats = formatAbilityStats(model.stats);
    const details = formatDetails(model.details);
    const upgrades = formatAbilityUpgrades(model.upgrades);
    return `
${size(5, bold(blue(sanitize(model.name))))}
${stats}${details}
${upgrades}
`.trim();
  };

  const indentAfterTitle = (s) => {
    const lines = s.split('\n');
    return `${lines[0]}\n${indent(lines.slice(1).join('\n'))}`;
  };

  const formatHero = (model) => {
    const stats = partitionHeroStats(model.statGroups).map((group) =>
      group.map((line) => line.map(formatValue).join(' | ')).join('\n'),
    ).join('\n[HR][/HR]\n');
    const abilities = model.abilities.map((x) => indentAfterTitle(formatAbility(x))).join('\n\n');

    return `
${size(6, bold(red(sanitize(model.name))))}
${italic(sanitize(model.tagline))}

${sanitize(model.description)}

[HR][/HR]
${stats}
[HR][/HR]

${abilities}
`.trim();
  };

  return {formatItem, formatAbility, formatHero};
};

// the simple formatting preserves structure but omits colors and sanitization
const simpleCtx = new Proxy({}, {get: () => (x) => x});

const colorCtx = {
  sanitize: (s) => (s ? `[PLAIN]${s}[/PLAIN]` : ''),
  orange:   (s) => color(s, '#ec981a'),
  purple:   (s) => color(s, '#ce91ff'),
  green:    (s) => color(s, '#7cbb1e'),
  blue:     (s) => color(s, '#3399f3'),
  cyan:     (s) => color(s, '#9affd6'),
  grey:     (s) => color(s, '#aaaaaa'),
  red:      (s) => color(s, '#dd3939'),
};

const bbcodeColor = generateFormatter(colorCtx);
const bbcodeSimple = generateFormatter(simpleCtx);

export {bbcodeColor, bbcodeSimple};
