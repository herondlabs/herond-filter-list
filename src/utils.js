import path from 'path'
import crypto from 'crypto'
import { outputPath } from './constants.js'
import fs from "fs-extra";

export async function createOutputDirectory(version) {
    const componentOutputPath = path.join(outputPath, `extension_${version}`.replaceAll('.', '_'))
    await createDirectoryRecursive(componentOutputPath)
    return componentOutputPath
}

export async function mergeTextFiles(filePaths, outputFilePath) {
    let mergedContent = ''
    for (let i = 0; i < filePaths.length; i++) {
        if (fs.existsSync(filePaths[i])) {
            mergedContent += await fs.readFile(filePaths[i], 'utf8') + '\n\n'
        } else {
            console.log(`Missing file at ${filePaths[i]}.\n`)
        }
    }

    await writeFile(mergedContent, outputFilePath)
}

export const createDirectoryRecursive = async (directoryPath) => {
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

export async function writeFile(content, filePath) {
    await fs.writeFile(filePath, content, 'utf8')
}

export function generate256sha(file_path) {
    if (!fs.existsSync(file_path)) {
        console.error("File is not existed")
        process.exit(1)
    }
    const content = fs.readFileSync(file_path)
    return crypto.createHash("sha256").update(content).digest("hex")
}