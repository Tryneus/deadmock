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

const SidebarButton = ({label, onClick}) => {
  return (
    <div className="mock-sidebar-button" onClick={onClick}>
      <SemiBold size={14}>{label}</SemiBold>
      <Icon image="plus" size={8} color="green" />
    </div>
  );
};

export {SidebarButtons, SidebarButton};
