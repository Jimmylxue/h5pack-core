import { spinner } from 'src/base/spinner'
import { processSameMainFastPermission } from '../utils'

export async function processRecordAudioPermission() {
	await processSameMainFastPermission('RECORD_AUDIO')
	spinner.succeed('✅ Handle Native Permission RECORD_AUDIO SUCCESS!')
}
