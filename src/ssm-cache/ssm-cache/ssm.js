#!/usr/bin/env node
const yaml = require('js-yaml');
const fs = require('fs');
const AWS = require('aws-sdk');

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const NODE_ENV = process.env.NODE_ENV || 'dev';
const CACHE_TIMEOUT = process.env.CACHE_TIMEOUT || 0.5;
const ENV_YAML_FILENAME = process.env.ENV_YAML_FILENAME || 'serverless.env.yml';

const filepath = `/var/task/${ENV_YAML_FILENAME}`;
const paramsCache = {};
const envParams = [];
let cacheLastUpdated;

const saveToFile = (data) => {
  const filename = 'params.json';
  const filepath = '/tmp/ssm'

  try {
    if (!fs.existsSync(filepath)) fs.mkdirSync(filepath);
    fs.writeFileSync(`${filepath}/${filename}`, JSON.stringify(data, null, 2));
    console.log(`Saved ssm params to: '${filepath}/${filename}'`);
  } catch (error) {
    throw Error(`Error saving file '${filepath}/${filename}'.\n${error}`);
  }
};

async function cacheSecrets() {
  if (!fs.existsSync(filepath)) throw Error(`'${filepath}' not found.`);

  try {
    var fileContents = fs.readFileSync(filepath, 'utf8');
    var data = yaml.safeLoad(fileContents);
    if (data === null) throw Error(`File '${filepath}' cannot be empty.`);

    var parameters = data[NODE_ENV].SSM_CACHE_PARAMS;
    for (let [_, param] of Object.entries(parameters)) {
      envParams.push(param);
    }
  } catch (error) {
    throw Error(`Error reading file '${filepath}'.\n${error}`);
  }

  try {
    const ssmClient = new AWS.SSM({region: AWS_REGION});
    const paramsResponse = await ssmClient.getParameters({ Names: envParams, WithDecryption: false }).promise();

    for (let [key, value] of Object.entries(parameters)) {
      paramsCache[key] = paramsResponse.Parameters.filter(function(param){ return param.Name == value;})[0].Value;
    }
  } catch (error) {
    console.error(`Error fetching parameter.\n${error}`);
  }

  // Read timeout from environment variable and set expiration timestamp
  var timeOut = parseInt(CACHE_TIMEOUT);
  var timeNow = new Date();
  timeNow.setMinutes(timeNow.getMinutes() + timeOut);
  cacheLastUpdated = timeNow;
}

async function processPayload(req, res) {
  let response;
  if (new Date() > cacheLastUpdated) await cacheSecrets();
  
  if (req.params.name) {
    var paramName = req.params.name;
    response = paramsCache[paramName];
  } else {
    response = JSON.stringify(paramsCache);
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.end(response);
}

    for (let [key, value] of Object.entries(parameters)) {
      const paramValue = paramsResponse.Parameters.filter(function(param){ return param.Name == value;})[0].Value;
      paramsCache[key] = paramValue;
    }
  } catch (error) {
    throw Error(`Error fetching parameter.\n${error}`);
  }

  app.get("/parameters", function (req, res) {
    return processPayload(req, res);
  });

  app.listen(SSM_PORT, function (error) {
    if (error) throw error
    console.log(`Server started on port: ${SSM_PORT}`);
  });
}

module.exports = {
  cacheSecrets,
  saveToFile
};
