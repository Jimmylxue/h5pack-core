export type TPackConfig = {
	entry: string
	name: string
	splash?: string
	logo?: string
	output?: string
	log?: boolean
	registry: 'github' | 'gitee'
}

export type TPackError = {
	code: number
	message: string
}
