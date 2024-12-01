import PropTypes from 'prop-types';
import {Icon} from './icon';
import {SemiBold} from './text';
import './SidebarButtons.css';

const SidebarButtons = ({renderButtons, children}) => {
  return (
    <div>
      <div className="mock-sidebar-buttons">
        <div>
          {renderButtons()}
        </div>
      </div>
      {children}
    </div>
  );
};

SidebarButtons.propTypes = {
  renderButtons: PropTypes.func,
  children:      PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const SidebarButton = ({label, onClick}) => {
  return (
    <div className="mock-sidebar-button" onClick={onClick}>
      <SemiBold size={14}>{label}</SemiBold>
      <Icon color="green" image="plus" size={8} />
    </div>
  );
};

SidebarButton.propTypes = {
  label:   PropTypes.string,
  onClick: PropTypes.func,
};

export {SidebarButton, SidebarButtons};
