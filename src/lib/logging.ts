import os from 'os'
import chalk from 'chalk'
import logUpdate from 'log-update'
import { URL } from 'url'

var logger: Logger

class Logger {
  enableLog = true
  divider: string

  progressStyle = chalk.bold.inverse
  statusStyle = chalk.green.italic
  warningStyle = chalk.black.bold.bgYellow

  cmdDirStyle = chalk.blue
  cmdCmdStyle = chalk.green
  cmdArrowStyle = chalk.magenta

  constructor() {
    this.divider = ''
    this.setLineLength()
    process.stdout.on('resize', this.setLineLength)
  }

  silent(val: boolean) {
    this.enableLog = !val
  }

  setLineLength () {
    this.divider = Array(process.stdout.columns || 32).join('-')
  }

  progress (message: string) {
    if (this.enableLog)
      console.log(this.progressStyle(message))
  }

  status(message: string) {
    if (this.enableLog)
      console.log(this.statusStyle(message))
  }

  error (message: string) {
    if (this.enableLog)
      console.error(this.progressStyle(message))
  }

  warn (message: string) {
    if (this.enableLog)
      console.error(this.warningStyle(message))
  }

  updateStatus (projectUpdateStatus: Array<{name: string, ref: string, phase: string}>) {
    const statusLines = Object.values(projectUpdateStatus).map(entry =>
      `${chalk.bold(entry.name)} (${entry.ref}): ${chalk.green.italic(entry.phase)}`
    )
    logUpdate(statusLines.join(os.EOL))
  }

  command (dir: string | URL | undefined, cmd: string, args: ReadonlyArray<string>) {
    if (this.enableLog) {
      console.log(this.divider)
      if (dir)
        console.log(this.cmdDirStyle(dir))
      console.log(`${this.cmdArrowStyle('>')} ${this.cmdCmdStyle(cmd)} ${args.join(' ')}`)
    }
  }
}

function getLogger() {
  if (logger) {
    return logger
  } else {
    logger = new Logger()
    return logger
  }
}

export default getLogger()