import { APIGatewayEvent, Context } from 'aws-lambda';
import * as fs from 'fs';
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN || '' });

const sayHello = (message: string): string => {
  return `Hello ${message}!`;
};

const getParamsFile = (filepath: string) => {
  if (!fs.existsSync(filepath)) return {};
  const jsonData = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(jsonData);
};

exports.handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<string> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const queryStrings = event.queryStringParameters || {};
  let eventParam = '';

  try {
    const paramsFile = getParamsFile('/tmp/ssm/params.json');
    console.log(`s3Bucket: ${paramsFile.S3_BUCKET}`);

    eventParam = queryStrings.message || '';
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }

  return sayHello(eventParam);
};

export { sayHello };
