import { promises as fs } from 'fs'
import path from 'path'

import { herondListName, herondListComponentId, herondListPublickey } from './herondListUtils.js'

const outDir = path.join('build', herondListComponentId)
const versionFilePath = path.join('VERSION')

const getComponentVersion = async (versionPath) => {
  try {
    const version = await fs.readFile(versionPath, 'utf8')
    return version
  } catch (err) {
    console.error("Error: ", err)
    throw err
  }
}

const createDirectoryRecursive = async (directoryPath) => {
  try {
    await fs.access(directoryPath)
  } catch (error) {
    if (error.code === 'ENOENT') {
      const parentDirectory = path.dirname(directoryPath)
      if (parentDirectory !== directoryPath) {
        await createDirectoryRecursive(parentDirectory)
      }
      await fs.mkdir(directoryPath)
    } else {
      throw error
    }
  }
}

const createManifestFile = async (name, base64PublicKey, version, componentOutPath) => {
  const manifest = '{\n' +
                  '  "description": "Herond Ad Block Updater extension",\n' +
                  '  "key": "' + base64PublicKey + '",\n' +
                  '  "manifest_version": 2,\n' +
                  '  "name": "Herond Ad Block Updater (' + name + ' (plaintext))",\n' +
                  '  "version": "' + version + '"\n' +
                  '}\n'

  const filePath = path.join(componentOutPath, 'manifest.json')
  const manifestFingerprintPath = path.join(componentOutPath, 'manifest.fingerprint')
  fs.writeFile(manifestFingerprintPath, "")
  return fs.writeFile(filePath, manifest)
    .catch(e => console.warn('Skipped writing manifest for ' + name + ': ' + e.message))
}

export async function generateManifestFiles() {
  try {
    const herondListVersion = await getComponentVersion(versionFilePath)
    const componentOutPath = path.join(outDir, 'extension_' + herondListVersion).replaceAll('.', '_')
    const createHerondListComponents = () => createDirectoryRecursive(componentOutPath)
    const generateManifestFileForHerondList = () =>
      createManifestFile(herondListName, herondListPublickey, herondListVersion, componentOutPath)

    await createHerondListComponents()
    await generateManifestFileForHerondList()
    console.log("Created file manifest.json for Herond List, version =", herondListVersion)
  } catch (e) {
    console.error(`Error when run generate Manifest files, aborting: ${e}`)
    process.exit(1)
  }
}
