import * as path from 'path'
import * as crypto from 'crypto'
import { outputPath } from './constants.ts'
import fs from "fs-extra";
import Log from './lib/logging.ts'

async function createOutputDirectory(version: string) {
    const componentOutputPath = path.join(outputPath, `extension_${version}`.replace(/\./g, '_'))
    await createDirectoryRecursive(componentOutputPath)
    return componentOutputPath
}

async function mergeTextFiles(filePaths: string[], outputFilePath: string) {
    let mergedContent = ''
    for (let i = 0; i < filePaths.length; i++) {
        if (fs.existsSync(filePaths[i])) {
            mergedContent += await fs.readFile(filePaths[i], 'utf8') + '\n\n'
        } else {
            Log.progress(`Missing file at ${filePaths[i]}.\n`)
        }
    }

    await writeFile(mergedContent, outputFilePath)
}

const createDirectoryRecursive = async (directoryPath: string) => {
    try {
        await fs.access(directoryPath)
    } catch (error: any) {
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

async function writeFile(content: string, filePath: string) {
    await fs.writeFile(filePath, content, 'utf8')
}

function generate256sha(file_path: string) {
    if (!fs.existsSync(file_path)) {
        Log.error("File is not existed")
        process.exit(1)
    }
    const content = fs.readFileSync(file_path)
    return crypto.createHash("sha256").update(content).digest("hex")
}

export default {
    generate256sha,
    writeFile,
    createDirectoryRecursive,
    mergeTextFiles,
    createOutputDirectory
}