import { createServer } from './utils/server.js';
import { disconnectConsumer, connectConsumer } from './utils/kafka.js';
import sendNotification from './utils/sendNotification.js';
import * as AlertModels from './utils/checkAlertRules.js';

const PORT = 3003;
async function gracefulShutdown(app) {
  console.log('Graceful shutdown');

  await app.close();
  await disconnectConsumer();

  process.exit(1);
}

async function main() {
  const app = await createServer();

  const emitter = await connectConsumer('notification');
  emitter.on('message', async ruleId => {
    const client = await app.pg.connect();
    try {
      const { filter, action_interval: actionInterval } = await AlertModels.getAlertRule(
        client,
        ruleId
      );

      const triggers = await AlertModels.getTriggers(client, ruleId);

      const issuesInterval = await AlertModels.getIssues(client, actionInterval);

      let isFire = false;
      for (let i = 0; i < triggers.length; i++) {
        if (+triggers[i].trigger_type_id === 10) {
          if (+issuesInterval.issues_num === 0) isFire = true;
        } else {
          const t = await AlertModels.getIssues(client, triggers[i].time_window);
          if (+t.issues_num > +triggers[i].threshold) isFire = true;
        }

        if (filter === 'any') break;
      }

      if (isFire) {
        const tokens = await AlertModels.getTokens(client, ruleId);
        const historyRes = await AlertModels.createAlertHistory(client, ruleId);
        await sendNotification('出事了阿伯', tokens);
      }
      client.query('COMMIT');
    } catch (err) {
      console.error(err);
      client.query('ROLLBACK');
    } finally {
      client.release();
    }
  });

  app.listen({
    port: PORT,
  });

  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

  signals.forEach(signal => {
    process.on(signal, () => gracefulShutdown(app));
  });

  console.log(`Notification service ready at http://localhost:${PORT}`);
}

main();
