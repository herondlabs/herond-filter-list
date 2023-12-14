import utils from './utils.ts'
import path from 'path'
import {herondListName, herondListPublickey} from "./constants.ts";
import childProcess from 'child_process'
import Log from './lib/logging.ts'
import * as process from "process";

async function buildHerondList(options: any = {}) {
  try {
    Log.progress('Start building Herond List')
    const outputPath = await utils.createOutputDirectory(options.version)

    await generateFilterListFile({output_path: outputPath})
    await generateManifestFiles({output_path: outputPath, version: options.version})
    packExtension({
      executable_herond: options.executable_herond,
      extension_dir: path.join(process.cwd(), outputPath),
      private_key: options.private_key,
      publisher_key: options.publisher_key})

  } catch (e) {
    Log.error(`Error: ${e}`)
    process.exit(1)
  }
}

async function generateFilterListFile(options: any = {}) {
  try {
    await utils.createDirectoryRecursive(options.output_path)

    const outListFilePath = path.join(options.output_path, "list.txt")
    const herondListPath = path.join('filter', 'herond_list.txt')
    const abpvnPath = path.join('abpvn', 'filter', 'abpvn.txt')

    await utils.mergeTextFiles([abpvnPath, herondListPath], outListFilePath)
    Log.progress('Created filter file for Herond List')

  } catch (e) {
    Log.error(`Error when run generate filter list file, aborting: ${e}`)
    process.exit(1)
  }
}

async function generateManifestFiles(options: any = {}) {
  try {
    await utils.createDirectoryRecursive(options.output_path)

    const manifestContent = '{\n' +
        '  "description": "Herond Ad Block Updater extension",\n' +
        '  "key": "' + herondListPublickey + '",\n' +
        '  "manifest_version": 2,\n' +
        '  "name": "Herond Ad Block Updater (' + herondListName + ' (plaintext))",\n' +
        '  "version": "' + options.version + '"\n' +
        '}\n'

    const manifestPath = path.join(options.output_path, 'manifest.json')
    const fingerprintPath = path.join(options.output_path, 'manifest.fingerprint')

    await utils.writeFile('', fingerprintPath)
    await utils.writeFile(manifestContent, manifestPath)

    Log.progress(`Created file manifest.json for Herond List, version =${options.version}`)
  } catch (e) {
    Log.error(`Error when run generate Manifest files, aborting: ${e}`)
    process.exit(1)
  }
}

function packExtension(options: any = {}) {
  try {

    const args = [
      `--pack-extension="${options.extension_dir}"`,
      `--pack-extension-key="${options.private_key}"`,
      `--brave-extension-publisher-key="${options.publisher_key}"`]
    childProcess.execSync(`"${options.executable_herond}" ${args.join(' ')}`)
    const crxOutPath = options.extension_dir + '.crx'
    const hash = utils.generate256sha(crxOutPath)
    Log.progress(`THE CRX FILE IS CREATED. PATH = ${crxOutPath}, hash = ${hash}`)

  } catch (e) {
    Log.error(`Error: ${e}`)
    process.exit(1)
  }
}

export default {
  buildHerondList,
  generateFilterListFile,
  generateManifestFiles,
  packExtension
}