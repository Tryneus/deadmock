import PropTypes from 'prop-types';

import {Icon} from '../Icon';
import {SemiBold} from '../Text';

import './SidebarButton.css';

const SidebarButton = ({label, onClick}) => {
  return (
    <div className="mock-sidebar-button" onClick={onClick}>
      <SemiBold>{label}</SemiBold>
      <Icon color="green" image="plus" />
    </div>
  );
};

SidebarButton.propTypes = {
  label:   PropTypes.string,
  onClick: PropTypes.func,
};

export {SidebarButton};
