import ora from 'ora'
import { TPackError } from 'src/types/type'

export class PackError extends Error {
	failMessage?: TPackError = undefined
	originErrorMessage?: string
	constructor(failMessage: TPackError, originErrorMessage: string) {
		super()
		this.failMessage = failMessage
		this.originErrorMessage = originErrorMessage
	}
}

export function buildFailHandle(error: PackError) {
	const spinner = ora()
	spinner.fail(
		`error: ${error.failMessage?.message},code: ${error.failMessage?.code}, message: ${error?.originErrorMessage}`
	)
	spinner.clear()
}
