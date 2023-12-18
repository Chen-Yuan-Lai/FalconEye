import schedule from 'node-schedule';

const setCronJob = (actionInterval, fn) => {
  const regex = /(\d+)([a-zA-z]+)/;
  const interval = actionInterval.match(regex);
  const rule = new schedule.RecurrenceRule();

  if (interval[2] === 'm') {
    rule.minute = new schedule.Range(0, 59, +interval[1] - 1);
  }
  if (interval[2] === 'hr') {
    rule.hour = new schedule.Range(0, 23, +interval[1] - 1);
  }

  const job = schedule.scheduleJob(rule, fn);

  return job;
};

export default setCronJob;
