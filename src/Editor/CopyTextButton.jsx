import classNames from 'classnames';
import {useCallback, useContext, useRef, useState} from 'preact/hooks';

import {AbilityModel} from '/src/Ability';
import {deepCopy, useClickOutside} from '/src/Common';
import {Icon} from '/src/Icon';
import {ModelStorageContext, examples} from '/src/Serialize';
import {defaultExportFormat, exportFormats} from './Export';
import './CopyTextButton.css';

const populateHeroAbilities = (model, modelStorage) => {
  const raw = deepCopy(model);
  raw.abilities = raw.abilities.map((x) =>
    deepCopy(new AbilityModel(examples[x.id] || modelStorage.load(x.id))),
  );
  return raw;
};

const doFormat = (model, formatter, modelStorage) => {
  if (model.category === 'ability') {
    return formatter.formatAbility(model);
  } else if (model.category === 'hero') {
    return formatter.formatHero(populateHeroAbilities(model, modelStorage));
  }
  return formatter.formatItem(model);
};

const doCopy = (model, format, modelStorage) => {
  if (!exportFormats[format]) {
    throw new Error(`unknown export format: ${format}`);
  }
  const blob = new Blob([
    doFormat(model, exportFormats[format], modelStorage),
  ], {type: 'text/plain'});
  navigator.clipboard.write([new ClipboardItem({'text/plain': blob})]);
};

const CopyTextEntry = ({format, selected, onChange}) => {
  const classes = classNames('mock-editor-copy-text-entry', {'mock-editor-copy-text-entry-selected': selected});
  const onClick = useCallback(() => onChange(format), [format, onChange]);
  return (
    <div className={classes} onClick={onClick}>
      {format}
    </div>
  );
};

const CopyTextDropdown = ({format, onChange, onClose}) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);

  const formats = Object.keys(exportFormats);
  return (
    <div ref={ref} className="mock-editor-copy-text-dropdown">
      {formats.map((x) => <CopyTextEntry key={x} format={x} selected={x === format} onChange={onChange} />)}
    </div>
  );
};

const CopyTextButton = ({model}) => {
  const modelStorage = useContext(ModelStorageContext);
  const [format, setFormat] = useState(defaultExportFormat);
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onClick = useCallback(() => doCopy(model, format, modelStorage), [model, format, modelStorage]);
  const onChangeFormat = useCallback((x) => {
    setFormat(x);
    setOpen(false);
  }, [setFormat, setOpen]);

  return (
    <div>
      {open && <CopyTextDropdown format={format} onChange={onChangeFormat} onClose={onClose} />}
      <div className="mock-editor-copy-text-button">
        <div onClick={onClick}>
          <span>Copy Text</span>
        </div>
        <Icon color="white" image="dropdown" onMouseDown={open ? null : onOpen} />
      </div>
    </div>
  );
};

export {CopyTextButton};
