const moment = require('moment');

exports.getWeek = (day, flag) => {
  const d = new Date();

  let dist;
  if (flag === 'next') {
    dist = day === 0 ? 6 : 5 - day;
  } else if(flag === 'prev') {
    dist = day === 0 ? 0 : -(day);
  }
  d.setDate(d.getDate() + dist);
  return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
};


exports.uniqBy = async (a, key) => {
  let seen = new Set();
  return a.filter(item => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k)
  });
};


exports.repeatCnt = async (time, endTime, repeat) => {
  let cnt = 1;
  const end_time = moment(endTime, 'HH:mm').format('HH:mm');
  for (let start_time = moment(time, 'HH:mm').format('HH:mm');
       start_time < end_time;
       start_time = moment(start_time, 'HH:mm').add(Number(repeat), 'm').format('HH:mm')
  ) {
    cnt = cnt += 1
  }
  return cnt
};

