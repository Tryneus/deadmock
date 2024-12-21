import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {Icon} from '/src/Icon';
import {Bold, EditableMarkdown} from '/src/Text';

const tierCosts = [1, 2, 5];

const upgradeMarkdownFormat = {
  text:     {},
  strong:   {weight: 700, color: 'bright'},
  emphasis: {weight: 500, color: 'muted', italic: true},
};

const AbilityUpgrade = observer(({active, model, tier}) => {
  const classes = classNames('mock-ability-upgrade', {
    'mock-ability-upgrade-inactive': !active,
  });

  const onChange = useAction((x) => (model.upgrades[tier] = x), [model, tier]);

  return (
    <div className={classes}>
      <div className="mock-ability-upgrade-cost">
        <Icon color="purple" image="stat/ability_point" />
        <Bold>{tierCosts[tier]}</Bold>
      </div>
      <div className="mock-ability-upgrade-text">
        <EditableMarkdown format={upgradeMarkdownFormat} text={model.upgrades[tier]} onChange={onChange} />
      </div>
    </div>
  );
});

export {AbilityUpgrade};
