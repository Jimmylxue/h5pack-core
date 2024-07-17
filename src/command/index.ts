import { spawn } from 'child_process'

export function handleCommand(
	rootDir: string,
	baseCommand: string,
	otherCommand: string[] = []
) {
	return new Promise((resolve, reject) => {
		console.log(`${baseCommand} ${otherCommand.join(' ')} 中...... in`, rootDir)
		const commandProcess = spawn(baseCommand, otherCommand, {
			cwd: rootDir,
		})

		commandProcess.stdout.on('data', data => {
			console.log(`yarn stdout: ${data}`)
		})

		commandProcess.stderr.on('data', data => {
			console.error(`yarn stderr: ${data}`)
		})

		commandProcess.on('close', code => {
			if (code !== 0) {
				reject(new Error(`yarn process exited with code ${code}`))
			} else {
				resolve(true)
			}
		})
	})
}
