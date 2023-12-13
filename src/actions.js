import {createDirectoryRecursive, createOutputDirectory, generate256sha, mergeTextFiles, writeFile} from './utils.js'
import path from 'path'
import {herondListName, herondListPublickey} from "./constants.js";
import childProcess from 'child_process'

export async function checkVersion(options = {}) {
  Log.progress(`Copy file to S3`)

  if (!workingTag) {
    Log.error('Environment variable not set')
    process.exit(1)
  }

  const parseVer = workingTag.replace('v', '').split('.').join('-')
  utils.run('aws', ['s3', 'cp', path.resolve(herondBrowserDir, 'dist_pkg_dmg', 'uni', 'Herond Browser.dmg'), `s3://herond-omaha-prod/sparkle/stable-mac-universal/Herond-Browser-${parseVer}.dmg`])
}
