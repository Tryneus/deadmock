import PropTypes from 'prop-types';

import {Icon} from '../Icon';
import {SemiBold} from '../Text';

import './SidebarButton.css';

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

export {SidebarButton};
