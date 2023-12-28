import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
  DisableRuleCommand,
  DeleteRuleCommand,
  EnableRuleCommand,
  RemoveTargetsCommand,
} from '@aws-sdk/client-eventbridge';

// UTC time
const cronTable = {
  '1m': 'cron(* * * * ? *)',
  '5m': 'cron(*/5 * * * ? *)',
  '10m': 'cron(*/10 * * * ? *)',
  '1hr': 'cron(0 * * * ? *)',
  '3hr': 'cron(0 */3 * * ? *)',
  '24hr': 'cron(0 0  * * ? *)',
  '1w': 'cron(0 0 ? * 1 *)',
};

const client = new EventBridgeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.USER_ACCESS_KEY,
    secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
  },
});

export const createRule = async (ruleId, interval) => {
  const params = {
    Name: `Alert-Rule-${ruleId}`,
    ScheduleExpression: cronTable[interval],
    State: 'ENABLED',
  };
  const putRuleCommand = new PutRuleCommand(params);
  const res = await client.send(putRuleCommand);

  return res;
};

export const createTarget = async ruleId => {
  const params = {
    Rule: `Alert-Rule-${ruleId}`,
    Targets: [
      {
        Id: 'kafka-producer',
        Arn: 'arn:aws:lambda:ap-southeast-2:044551082685:function:eventBridge-lambda',
        Input: JSON.stringify({ ruleId }),
      },
    ],
  };

  const putTargetsCommand = new PutTargetsCommand(params);
  const res = await client.send(putTargetsCommand);

  return res;
};

export const removeTargets = async ruleId => {
  const params = {
    Rule: `Alert-Rule-${ruleId}`,
    Ids: ['kafka-producer'],
  };

  const removeTargetsCommand = new RemoveTargetsCommand(params);
  const res = await client.send(removeTargetsCommand);

  return res;
};

export const deleteRule = async ruleId => {
  const params = {
    // DeleteRuleRequest
    Name: `Alert-Rule-${ruleId}`, // required
    Force: true,
  };

  const deleteRuleCommand = new DeleteRuleCommand(params);
  const res = await client.send(deleteRuleCommand);

  return res;
};

export const disableRule = async ruleId => {
  const params = {
    // DeleteRuleRequest
    Name: `Alert-Rule-${ruleId}`, // required
  };

  const disableCommand = new DisableRuleCommand(params);
  const res = await client.send(disableCommand);

  return res;
};

export const enableRule = async ruleId => {
  const params = {
    // DeleteRuleRequest
    Name: `Alert-Rule-${ruleId}`, // required
  };

  const enableCommand = new EnableRuleCommand(params);
  const res = await client.send(enableCommand);

  return res;
};
