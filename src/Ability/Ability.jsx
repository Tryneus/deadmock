import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableMarkdown} from '../Editable';
import {Grid} from '../Grid';
import {Text} from '../Text';
import {AbilityHeader} from './AbilityHeader';
import {AbilityUpgrade} from './AbilityUpgrade';

import './Ability.css';

const descriptionMarkdownFormat = {
  text: {
    Component: Text,
    props:     {color: 'bright'},
  },
  strong: {
    Component: Text,
    props:     {weight: 700, color: 'bright'},
  },
  emphasis: {
    Component: Text,
    props:     {weight: 500, italic: true, color: 'muted'},
  },
};

const Ability = observer(({model}) => {
  const onChange = useAction((x) => (model.description = x), [model]);
  return (
    <div className="mock-ability">
      <AbilityHeader model={model} />
      <div className="mock-ability-body">
        <div className="mock-ability-markdown">
          <EditableMarkdown format={descriptionMarkdownFormat} text={model.description} onChange={onChange} />
        </div>
        <Grid data={model.grid} />
        <div className="mock-ability-upgrades">
          {model.upgrades.map((x, i) => <AbilityUpgrade key={i} model={model} tier={i} />)}
        </div>
      </div>
    </div>
  );
});

Ability.propTypes = {
  model: PropTypes.object.isRequired,
};

export {Ability};
