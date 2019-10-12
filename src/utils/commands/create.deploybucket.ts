import * as yargs from 'yargs';
import * as path from 'path';

export const build = (): yargs.CommandModule => {
  const createDeployBucket = async () => {
    console.log('Creating initial Serverless deployment bucket ...');
    const templatePath = path.resolve(
      __dirname,
      '../../../aws/sls_deploy_bucket.yml',
    );
  };

  return {
    command: 'create.deploybucket',
    describe: 'Creates S3 bucket for Serverless to upload artifacts to.',
    handler: () => createDeployBucket().catch(console.error),
  };
};
