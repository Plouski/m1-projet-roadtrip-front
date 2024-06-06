import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.scss';

const Title = ({ level, title, color, alignment }) => {
  const Tag = `h${level}`;

  const colorClass = color ? styles[color] : '';
  const alignmentClass = alignment ? styles[`align-${alignment}`] : '';

  return (
    <div className={`${styles.wrapper} ${alignmentClass}`}>
      {React.createElement(
        Tag,
        { className: `${styles.title} ${colorClass}` },
        title
      )}
    </div>
  );
};

Title.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'accent']),
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
};

export default Title;
