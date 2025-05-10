import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({ value, max }) => {
  if (value < 0 || value > max) {
    console.error(`Invalid prop \`value\` of value \`${value}\` supplied to \`Progress\`. The \`value\` prop must be between 0 and \`${max}\`.`);
  }

  const percentage = (value / max) * 100;

  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
};

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

export default Progress;