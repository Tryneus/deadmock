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

export {SidebarButtons};
