import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableMarkdown} from '../Editable';
import {Icon} from '../Icon';
import {Bold, Text} from '../Text';

const tierCosts = [1, 2, 5];

const upgradeMarkdownFormat = {
  text: {
    Component: Text,
    props:     {weight: 600, size: 17},
  },
  strong: {
    Component: Text,
    props:     {weight: 700, size: 22, color: 'bright'},
  },
  emphasis: {
    Component: Text,
    props:     {weight: 500, italic: true, color: 'muted'},
  },
};

const AbilityUpgrade = observer(({active, model, tier}) => {
  const classes = classNames('mock-ability-upgrade', {
    'mock-ability-upgrade-inactive': !active,
  });

  const onChange = useAction((x) => (model.upgrades[tier] = x), [model, tier]);

  return (
    <div className={classes}>
      <div className="mock-ability-upgrade-cost">
        <Icon color="purple" image="stat/ability_point" size={14} />
        &nbsp;
        <Bold>{tierCosts[tier]}</Bold>
      </div>
      <div className="mock-ability-upgrade-text">
        <EditableMarkdown format={upgradeMarkdownFormat} text={model.upgrades[tier]} onChange={onChange} />
      </div>
    </div>
  );
});

AbilityUpgrade.propTypes = {
  model: PropTypes.object.isRequired,
};

export {AbilityUpgrade};
