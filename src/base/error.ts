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
	console.log('捕获的', error.failMessage, error.originErrorMessage)
}
