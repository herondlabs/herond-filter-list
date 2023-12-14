import {s3Bucket, s3Path, herondListComponentId, outputPath} from "./constants.ts";
import Log from './lib/logging.ts'
import processUtils from './lib/processUtils.ts'
import utils from './utils.ts'
import * as process from "process"
import path from 'path'

async function checkVersion(options: any = {}) {
  Log.progress(`Check extension version`)

  const s3Key = `${s3Path}/${herondListComponentId}/${utils.buildExtensionFileName(options.version)}`

  if (options.type == '0') {
    const rs = processUtils.run('aws', ['s3api', 'head-object', '--bucket', s3Bucket, '--key', s3Key], {continueOnFail: true})
    if (rs.status == 0) {
      Log.error(`Extension version ${options.version} is already exist.`)
      process.exit(1)
    }
  } else if (options.type == 1){
    const rs2 = processUtils.run('aws', ['s3', 'ls', `s3://${s3Bucket}/${s3Key}`], {continueOnFail: true})
    if (rs2.status == 0) {
      Log.error(`Extension version ${options.version} is already exist.`)
      process.exit(1)
    }
  }
}

async function upload(options: any = {}) {
  Log.progress(`Upload extension to S3`)

  const filePath = path.resolve(outputPath, utils.buildExtensionFileName(options.version))
  const s3Key = `s3://${s3Bucket}/${s3Path}/${herondListComponentId}/extension_${options.version.replace(/\./g, '_')}.crx`
  processUtils.run('aws', ['s3', 'cp', filePath, s3Key])
}

async function updateDb(options:any = {}) {
  Log.progress(`Update database`)

  const extensionFileName = utils.buildExtensionFileName(options.version)
  const crxFilePath = path.resolve(outputPath, extensionFileName)
  const hash = utils.generate256sha(crxFilePath)
  const publicURL = `https://${s3Bucket}.s3.amazonaws.com/${s3Path}/${herondListComponentId}/${extensionFileName}`

  // aws dynamodb update-item --table-name=herond-extensions-prod --key='{"ID": {"S": "test123"}}' --update-expression='SET Version = :v,Title = :t' --expression-attribute-values='{":v": {"S": "1.0.2"}, ":t": {"S": "test"}}'
  const key = `{"ID": {"S": "${herondListComponentId}1"}}`
  const expression = 'SET Version=:v, #u=:u, SHA256=:s'
  const attributeNames = '{"#u": "URL"}'
  const values = `{":v": {"S": "${options.version}"}, ":u": {"S": "${publicURL}"}, ":s": {"S": "${hash}"}}`
  processUtils.run('aws', ['dynamodb', 'update-item', '--table-name=herond-extensions-prod', `--key=${key}`, `--update-expression=${expression}`, `--expression-attribute-names=${attributeNames}`, `--expression-attribute-values=${values}`])
}

export default {
  checkVersion,
  upload,
  updateDb
}