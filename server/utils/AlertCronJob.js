import schedule from 'node-schedule';
import { getValidAlerts, createAlertHistory } from '../models/alert.js';
import { getIssuesStatistic } from '../models/project.js';
import { getTriggers } from '../models/trigger.js';
import { getTokens } from '../models/channel.js';
import sendNotification from './sendNotification.js';

class AlertCronJob {
  #jobs;

  #jobsNum;

  constructor() {
    this.#jobs = {};
    this.#jobsNum = 0;
  }

  addCronJob(ruleId, job) {
    this.#jobs[ruleId] = job;
    this.#jobsNum += 1;
  }

  setCronJob(ruleId, job) {
    const regex = /(\d+)([a-zA-z]+)/;
    const interval = job.actionInterval.match(regex);
    const rule = new schedule.RecurrenceRule();

    if (interval[2] === 'm') {
      rule.minute = new schedule.Range(0, 59, Number(interval[1]) - 1);
    }
    if (interval[2] === 'hr') {
      rule.hour = new schedule.Range(0, 23, Number(interval[1]) - 1);
    }

    return schedule.scheduleJob(rule, this.checkJob.bind(this, ruleId, job));
  }

  async loadJobs() {
    const validRules = await getValidAlerts();
    const triggersPromises = [];
    const channelsPromises = [];
    validRules.forEach(rule => {
      triggersPromises.push(getTriggers(rule.id));
      channelsPromises.push(getTokens(rule.id));
    });
    const triggers = await Promise.all(triggersPromises);
    const channels = await Promise.all(channelsPromises);

    validRules.forEach(rule => {
      this.#jobs[rule.id] = {
        projectId: rule.project_id,
        filter: rule.filter,
        actionInterval: rule.action_interval,
        name: rule.name,
        active: rule.active,
      };

      this.#jobsNum += 1;
    });

    triggers.forEach(trigger => {
      const ruleId = trigger[0].rule_id;
      const t = trigger.map(el => ({
        threshold: el.threshold,
        time_window: el.time_window,
        triggerTypeId: el.trigger_type_id,
      }));
      this.#jobs[ruleId].triggers = t;
    });

    channels.forEach(channel => {
      const ruleId = channel[0].rule_id;
      const c = channel.map(el => el.token);
      this.#jobs[ruleId].channels = c;
    });

    Object.keys(this.#jobs).forEach(ruleId => {
      const job = this.#jobs[ruleId];
      if (job.active) {
        this.#jobs[ruleId].cronJob = this.setCronJob(ruleId, job);
      }
    });

    console.log('Loading current active jobs successfully!');
  }

  async checker(projectId, issuesInterval, triggers, filter) {
    const hitCount = new Array(4).fill(0);
    for (let i = 0; i < triggers.length; i += 1) {
      const triggerId = Number(triggers[i].triggerTypeId);
      const threshold = Number(triggers[i].threshold);
      const issuesByTrigger = await getIssuesStatistic(projectId, triggers[i].time_window);
      const checkThreshold = type => issuesByTrigger.find(el => Number(el[type]) > threshold);
      console.log(issuesByTrigger);
      if (triggerId === 1 && issuesInterval.length > 0) hitCount[1] += 1;
      if (triggerId === 2 && Boolean(checkThreshold('event_num'))) hitCount[2] += 1;
      if (triggerId === 3 && Boolean(checkThreshold('users_num'))) hitCount[3] += 1;
    }
    const countSum = hitCount.reduce((acc, curr) => acc + curr, 0);
    console.log(hitCount);
    if (countSum === triggers.length && filter === 'all') return true;
    if (countSum > 0 && filter === 'any') return true;
    return false;
  }

  async checkJob(ruleId, job) {
    try {
      const { projectId, actionInterval, triggers, tokens, filter } = job;
      const issuesInterval = await getIssuesStatistic(projectId, actionInterval);
      const isTrigger = await this.checker(projectId, issuesInterval, triggers, filter);
      if (isTrigger) {
        await createAlertHistory(ruleId);
        await sendNotification('Your project has something wrong!', tokens);
      }
    } catch (err) {
      console.error(err);
    }
  }

  updateJob(ruleId, updateObj) {
    const job = this.#jobs[ruleId];

    Object.keys(updateObj).forEach(key => {
      job[key] = updateObj[key];

      if (key === 'active' && updateObj[key]) {
        job.cronJob = this.setCronJob(ruleId, job);
        console.log(`active rule: ${ruleId}`);
      } else if (key === 'active' && !updateObj[key]) {
        job.cronJob.cancel(`muted rule: ${ruleId}`);
        delete job.cronJob;
      }
    });
  }

  deleteJob(ruleId) {
    delete this.#jobs[ruleId];
  }

  get jobs() {
    return this.#jobs;
  }
}

export default AlertCronJob;
