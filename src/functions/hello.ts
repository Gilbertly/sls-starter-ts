import { APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN || '' });
const SSM_PORT = process.env.LAMBDA_SSM_CACHE_PORT || 4000;

const sayHello = (message: string): string => {
  return `Hello ${message}!`;
};

// const getParam = async (param: string): Promise<string> => {
//   try {
//     const url = `http://localhost:${SSM_PORT}/parameter/${param}`;
//     const response = await axios.get(url);
//     return JSON.stringify(response.data);
//   } catch (error) {
//     Sentry.captureException(error);
//     throw Error(`Error getting parameter '${param}': ${error}`);
//   }
// };

const getParams = async (): Promise<any> => {
  try {
    const url = `http://localhost:${SSM_PORT}/parameters`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    throw Error(`Error getting parameters: ${error}`);
  }
};

export async function handler(event: any, context: Context) {
  console.log('Got event:', event);
  const name = event?.detail?.name || 'Guest'
  return `Returning name: ${name}`;
}

// exports.handler = async (
//   event: APIGatewayEvent,
//   context: Context,
// ): Promise<string> => {
//   context.callbackWaitsForEmptyEventLoop = false;
//   console.info(event);
//   const queryStrings = event.queryStringParameters || {};
//   let eventParam = '';

//   try {
//     const s3Bucket = await getParam('S3_BUCKET');
//     console.log(`s3Bucket: ${s3Bucket}`);

//     const params = await getParams();
//     console.log(`s3Bucket: ${params.S3_BUCKET}`);

//     eventParam = queryStrings.message || '';
//   } catch (error) {
//     console.log(error);
//     Sentry.captureException(error);
//   }

//   return sayHello(eventParam);
// };

// export { sayHello };
