import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import CustomInput from './customInput.jsx';
import { parse, isValid } from 'date-fns'

import 'react-datepicker/dist/react-datepicker.css';

export default function MiniDateSelector({ onDateChange, defaultDate, maxValidDate }) {
  const [selectedDate, setSelectedDate] = useState(defaultDate || null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange && onDateChange(date);
  };

  return (
    <div className="date-picker">
      <label htmlFor="date-picker">Select or enter date:</label>
      <DatePicker
        id="date-picker"
        selected={selectedDate}
        onChange={handleDateChange}
        onChangeRaw={(e) => {
          const inputValue = e.target.value.trim();
          if (inputValue.length === 10) { // "DD/MM/YYYY" has length 10
            const parsed = parse(inputValue, 'dd/MM/yyyy', new Date());
            if (isValid(parsed)) {
              handleDateChange(parsed); // Only update if the full input is a valid date
            }
          }
        }}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        openToDate={selectedDate || defaultDate || new Date()}
        maxDate={maxValidDate}
        filterDate={(date) => (!maxValidDate || date <= maxValidDate)}
        isClearable
        showPopperArrow={false}
        customInput={<CustomInput />}
        onCalendarClose={() => {
            if (selectedDate) {
            onDateChange?.(selectedDate);
            }
        }}
      />
    </div>
  );
}
