import {observer} from 'mobx-react-lite';

import {AnimatedDiv} from '../Animated';
import {useAction} from '../Common';
import {Details} from '../Details';
import {EditableMarkdown} from '../Text';
import {AbilityHeader} from './AbilityHeader';
import {AbilityUpgrade} from './AbilityUpgrade';

import './Ability.css';

const Ability = observer(({model}) => {
  const onChange = useAction((x) => (model.description = x), [model]);
  const onMove = useAction((mutation) => mutation(model.sections));

  return (
    <div className="mock-ability">
      <AnimatedDiv className="mock-ability-header-animated">
        <AbilityHeader model={model} />
      </AnimatedDiv>
      <div className="mock-ability-body-background">
        <div className="mock-ability-body-noise" />
        <div className="mock-ability-body">
          <AnimatedDiv>
            <Details model={model} />
          </AnimatedDiv>
          <AnimatedDiv className="mock-ability-upgrades-animated">
            <div className="mock-ability-upgrades">
              {model.upgrades.map((x, i) => <AbilityUpgrade key={i} model={model} tier={i} />)}
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </div>
  );
});

export {Ability};
