import ora from 'ora'
import { packConfig } from './handleConfig'
export let spinner = ora()
export let otherSpinner = ora()

export function showSpinner(message: string) {
	if (packConfig.log) {
		otherSpinner.info(message)
	}
}
