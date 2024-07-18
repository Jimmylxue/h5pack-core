import { spawn } from 'child_process'
import { showSpinner } from 'src/base/spinner'

export function handleCommand(
	rootDir: string,
	baseCommand: string,
	otherCommand: string[] = [],
	errorHandle?: (originErrorMessage: string) => void
) {
	return new Promise((resolve, reject) => {
		const _command = baseCommand + ' ' + otherCommand.join(' ')
		const commandProcess = spawn(baseCommand, otherCommand, {
			cwd: rootDir,
		})

		commandProcess.stdout.on('data', data => {
			showSpinner(`${_command} stdout: ${data}`)
		})

		commandProcess.stderr.on('data', data => {
			showSpinner(`${_command} stderr: ${data}`)
		})

		commandProcess.on('close', code => {
			if (code !== 0) {
				reject(new Error(`${_command} exited with code ${code}`))
			} else {
				resolve(true)
			}
		})
	}).catch(error => {
		errorHandle?.(error.message)
	})
}
