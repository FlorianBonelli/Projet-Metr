import React from 'react';
import './Dashbord.css';
import Sidebar from '../composants/Sidebar';

function Dashbord() {
  return (
    <div className="dashbord">
      <Sidebar />
      <div className="dashbord-content">
        <h1>Hello</h1>
      </div>
    </div>
  );
}


export default Dashbord;
 