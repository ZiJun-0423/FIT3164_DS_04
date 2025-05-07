import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, format, isValid } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';

export default function MiniDateSelector({ onDateChange, defaultDate, maxValidDate }) {
  const [selectedDate, setSelectedDate] = useState(defaultDate || null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange && onDateChange(date);
  };

  const parseInput = (input) => {
    const parsed = parse(input, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  };

  return (
    <div className="date-picker">
      <label htmlFor="date-picker">Select or enter date:</label>
      <DatePicker
        id="date-picker"
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        openToDate={selectedDate || defaultDate || new Date()}
        maxDate={maxValidDate}
        filterDate={(date) => (!maxValidDate || date <= maxValidDate)}
        isClearable
        showPopperArrow={false}
      />
    </div>
  );
}
