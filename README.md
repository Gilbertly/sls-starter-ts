# Project Template: `aws-typescript`

[![codecov](https://codecov.io/gh/Gilbertly/sls-starter-ts/branch/master/graph/badge.svg?token=3n0d40Byzd)](https://codecov.io/gh/Gilbertly/sls-starter-ts)

## Setup

First ensure that you have exported the relevant AWS credentials for your environment, with the command:

```sh
// expose aws profile credentials
$ export AWS_PROFILE=<PROFILE_NAME>
```

### SSM Parameters: `download`

Downloads existing project secrets from AWS environment to local file:

```sh
// download existing secrets from an ssm path
$ npm run cli:cmd <COMMAND> <SSM_PATH> <FILENAME>
$ npm run cli:cmd ssm.download /starter_ts/ dev
```

### SSM Parameters: `update`

Creates or updates project secrets onto an AWS environment:

```sh
// create a new secrets file, eg. `./config/ssm.dev.json`
$ touch ./config/ssm.dev.json

// create or update secrets from a file
$ npm run cli:cmd <COMMAND> <FILENAME>
$ npm run cli:cmd ssm.update dev
```

### Validate Project Setup

Validates your development environment:

```sh
$ npm run validate:all

// start apigateway + dynamodb localhost
$ npm run ddb:install
$ npm run api:start
```

> _NOTE:_ Run the command `npm run ddb:install` initially, and not everytime you are starting
> apigateway + dynamodb locally.
