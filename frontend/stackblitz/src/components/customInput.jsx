import React from 'react';

const CustomInput = React.forwardRef(({ value, onClick, onChange }, ref) => (
  <input
    ref={ref}
    onClick={onClick}
    onChange={onChange}
    value={value}
    data-testid="mini-date-picker"
    placeholder="DD/MM/YYYY"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    }}
  />
));

export default CustomInput;