import {observer} from 'mobx-react-lite';

import {useAction} from '../Common';
import {EditableMarkdown} from '../Text';
import {AbilityHeader} from './AbilityHeader';
import {AbilitySection} from './AbilitySection';
import {AbilityUpgrade} from './AbilityUpgrade';

import './Ability.css';

const Ability = observer(({model}) => {
  const onChange = useAction((x) => (model.description = x), [model]);
  return (
    <div className="mock-ability">
      <AbilityHeader model={model} />
      <div className="mock-ability-body-background">
        <div className="mock-ability-body-noise" />
        <div className="mock-ability-body">
          <div className="mock-ability-markdown">
            <EditableMarkdown text={model.description} onChange={onChange} />
          </div>
          {model.sections.map((x, i) => <AbilitySection key={i} index={i} model={model} />)}
          <div className="mock-ability-upgrades">
            {model.upgrades.map((x, i) => <AbilityUpgrade key={i} model={model} tier={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
});

export {Ability};
