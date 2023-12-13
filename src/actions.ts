import {s3Bucket, s3Path, herondListComponentId} from "./constants.ts";
import Log from './lib/logging.ts'
import processUtils from './lib/processUtils.ts'
import * as process from "process";

async function checkVersion(options: any = {}) {
  Log.progress(`Check extension version`)

  const s3Key = `${s3Path}/${herondListComponentId}/extension_${options.version.replace(/\./g, '_')}.crx`
  const rs = processUtils.run('aws', ['s3api', 'head-object', '--bucket', s3Bucket, '--key', s3Key], {continueOnFail: true})
  if (rs.status == 0) {
    Log.error(`Extension version ${options.version} is already exist.`)
    process.exit(1)
  }
}

async function upload(options: any = {}) {
  Log.progress(`Upload extension to S3`)

  // const s3Key = `${s3Path}/${herondListComponentId}/extension_${options.version.replace(/\./g, '_')}.crx`
  // const rs = processUtils.run('aws', ['s3api', 'head-object', '--bucket', s3Bucket, '--key', s3Key], {continueOnFail: true})
  // if (rs.status == 0) {
  //   Log.error(`Extension version ${options.version} is already exist.`)
  //   process.exit(1)
  // }
}

export default {
  checkVersion,
  upload
}