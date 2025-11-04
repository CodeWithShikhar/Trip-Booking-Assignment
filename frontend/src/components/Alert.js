import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose }) => {
  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    info: <FaInfoCircle />,
    warning: <FaExclamationCircle />
  };

  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{icons[type]}</div>
      <div className="alert-message">{message}</div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Alert;
