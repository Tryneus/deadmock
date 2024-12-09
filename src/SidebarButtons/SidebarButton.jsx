import {Icon} from '../Icon';
import {SemiBold} from '../Text';

import './SidebarButton.css';

const SidebarButton = ({label, onClick}) => {
  return (
    <div className="mock-sidebar-button" onClick={onClick}>
      <SemiBold>{label}</SemiBold>
      <Icon color="bright-green" image="plus" />
    </div>
  );
};

export {SidebarButton};
