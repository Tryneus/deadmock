import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {AnimatedDiv} from '/src/Animated';
import {Details} from '/src/Details';

import {AbilityCard} from './AbilityCard';
import {AbilityHeader} from './AbilityHeader';
import {AbilityUpgrade} from './AbilityUpgrade';
import './Ability.css';

const Ability = observer(({model}) => {
  return (
    <div className="mock-ability">
      <AbilityCard />
      <AnimatedDiv className="mock-ability-header-animated">
        <AbilityHeader model={model} />
      </AnimatedDiv>
      <div className="mock-ability-body">
        <AnimatedDiv>
          <Details model={model.details} />
        </AnimatedDiv>
        <AnimatedDiv className="mock-ability-upgrades-animated">
          <div className="mock-ability-upgrades">
            {model.upgrades.map((x, i) => <AbilityUpgrade key={i} model={model} tier={i} />)}
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
});

export {Ability};
