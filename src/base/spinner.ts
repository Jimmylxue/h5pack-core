import ora from 'ora'
import { packConfig } from './handleConfig'
export let spinner = ora()
export let otherSpinner = ora()

let otherSpinnerStarted = false
let lastUpdateTime = 0
const THROTTLE_MS = 100 // 节流间隔，避免 spinner 疯狂跳动
let pendingMessage = ''
let throttleTimer: ReturnType<typeof setTimeout> | null = null
let mainSpinnerText = '' // 记录主 spinner 的文本，子进程结束后恢复

/**
 * 在同一行更新子进程输出，而不是每次打印新行
 * 通过节流限制更新频率，避免高频 data 事件导致 spinner 剧烈跳动
 */
export function showSpinner(message: string) {
	if (packConfig.log) {
		// 取最后一行，避免多行输出撑爆显示
		const lastLine = message.trim().split('\n').pop()?.trim() || message.trim()
		pendingMessage = lastLine

		const now = Date.now()
		const elapsed = now - lastUpdateTime

		if (elapsed >= THROTTLE_MS) {
			// 距离上次更新已超过节流间隔，立即更新
			lastUpdateTime = now
			applySpinnerUpdate(lastLine)
		} else if (!throttleTimer) {
			// 还在节流窗口内，设置定时器延迟更新
			throttleTimer = setTimeout(() => {
				throttleTimer = null
				lastUpdateTime = Date.now()
				applySpinnerUpdate(pendingMessage)
			}, THROTTLE_MS - elapsed)
		}
		// 否则已有定时器等待中，pendingMessage 已更新，等定时器触发时会用最新值
	}
}

function applySpinnerUpdate(text: string) {
	if (!otherSpinnerStarted) {
		// 子进程输出开始时，暂停主 spinner，避免两个 spinner 同时活跃导致闪烁
		if (spinner.isSpinning) {
			mainSpinnerText = spinner.text || mainSpinnerText
			spinner.stop()
		}
		otherSpinner.start(text)
		otherSpinnerStarted = true
	} else {
		otherSpinner.text = text
	}
}

/**
 * 子进程结束后，将 spinner 置为 succeed 状态并重置
 * 恢复主 spinner 的显示
 */
export function finishShowSpinner() {
	if (otherSpinnerStarted) {
		otherSpinner.succeed()
		otherSpinnerStarted = false
		// 恢复主 spinner
		if (mainSpinnerText) {
			spinner.start(mainSpinnerText)
		}
	}
}
