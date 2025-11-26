import { spinner } from 'src/base/spinner'
import { processSameMainFastPermission } from '../utils'

export async function processCameraPermission() {
	await processSameMainFastPermission('CAMERA')
	spinner.succeed('✅ Handle Native Permission CAMERA SUCCESS!')
}
