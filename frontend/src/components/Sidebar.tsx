import React from 'react';

interface SidebarProps {
  onFilter: (filter: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilter }) => {
  return (
    <div className="Sidebar">
      <button onClick={() => onFilter('Today')}>Today</button>
      <button onClick={() => onFilter('Work')}>Work</button>
      {/* Add more filter buttons as needed */}
    </div>
  );
};

export default Sidebar;
