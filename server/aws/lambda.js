import {
  LambdaClient,
  AddPermissionCommand,
  RemovePermissionCommand,
} from '@aws-sdk/client-lambda';

const client = new LambdaClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.USER_ACCESS_KEY,
    secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
  },
});

export const addPermission = async ruleId => {
  const permissionParams = {
    Action: 'lambda:InvokeFunction',
    FunctionName: 'eventBridge-lambda',
    Principal: 'events.amazonaws.com',
    StatementId: `permission-${ruleId}`,
    SourceArn: `arn:aws:events:ap-southeast-2:044551082685:rule/Alert-Rule-${ruleId}`,
  };

  const permissionCommand = new AddPermissionCommand(permissionParams);
  const res = await client.send(permissionCommand);

  return res;
};

export const removePermission = async ruleId => {
  const permissionParams = {
    FunctionName: 'eventBridge-lambda',
    StatementId: `permission-${ruleId}`,
  };

  const removePermissionCommand = new RemovePermissionCommand(permissionParams);
  const res = await client.send(removePermissionCommand);

  return res;
};
