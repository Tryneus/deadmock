import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import {allItems, groupedStatIcons, useAction} from './common';
import {Icon, iconColors} from './icon';
import {Markdown} from './markdown';
import {textColors} from './text';
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

  const style = {color: textColors[color], fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : children;

  return (
    <span
      ref={ref}
      className="mock-editable-text mock-text"
      spellCheck={false}
      style={style}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </span>
  );
});

EditableText.propTypes = {
  color:    PropTypes.string,
  size:     PropTypes.number,
  weight:   PropTypes.oneOf([400, 500, 600, 700]),
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

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

  const style = {color, fontWeight: weight, fontSize: size};
  const inner = editing ? preserveNewlines(text) : <Markdown format={format} text={text} />;

  return (
    <div
      ref={ref}
      className="mock-editable-text mock-text"
      spellCheck={false}
      style={style}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </div>
  );
});

EditableMarkdown.propTypes = {
  text:     PropTypes.string,
  format:   PropTypes.object,
  onChange: PropTypes.func,
  color:    PropTypes.string,
  size:     PropTypes.number,
  weight:   PropTypes.oneOf([400, 500, 600, 700]),
};

const IconSelectorButton = observer(({image, model}) => {
  const onClick = useAction(() => (model.image = image), [image, model]);
  return (
    <div className="mock-icon-selector-button" onClick={onClick}>
      <Icon color={model.color} image={image} size={20} />
    </div>
  );
});

IconSelectorButton.propTypes = {
  model: PropTypes.object.isRequired,
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

IconSelectorColor.propTypes = {
  color: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
};

const IconSelector = observer(({model}) => {
  return (
    <div className="mock-icon-selector">
      <div>
        {iconColors.map((c) => <IconSelectorColor key={c} color={c} model={model} />)}
      </div>
      {
        groupedStatIcons.map((group, i) => (
          <div key={i}>
            {group.map((path) => <IconSelectorButton key={path} image={path} model={model} />)}
          </div>
        ))
      }
    </div>
  );
});

IconSelector.propTypes = {
  model: PropTypes.object,
};

const TooltipContainer = observer(({renderTooltip, direction, click, children}) => {
  const ref = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const down = direction === 'down';

  const arrowClasses = classNames({
    'mock-tooltip-arrow-up':   !down,
    'mock-tooltip-arrow-down': down,
  });

  const tooltipClasses = classNames('mock-tooltip', {
    'mock-tooltip-up':   !down,
    'mock-tooltip-down': down,
  });

  const addArrow = useCallback((elem) => (
    <>
      {!down && elem}
      <div className={arrowClasses} />
      {down && elem}
    </>
  ), [down, arrowClasses]);

  const cbProps = {};
  if (click) {
    cbProps.onClick = useCallback(() => {
      if (tooltip) {
        setTooltip(null);
      } else {
        setTooltip(addArrow(renderTooltip()));
      }
    }, [tooltip, renderTooltip, addArrow]);

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
    }, [addArrow, renderTooltip, setTooltip]);

    cbProps.onMouseLeave = useCallback(() => {
      setTooltip(null);
    }, [setTooltip]);
  }

  return (
    <div ref={ref} className="mock-tooltip-container" {...cbProps} >
      {down && children}
      <div className={tooltipClasses}>
        {tooltip}
      </div>
      {!down && children}
    </div>
  );
});

TooltipContainer.propTypes = {
  renderTooltip: PropTypes.func.isRequired,
  click:         PropTypes.bool,
  direction:     PropTypes.oneOf(['up', 'down']),
};

const EditableIcon = observer(({model}) => {
  const renderTooltip = useCallback(() => <IconSelector model={model} />, [model]);

  return (
    <TooltipContainer click direction="down" renderTooltip={renderTooltip}>
      <Icon color={model.color} image={model.image} size={model.size} />
    </TooltipContainer>
  );
});

EditableIcon.propTypes = {
  model: PropTypes.object.isRequired,
};

const StylePickerColor = observer(({model, color}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  const style = {backgroundColor: textColors[color]};
  return (
    <div className="mock-style-picker-color" style={style} onClick={onClick} />
  );
});

StylePickerColor.propTypes = {
  model: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};

const weights = [400, 500, 600, 700];

const StylePickerWeight = observer(({model, weight}) => {
  const onClick = useAction(() => (model.weight = weight), [weight, model]);
  const style = {fontWeight: weight, color: textColors[model.color]};
  return (
    <div className="mock-style-picker-weight" style={style} onClick={onClick}>Aa</div>
  );
});

StylePickerWeight.propTypes = {
  model:  PropTypes.object.isRequired,
  weight: PropTypes.oneOf([400, 500, 600, 700]).isRequired,
};

const StylePicker = observer(({model}) => {
  return (
    <div className="mock-style-picker">
      <div>
        {Object.keys(textColors).map((c) => <StylePickerColor key={c} color={c} model={model} />)}
      </div>
      <div>
        {weights.map((w) => <StylePickerWeight key={w} model={model} weight={w} />)}
      </div>
    </div>
  );
});

StylePicker.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemPickerItem = ({item, onChange}) => {
  const onClick = useCallback(() => onChange(item), [item, onChange]);
  const classes = classNames(`mock-item-picker-icon-${item.category}`);
  const iconColor = `item-${item.category}`;

  return (
    <div className={classes} onClick={onClick} >
      <Icon color={iconColor} image={item.icon} />
    </div>
  );
};

ItemPickerItem.propTypes = {
  item:     PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

const ItemPicker = ({onChange}) => {
  const byCategory = Object.groupBy(allItems, (x) => x.category);
  const groups = Object.fromEntries(Object.entries(byCategory).map(([c, list]) => [c, Object.groupBy(list, (x) => x.tier)]));
  const tiers = [1, 2, 3, 4];

  const renderTier = (items) => (
    <div className="mock-item-picker-tier">
      {items.map((x) => <ItemPickerItem key={x.name} item={x} onChange={onChange} />)}
    </div>
  );

  return (
    <div className="mock-item-picker">
      <div className="mock-item-picker-weapon-group">
        {tiers.map((tier) => renderTier(groups.weapon[tier]))}
      </div>
      <div className="mock-item-picker-vitality-group">
        {tiers.map((tier) => renderTier(groups.vitality[tier]))}
      </div>
      <div className="mock-item-picker-spirit-group">
        {tiers.map((tier) => renderTier(groups.spirit[tier]))}
      </div>
    </div>
  );
};

ItemPicker.propTypes = {
  onChange: PropTypes.func,
};

export {EditableIcon, EditableMarkdown, EditableText, ItemPicker, StylePicker, TooltipContainer};
export default EditableText;
