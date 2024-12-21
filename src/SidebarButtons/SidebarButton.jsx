import {Icon} from '/src/Icon';
import {SemiBold} from '/src/Text';

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
