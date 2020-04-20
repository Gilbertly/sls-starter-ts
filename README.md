# Project Template: `aws-typescript`

[![codecov](https://codecov.io/gh/Gilbertly/sls-starter-ts/branch/master/graph/badge.svg?token=3n0d40Byzd)](https://codecov.io/gh/Gilbertly/sls-starter-ts)

## Setup

```sh
// expose aws profile credentials
$ export AWS_PROFILE=<PROFILE_NAME>

// copy `config/env.yml.example` to `config/env.yml`
// populate `config/env.yml` with project secrets

// install dynamodb-local
$ npm run ddb:install

// `create` or `download` project ssm secrets:
// 1. `create` a new file `./config/ssm.sls.json`
$ npm run ssm:update

// 2. `download` an existing secrets
$ npm run ssm:download

// validate setup
$ npm run validate:all

// start-up apigateway and dynamodb localhost
$ npm run api:start
```

## AWS Deployment Config

```sh
// update params at `config/cfn.params.json` from `config/cfn.params.json.example`

// create initial pre-deployment serverless resources
$ npm run cli:cmd cfn.configure <STACK_NAME>
```
