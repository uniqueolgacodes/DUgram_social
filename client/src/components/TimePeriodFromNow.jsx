import React from 'react';
import moment from 'moment';

function TimePeriodFromNow({ date }) {
  const formattedDate = moment(date).fromNow();
  
  return (
    <span className='text-ascent-2'>
      {formattedDate}
    </span>
  );
}

export default TimePeriodFromNow;
