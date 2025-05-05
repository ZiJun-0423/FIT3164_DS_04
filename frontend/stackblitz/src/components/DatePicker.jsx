import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';

export default function MiniDateSelector({ onDateChange, defaultDate }) {
    const [selectedDate, setSelectedDate] = useState(defaultDate || null);
    const [inputValue, setInputValue] = useState(
      defaultDate ? format(defaultDate, 'dd/MM/yyyy') : ''
    );
  
    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
  
      const parsed = parse(value, 'dd/MM/yyyy', new Date());
      if (!isNaN(parsed)) {
        setSelectedDate(parsed);
        onDateChange && onDateChange(parsed);
      }
    };
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
      const formatted = format(date, 'dd/MM/yyyy');
      setInputValue(formatted);
      onDateChange && onDateChange(date);
    };
  
    return (
      <div>
        <label htmlFor="date-input">Select or enter date:</label>
        <input
          type="text"
          id="date-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="DD/MM/YYYY"
        />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          customInput={<></>} // optional: hides default input
          inline
        />
      </div>
    );
  }
  