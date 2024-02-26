import schedule from 'node-schedule';

class AlertCronJob {
  constructor() {
    this._jobs = {};
    this.current = 0;
  }

  setCronJob(actionInterval, ruleId, fn) {
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

    this._jobs[rule] = job;
    this.current += 1;
  }

  get jobs() {
    return this._jobs;
  }
}

export default AlertCronJob;
