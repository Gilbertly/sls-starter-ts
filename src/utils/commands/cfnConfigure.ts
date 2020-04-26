import * as yargs from 'yargs';
import * as path from 'path';
import * as shell from 'shelljs';

export const build = (): yargs.CommandModule => {
  interface CfnConfigureProps {
    stackname: string;
  }

  const cfnConfigure = async (args: CfnConfigureProps) => {
    console.log('Configuring pre-deployment resources ...');
    const stackname = args.stackname;

    const templateFilepath = path.resolve(
      __dirname,
      '../../../aws/cfn.configure.yml',
    );
    const parametersFilepath = path.resolve(
      __dirname,
      `../../../config/cfn.params.json`,
    );

    const cmd = `aws cloudformation deploy
      --stack-name ${stackname}
      --template-file file://${templateFilepath}
      --parameter-overrides file://${parametersFilepath}`;
    shell.exec(cmd);

    console.log(`Successfully configured resources on stack: '${stackname}'`);
  };

  return {
    command: 'cfn.configure <stackname>',
    describe: 'Configures pre-deployment resources required by Serverless.',
    handler: (args: any) => cfnConfigure(args).catch(console.error),
    builder: (args: yargs.Argv) =>
      args.option('stackname', { type: 'string' }).demandOption('stackname'),
  };
};
