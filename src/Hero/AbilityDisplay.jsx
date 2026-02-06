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
    <svg viewBox="0 0 415 230">
        <path stroke="#6d5572" fill="#27192c" stroke-width="6" d="M0 80 L150 80 A95 95 0 0 0 229.3 44.3 A100 100 0 0 1 400 115 A100 100 0 0 1 229.3 185.7 A95 95 0 0 0 150 150 L0 150"></path>
    </svg>
  );
};

const AbilityGutter = ({id, number, offset, onClick}) => {
  return (
    <div className="mock-hero-ability-gutter" onClick={onClick}>
      <div>
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
