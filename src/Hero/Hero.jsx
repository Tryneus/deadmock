import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {Scaling} from '/src/Grid';
import {Icon} from '/src/Icon';
import {ImageModalTrigger} from '/src/ImageModal';
import {EditableText, Text} from '/src/Text';
import {EditableValue} from '/src/Value';
import {Abilities} from './Abilities';
import {EditableAbilityIcon} from './AbilityIcon';
import {Portrait} from './Portrait';
import './Hero.css';

const HeroPortrait = observer(({model}) => {
  const onChange = useAction((x) => (model.portrait = x));
  const id = model.portrait;

  return (
    <div className="mock-hero-portrait-frame">
      <ImageModalTrigger image={id} type="portrait" onChange={onChange}>
        <Portrait id={id} />
      </ImageModalTrigger>
    </div>
  );
});

const HeroStat = observer(({model}) => {
  // We don't enable melee scaling here because I don't think there's any use
  // for it at the moment - could easily add it if requested.
  const onToggleScaling = useAction(() => {
    const isUnset = model.spiritScaling === null || model.spiritScaling === undefined;
    model.spiritScaling = isUnset ? 0 : null;
  }, [model]);

  return (
    <div className="mock-hero-stat">
      <div className="mock-hero-stat-position">
        <Scaling detailed model={model} />
        <div className="mock-hero-stat-spirit-scaling-button">
          <Icon color="purple" image="spirit" onMouseDown={onToggleScaling} />
        </div>
      </div>
      <div className="mock-hero-stat-contents">
        <div>
          <Icon color={model.icon.color} image={model.icon.image} />
          <EditableValue model={model} />
        </div>
        <Text>{model.stat}</Text>
      </div>
    </div>
  );
});

const HeroStatGrid = observer(({model}) => (
  <div className="mock-hero-stats-grid">
    <div className="mock-hero-stats-grid-label">
      <Text color={model.color}>{model.label}</Text>
    </div>
    <div className="mock-hero-stats-grid-cells">
      {model.stats.map((x) => <HeroStat key={x.id} index={x.id} model={x} />)}
    </div>
  </div>
));

const Hero = observer(({model, onChangeModel}) => {
  const onChangeName = useAction((x) => {
    // We use an all-caps text transform in CSS that mutates the name, return it to title case
    model.name = x.split(' ').map((s) => s.toLowerCase()).map((s) => `${s[0].toUpperCase()}${s.slice(1)}`).join(' ');
  }, [model]);
  const onChangeTagline = useAction((x) => (model.tagline = x), [model]);
  const onChangeDescription = useAction((x) => (model.description = x), [model]);

  return (
    <div className="mock-hero">
      <div className="mock-hero-top">
        <div className="mock-hero-synopsis">
          <div className="mock-hero-name">
            <EditableText onChange={onChangeName}>{model.name}</EditableText>
          </div>
          <div className="mock-hero-tagline">
            <EditableText onChange={onChangeTagline}>{model.tagline}</EditableText>
          </div>
          <div className="mock-hero-ability-icons">
            {model.abilities.map((x, i) => <EditableAbilityIcon key={i} model={x} number={i + 1} />)}
          </div>
          <div className="mock-hero-description">
            <div>
              <EditableText onChange={onChangeDescription}>{model.description}</EditableText>
            </div>
          </div>
        </div>
        <HeroPortrait model={model} />
      </div>
      <div className="mock-hero-stats">
        {model.statGroups.map((x) => <HeroStatGrid key={x.label} model={x} />)}
      </div>
      <Abilities model={model} onChangeModel={onChangeModel} />
    </div>
  );
});

export {Hero};
