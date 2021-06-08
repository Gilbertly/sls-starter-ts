#!/usr/bin/env node
const { register, next } = require('./extensions-api');
const ssmCache = require('./ssm');

const EventType = {
  INVOKE: 'INVOKE',
  SHUTDOWN: 'SHUTDOWN',
};

function handleInvoke(event) {
  console.log('Lambda invoked');
}

function handleShutdown(event) {
  console.log('Extension shutdown.');
  process.exit(0);
}

(async function main() {
  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  const extensionId = await register();
  console.log(`extensionId: ${extensionId}`);
  await ssmCache.cacheSecrets();
  await ssmCache.startHttpServer();

  // execute extensions logic
  while (true) {
    const event = await next(extensionId);
    switch (event.eventType) {
      case EventType.SHUTDOWN:
        handleShutdown(event);
        break;
      case EventType.INVOKE:
          handleInvoke(event);
          break;
      default:
        throw new Error(`Unknown event: ${event.eventType}`);
    }
  }
})();