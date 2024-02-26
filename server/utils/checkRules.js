import { getIssuesStatistic } from '../models/project.js';

const checker = async (client, triggers, projectId, issuesInterval, filter) => {
  const hitCount = new Array(4).fill(0);
  for (let i = 0; i < triggers.length; i += 1) {
    const triggerId = Number(triggers[i].trigger_type_id);
    const threshold = Number(triggers[i].threshold);
    const issuesByTrigger = await getIssuesStatistic(client, projectId, triggers[i].time_window);
    const checkThreshold = type => issuesByTrigger.find(el => Number(el[type]) > threshold);

    if (triggerId === 1 && issuesInterval.length > 0) hitCount[1] += 1;
    if (triggerId === 2 && Boolean(checkThreshold('event_num'))) hitCount[2] += 1;
    if (triggerId === 3 && Boolean(checkThreshold('users_num'))) hitCount[3] += 1;
  }
  const countSum = hitCount.reduce((acc, curr) => acc + curr, 0);
  if (countSum === triggers.length && filter === 'all') return true;
  if (countSum <= triggers.length && filter === 'any') return true;
  return false;
};

export default checker;
