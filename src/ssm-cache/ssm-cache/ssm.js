#!/usr/bin/env node
const yaml = require('js-yaml');
const fs = require('fs');
const AWS = require('aws-sdk');
const express = require("express");
const app = express();

const SSM_PORT = process.env.LAMBDA_SSM_CACHE_PORT || 4000;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const NODE_ENV = process.env.NODE_ENV || 'dev';
const CACHE_TIMEOUT = process.env.CACHE_TIMEOUT || 0.5;
const ENV_YAML_FILENAME = process.env.ENV_YAML_FILENAME || 'serverless.env.yml';

const filepath = `/var/task/${ENV_YAML_FILENAME}`;
const paramsCache = {};
let cacheLastUpdated;

async function cacheSecrets() {
  if (!fs.existsSync(filepath)) throw Error(`'${filepath}' not found.`);

  try {
    const ssmClient = new AWS.SSM({region: AWS_REGION});
    var fileContents = fs.readFileSync(filepath, 'utf8');
    var data = yaml.safeLoad(fileContents);
    if (data === null) throw Error(`File '${filepath}' cannot be empty.`);

    var parameters = data[NODE_ENV].SSM_CACHE_PARAMS;
    for (let [key, value] of Object.entries(parameters)) {
      try {
        var paramName = value;
        const paramResponse = await ssmClient.getParameter({ Name: paramName, WithDecryption: false }).promise();
        paramsCache[key] = paramResponse.Parameter.Value;
        console.log(`Fetched param: '${key}: ${value}'`);
      } catch (error) {
        console.error(`Error fetching parameter: '${key}: ${value}'.\n${error}`);
      }
    }

    // Read timeout from environment variable and set expiration timestamp
    var timeOut = parseInt(CACHE_TIMEOUT);
    var timeNow = new Date();
    timeNow.setMinutes(timeNow.getMinutes() + timeOut);
    cacheLastUpdated = timeNow;
  } catch (error) {
    console.error(`Error reading file '${filepath}'.\n${error}`);
  }
}

async function processPayload(req, res) {
  if (new Date() > cacheLastUpdated) await cacheSecrets();
  var paramName = req.params.name;
  var paramValue = paramsCache[paramName];

  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.end(paramValue);
}

async function startHttpServer() {
  app.get("/parameter/:name", function (req, res) {
    return processPayload(req, res);
  });

  app.listen(SSM_PORT, function (error) {
    if (error) throw error
    console.log(`Server started on port: ${SSM_PORT}`);
  });
}

module.exports = {
  cacheSecrets,
  startHttpServer
};
