import colors from 'picocolors'

export function logError(message: string, error: Error) {
  console.error(colors.red(message))
  console.error(error)
}

export function logInfo(message: string) {
  console.log(colors.cyan(message))
}

export function logSuccess(message: string) {
  console.log(colors.green(message))
}

export function logWarn(message: string) {
  console.log(colors.yellow(message))
}

export default {
  logError,
  logInfo,
  logSuccess,
  logWarn,
}
