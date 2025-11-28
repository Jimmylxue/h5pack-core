import { spinner } from 'src/base/spinner'
import { processSameMainFastPermission } from '../utils'

export async function processLocationPermission() {
	await processSameMainFastPermission('LOCATION')
	spinner.succeed('✅ Handle Native Permission LOCATION SUCCESS!')
}
