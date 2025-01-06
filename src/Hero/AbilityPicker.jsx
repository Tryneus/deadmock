import {observer} from 'mobx-react-lite';
import {useCallback, useContext, useRef, useState} from 'preact/hooks';

import {AbilityModel} from '/src/Ability';
import {prettyTimeDelta, useAction, useClickOutside, useNow} from '/src/Common';
import {Icon} from '/src/Icon';
import {ModelStorageContext, examples} from '/src/Serialize';

const AbilityPickerNew = ({onChange}) => {
  const modelStorage = useContext(ModelStorageContext);

  const onClick = useCallback(() => {
    const ability = new AbilityModel(examples.Tornado);
    modelStorage.save(ability);
    onChange(ability.id);
  }, [onChange, modelStorage]);

  return (
    <div onClick={onClick}>
      <span>Ability</span>
      <span>New</span>
    </div>
  );
};

const AbilityPickerEntry = ({id, name, timestamp, onChange}) => {
  const onClick = useCallback(() => onChange(id), [id, onChange]);
  const now = useNow();

  return (
    <div onClick={onClick}>
      <span>{name}</span>
      <span>{prettyTimeDelta(timestamp, now)}</span>
    </div>
  );
};

const AbilityPickerDropdown = ({onChange, onClose}) => {
  const ref = useRef();
  useClickOutside(ref, onClose);

  const modelStorage = useContext(ModelStorageContext);
  const abilities = modelStorage.history().filter((x) => x.category === 'ability');

  return (
    <div ref={ref} className="mock-hero-ability-picker-dropdown">
      <AbilityPickerNew onChange={onChange} />
      {abilities.map(({id, name, timestamp}) =>
        <AbilityPickerEntry key={id} id={id} name={name} timestamp={timestamp} onChange={onChange} />,
      )}
    </div>
  );
};

const AbilityPicker = observer(({foreignModel}) => {
  const [open, setOpen] = useState(false);

  const onMouseDown = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);

  const onChange = useAction((id) => {
    foreignModel.id = id;
    setOpen(false);
  }, [foreignModel, setOpen]);

  return (
    <div className="mock-hero-ability-picker">
      <div className="mock-hero-ability-picker-trigger" onMouseDown={onMouseDown}>
        <Icon color="white" image="swap" />
      </div>
      {open && <AbilityPickerDropdown onChange={onChange} onClose={onClose} />}
    </div>
  );
});

export {AbilityPicker};
