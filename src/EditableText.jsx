import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';
import {statIcons, useAction} from './common';
import {Icon, iconColors} from './icon';
import {Markdown} from './markdown';
import './EditableText.css';

// React discards the newlines otherwise, so shove in some line-break elements
const preserveNewlines = (text) => (
  <>
    {text.split('\n').reduce((acc, x) => {
      if (acc === null) {
        return x;
      }
      return (
        <>
          {acc}
          <br />
          {x}
        </>
      );
    })}
  </>);

// TODO: try to unify this with the markdown version
const EditableText = observer(({color, size, weight, onChange, children}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(null);

  const editingOn = useCallback(() => {
    setEditing(true);
    setText(ref.current.innerText);
    // For some reason this does nothing without an immediate timeout
    setTimeout(() => {
      ref.current.contentEditable = 'true';
      ref.current.focus();
      window.getSelection().selectAllChildren(ref.current);
    }, 0);
  }, [ref, setEditing, setText]);

  const editingOff = useCallback((e) => {
    setEditing(false);
    onChange(e.target.innerText);
    e.target.innerText = ''; // react seems to have trouble with the DOM changing due to user editing?
    e.target.contentEditable = 'false';
    window.getSelection().removeAllRanges();
  }, [setEditing, onChange]);

  const style = {color, fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : children;

  return (
    <span
      ref={ref}
      className="mock-editable-text"
      spellCheck={false}
      style={style}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </span>
  );
});

const EditableMarkdown = observer(({text, format, onChange, color, size, weight}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);

  const editingOn = useCallback(() => {
    setEditing(true);
    // For some reason this does nothing without an immediate timeout
    setTimeout(() => {
      ref.current.contentEditable = 'true';
      ref.current.focus();
      window.getSelection().selectAllChildren(ref.current);
    }, 0);
  }, [ref, setEditing]);

  const editingOff = useCallback((e) => {
    setEditing(false);
    onChange(e.target.innerText);
    e.target.innerText = ''; // react seems to have trouble with the DOM changing due to user editing?
    e.target.contentEditable = 'false';
    window.getSelection().removeAllRanges();
  }, [setEditing, onChange]);

  const style = {color, fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : <Markdown {...{text, format}} />;

  return (
    <span
      ref={ref}
      className="mock-editable-text"
      spellCheck={false}
      style={style}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </span>
  );
});

const IconSelectorButton = observer(({image, model}) => {
  const onClick = useAction(() => (model.image = image), [image, model]);
  return (
    <div className="mock-icon-selector-button" onClick={onClick}>
      <Icon color={model.color} image={image} size={20} />
    </div>
  );
});

IconSelectorButton.propTypes = {
  model: PropTypes.object,
  image: PropTypes.string,
};

const IconSelectorColor = observer(({color, model}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  return (
    <div className="mock-icon-selector-button" onClick={onClick}>
      <Icon color={color} size={20} />
    </div>
  );
});

const IconSelector = observer(({model}) => {
  return (
    <div className="mock-icon-selector">
      <div>
        {iconColors.map((c) => <IconSelectorColor key={c} color={c} model={model} />)}
      </div>
      <div>
        {statIcons.map((path) => <IconSelectorButton key={path} image={path} model={model} />)}
      </div>
    </div>
  );
});

IconSelector.propTypes = {
  model: PropTypes.object,
};

const TooltipContainer = observer(({renderTooltip, click, children}) => {
  const ref = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const addArrow = (elem) => (
    <>
      <div className="mock-tooltip-arrow" />
      {elem}
    </>
  );

  const cbProps = {};
  if (click) {
    cbProps.onClick = useCallback(() => {
      setTooltip(addArrow(renderTooltip()));
    }, [renderTooltip]);

    useEffect(() => {
      const handleClick = (e) => {
        if (tooltip && ref.current && !ref.current.contains(e.target)) {
          setTooltip(null);
        }
      };

      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }, [tooltip, setTooltip, ref]);
  } else {
    cbProps.onMouseEnter = useCallback(() => {
      setTooltip(addArrow(renderTooltip()));
    }, [setTooltip, renderTooltip]);

    cbProps.onMouseLeave = useCallback(() => {
      setTooltip(null);
    }, [setTooltip]);
  }

  return (
    <div ref={ref} className="mock-tooltip-container" {...cbProps} >
      {children}
      <div className="mock-tooltip">
        {tooltip}
      </div>
    </div>
  );
});

TooltipContainer.propTypes = {
  renderTooltip: PropTypes.func.isRequired,
  click:         PropTypes.bool,
};

const EditableIcon = observer(({model}) => {
  const renderTooltip = useCallback(() => <IconSelector model={model} />, [model]);

  return (
    <TooltipContainer click renderTooltip={renderTooltip}>
      <Icon color={model.color} image={model.image} size={model.size} />
    </TooltipContainer>
  );
});

EditableIcon.propTypes = {
  model: PropTypes.object.isRequired,
};

export {EditableIcon, EditableMarkdown, EditableText};
export default EditableText;
