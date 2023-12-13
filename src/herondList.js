import {createDirectoryRecursive, createOutputDirectory, generate256sha, mergeTextFiles, writeFile} from './utils.js'
import path from 'path'
import {herondListName, herondListPublickey} from "./constants.js";
import childProcess from 'child_process'

export async function buildHerondList(options = {}) {
  try {
    const outputPath = await createOutputDirectory(options.version)

    await generateFilterListFile({output_path: outputPath})
    await generateManifestFiles({output_path: outputPath, version: options.version})
    await packExtension({
      executable_herond: options.executable_herond,
      extension_dir: outputPath,
      private_key: options.private_key,
      publisher_key: options.publisher_key})

  } catch (e) {
    console.error(`Error: ${e}`)
    process.exit(1)
  }
}

export async function generateFilterListFile(options = {}) {
  try {
    await createDirectoryRecursive(options.output_path)

    const outListFilePath = path.join(options.output_path, "list.txt")
    const herondListPath = path.join('filter', 'herond_list.txt')
    const abpvnPath = path.join('abpvn', 'filter', 'abpvn.txt')

    await mergeTextFiles([abpvnPath, herondListPath], outListFilePath)
    console.log("Created filter file for Herond List")

  } catch (e) {
    console.error(`Error when run generate filter list file, aborting: ${e}`)
    process.exit(1)
  }
}

export async function generateManifestFiles(options = {}) {
  try {
    await createDirectoryRecursive(options.output_path)

    const manifestContent = '{\n' +
        '  "description": "Herond Ad Block Updater extension",\n' +
        '  "key": "' + herondListPublickey + '",\n' +
        '  "manifest_version": 2,\n' +
        '  "name": "Herond Ad Block Updater (' + herondListName + ' (plaintext))",\n' +
        '  "version": "' + options.version + '"\n' +
        '}\n'

    const manifestPath = path.join(options.output_path, 'manifest.json')
    const fingerprintPath = path.join(options.output_path, 'manifest.fingerprint')

    await writeFile('', fingerprintPath)
    await writeFile(manifestContent, manifestPath)

    console.log("Created file manifest.json for Herond List, version =", options.version)
  } catch (e) {
    console.error(`Error when run generate Manifest files, aborting: ${e}`)
    process.exit(1)
  }
}

export function packExtension(options = {}) {
  try {

    const args = [
      `--pack-extension="${options.extension_dir}"`,
      `--pack-extension-key="${options.private_key}"`,
      `--brave-extension-publisher-key="${options.publisher_key}"`]
    childProcess.execSync(`"${options.executable_herond}" ${args.join(' ')}`)
    const crxOutPath = options.extension_dir + '.crx'
    const hash = generate256sha(crxOutPath)
    console.log("THE CRX FILE IS CREATED. PATH = %s, hash = %s", crxOutPath, hash)

  } catch (e) {
    console.error(`Error: ${e}`)
    process.exit(1)
  }
}