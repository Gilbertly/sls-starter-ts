import { EventBridge } from 'aws-sdk'
import { Context } from 'aws-lambda';

export async function handler(event: any, context: Context) {
  console.log('Got event:', event);
  try {
    const ebClient = new EventBridge();
    const response = await ebClient.putEvents({
      Entries: [{
        EventBusName: 'default',
        DetailType: event['detail-type'] || 'backfill.test',
        Detail: JSON.stringify({ name: event?.detail?.name || 'Gilbert' }),
        Source: event?.source || 'custom.backfill.init',
      }]
    }).promise();
    console.log(response);
    return response;
  } catch (error) {
    console.error(`Encountered error: ${error}`);
    return;
  }
}
