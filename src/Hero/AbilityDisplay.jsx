import {toPng} from 'html-to-image';
import {observer} from 'mobx-react-lite';
import {useContext, useEffect, useRef, useState} from 'preact/hooks';

import {MeasuredDiv, Spinner, isUUID, useAction} from '/src/Common';
import {Icon} from '/src/Icon';
import {ModelStorageContext, examples} from '/src/Serialize';
import {Ability, AbilityModel} from '/src/Ability';
import {AbilityIcon} from './AbilityIcon';
import {AbilityPicker} from './AbilityPicker';

// TODO: dedupe, copied from Editor.jsx
const classBlacklist = [
  'mock-sidebar-buttons',
  'mock-tooltip',
];

const filterClasses = (node) => {
  return !classBlacklist.some((x) => node.classList && node.classList.contains(x));
};

const AbilityDivider = () => {
  return (
    <svg viewBox="0 9 91 170">
      <path
        d="M0 188.8A45 45 0 0130 146.4l30 -10A45 45 0 0089 94A45 45 0 0060 51.6l-30 -10A45 45 0 010 0"
        fill="#221727"
        paintOrder="stroke"
        stroke="#6f5674"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
};

const AbilityGutter = ({id, number, offset, onClick}) => {
  const top = `clamp(0rem, calc(${offset}px - 14.25rem), 6.25rem)`;
  return (
    <div className="mock-hero-ability-gutter" onClick={onClick}>
      <div style={{top}}>
        <div>
          <AbilityDivider />
          <div className="mock-hero-ability-gutter-icon">
            <AbilityIcon id={id} number={number} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AbilityDisplay = observer(({
  foreignModel,
  gutterOffset,
  number,
  onChangeModel,
  onHeight,
}) => {
  const modelStorage = useContext(ModelStorageContext);
  const abilityRef = useRef();
  const [pngData, setPngData] = useState(null);
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const raw = examples[foreignModel.id] || modelStorage.load(foreignModel.id);
    if (!raw) {
      setError(new Error(`no ability found with id: ${foreignModel.id}`));
    } else {
      setModel(new AbilityModel(raw));
    }
  }, [foreignModel.id, setModel, setError, modelStorage]);

  useEffect(() => {
    // Even though we unset transitions, it doesn't seem to be enough to
    // avoid some fading-in of colors - this setTimeout seems to do it
    // though.
    setTimeout(() => {
      if (model && abilityRef.current) {
        const rect = abilityRef.current.getBoundingClientRect();
        const canvasWidth = 1200;
        const canvasHeight = Math.floor(rect.height * canvasWidth / rect.width);
        toPng(abilityRef.current, {filter: filterClasses, canvasWidth, canvasHeight, pixelRatio: 1})
          .then((data) => setPngData(data))
          .catch((err) => console.error('failed to generate ability image', err));
      }
    }, 100);
  }, [abilityRef, model, setPngData]);

  const onClick = useAction(() => {
    if (!isUUID(foreignModel.id)) {
      // This should be a template, set it up as a new model in localStorage
      const raw = examples[foreignModel.id];
      if (!raw) {
        throw new Error(`no example data for ability id: ${foreignModel.id}`);
      }
      const ability = new AbilityModel(raw);
      window.localStorage.setItem(ability.id, JSON.stringify(ability));
      foreignModel.id = ability.id;
    }
    onChangeModel(foreignModel.id);
  }, [foreignModel, onChangeModel]);

  const renderSpinner = () => (
    <MeasuredDiv className="mock-hero-ability-loading" onClick={onClick} onHeight={onHeight}>
      <div>
        {error ? <Icon color="orange" image="error" /> : <Spinner />}
      </div>
    </MeasuredDiv>
  );
  const renderAbility = () => (
    <MeasuredDiv className="mock-hero-ability-display-rendered" onClick={onClick} onHeight={onHeight}>
      <img src={pngData} width="100%" />
    </MeasuredDiv>
  );

  return (
    <div className="mock-hero-ability-display">
      <div inert className="mock-hero-ability-display-hidden">
        <div ref={abilityRef}>
          {model && <Ability model={model} />}
        </div>
      </div>
      <AbilityPicker foreignModel={foreignModel} />
      <AbilityGutter id={foreignModel.image} number={number} offset={gutterOffset} onClick={onClick} />
      {pngData ? renderAbility() : renderSpinner()}
    </div>
  );
});

export {AbilityDisplay};
