import { spawn } from 'child_process'

export function handleCommand(
	rootDir: string,
	baseCommand: string,
	otherCommand: string[] = [],
	errorHandle?: (originErrorMessage: string) => void
) {
	return new Promise((resolve, reject) => {
		const _command = baseCommand + ' ' + otherCommand.join(' ')
		console.log(`${baseCommand} ${otherCommand.join(' ')} 中...... in`, rootDir)
		const commandProcess = spawn(baseCommand, otherCommand, {
			cwd: rootDir,
		})

		commandProcess.stdout.on('data', data => {
			console.log(`${_command} stdout: ${data}`)
		})

		commandProcess.stderr.on('data', data => {
			console.error(`${_command} stderr: ${data}`)
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
