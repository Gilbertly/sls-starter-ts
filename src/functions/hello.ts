import { APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN || '' });
const SSM_PORT = process.env.LAMBDA_SSM_CACHE_PORT || 4000;

const sayHello = (message: string): string => {
  return `Hello ${message}!`;
};

const getParam = async (param: string): Promise<string> => {
  try {
    const url = `http://localhost:${SSM_PORT}/parameter/${param}`;
    const response = await axios.get(url);
    return JSON.stringify(response.data);
  } catch (error) {
    Sentry.captureException(error);
    throw Error(`Error getting parameter '${param}': ${error}`);
  }
};

exports.handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<string> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const queryStrings = event.queryStringParameters || {};
  let eventParam = '';

  try {
    const s3Bucket = await getParam('S3_BUCKET');
    console.log(`s3Bucket: ${s3Bucket}`);

    eventParam = queryStrings.message || '';
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }

  return sayHello(eventParam);
};

export { sayHello };
