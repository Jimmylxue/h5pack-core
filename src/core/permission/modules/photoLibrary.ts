import { spinner } from 'src/base/spinner'
import { processSameMainFastPermission } from '../utils'

export async function processPhotoLibraryPermission() {
	await processSameMainFastPermission('PHOTO_LIBRARY')
	spinner.succeed('✅ Handle Native Permission PHOTO_LIBRARY SUCCESS!')
}
