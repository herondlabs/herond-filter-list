import fs from 'fs-extra'
import path from 'path'

import { herondListComponentId } from './herondListUtils.js'

const outDir = path.join('build', herondListComponentId)
const versionFilePath = path.join('VERSION')
const herondListPath = path.join('filter', 'herond_list.txt')
const abpvnPath = path.join('abpvn', 'filter', 'abpvn.txt')

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

const mergeFiles = async (file1Path, file2Path, outputPath) => {
  try {
    const file1Content = fs.existsSync(file1Path) ? await fs.readFile(file1Path, 'utf8') : ""
    const file2Content = fs.existsSync(file2Path) ? await fs.readFile(file2Path, 'utf8') : ""

    const mergedContent = file1Content + '\n\n' + file2Content;

    await fs.writeFile(outputPath, mergedContent, 'utf8')

  } catch (error) {
    console.error(`Error: ${error.message}`)
    throw error
  }
}

export async function generateFilterListFile() {
  try {
    const herondListVersion = await getComponentVersion(versionFilePath)
    const componentOutPath = path.join(outDir, 'extension_' + herondListVersion).replaceAll('.', '_')
    const outListFilePath = path.join(componentOutPath, "list.txt")
    const createHerondListComponents = () => createDirectoryRecursive(componentOutPath)
    await createHerondListComponents()

    if (!fs.existsSync(abpvnPath)) {
      console.log("Missing the abpvn file, the list file is created without abpvn rules.\n")
    }

    await mergeFiles(herondListPath, abpvnPath, outListFilePath)
    console.log("Created filter file for Herond List")

    return path.join(process.cwd(), componentOutPath);

  } catch (e) {
    console.error(`Error when run generate filter list file, aborting: ${e}`)
    process.exit(1)
  }
}
