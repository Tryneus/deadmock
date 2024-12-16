import './SidebarButtons.css';

const SidebarButtons = ({renderButtons, children}) => {
  return (
    <>
      <div className="mock-sidebar-buttons">
        <div>
          {renderButtons()}
        </div>
      </div>
      {children}
    </>
  );
};

export {SidebarButtons};
