import PropTypes from 'prop-types';

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

export {SidebarButtons};
