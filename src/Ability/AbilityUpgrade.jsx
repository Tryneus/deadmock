import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {Icon} from '/src/Icon';
import {Bold, EditableMarkdown} from '/src/Text';

const tierCosts = [1, 2, 5];

const valueRegex = /^[+-]?\*?\*?[+-]?[0-9.]+\s*[A-z/%]*\*?\*?\n[A-z ]+$/;

const upgradeMarkdownFormat = {
  text:     {},
  strong:   {weight: 700},
  emphasis: {weight: 500, color: 'muted', italic: true},
};

const upgradeValueMarkdownFormat = {
  text:     {},
  strong:   {weight: 700, color: 'bright'},
  emphasis: {weight: 500, color: 'muted', italic: true},
};

const AbilityUpgrade = observer(({active, model, tier}) => {
  const classes = classNames('mock-ability-upgrade', {
    'mock-ability-upgrade-inactive': !active,
  });

  const onChange = useAction((x) => (model.upgrades[tier] = x), [model, tier]);

  // If the markdown is just a value, the styling is slightly different
  const isValue = Boolean(model.upgrades[tier].match(valueRegex));
  const markdownFormat = isValue ? upgradeValueMarkdownFormat : upgradeMarkdownFormat;
  const textClasses = classNames('mock-ability-upgrade-text', {'mock-ability-upgrade-value': isValue});

  return (
    <div className={classes}>
      <div className="mock-ability-upgrade-cost">
        <Icon color="purple" image="stat/ability_point" />
        <Bold>{tierCosts[tier]}</Bold>
      </div>
      <div className={textClasses}>
        <EditableMarkdown format={markdownFormat} text={model.upgrades[tier]} onChange={onChange} />
      </div>
    </div>
  );
});

export {AbilityUpgrade};
