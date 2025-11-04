import React from 'react';
import { FaPlane } from 'react-icons/fa';
import './Loading.css';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  const content = (
    <div className="loading-content">
      <FaPlane className="loading-icon" />
      <p>{message}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="loading-fullscreen">{content}</div>;
  }

  return <div className="loading-inline">{content}</div>;
};

export default Loading;
