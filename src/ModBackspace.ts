import MyPlugin from '../main'
import { Prec } from '@codemirror/state'
// @ts-ignore
import { EditorView, keymap } from '@codemirror/view'
import { editorInfoField } from 'obsidian'
import { fromMarkdown } from 'mdast-util-from-markdown'

export default class Backspace {
	constructor(private plugin: MyPlugin) {}

	load() {
		const run = (editorView: EditorView): boolean => {
			// Bullet means the item point
			if (this.plugin.isComposing) return false

			const data = editorView.state.field(editorInfoField)
			const editor = data.editor
			if (!editor) return false

			const cursor = editor.getCursor()
			const currentLine = editor.getLine(cursor.line)
			const isOutlineMode = /^(\t*)- /
			if (!isOutlineMode.test(currentLine)) return false

			const preLine = editor.getLine(cursor.line - 1)
			const nextLine = editor.getLine(cursor.line + 1)

			const isCursorAtBullet = /^(\t*)- $/
			if (isCursorAtBullet.test(currentLine.slice(0, cursor.ch))) {
				const hasContent = cursor.ch < currentLine.length
				if (!hasContent) {
					const from = {
						line: cursor.line - 1,
						ch: preLine.length,
					}
					editor.replaceRange('', from, cursor)
					// set cursor
					editor.setCursor(cursor.line - 1, preLine.length)
					return true
				}

				const preIndent = getIndentLevel(preLine)
				const currentIndent = getIndentLevel(currentLine)
				if (preIndent === currentIndent) {
					const from = {
						line: cursor.line - 1,
						ch: preLine.length,
					}
					editor.replaceRange('', from, cursor)
					// set cursor
					editor.setCursor(cursor.line - 1, preLine.length)
					return true
				}
				return true
			} else {
				return false
			}
		}

		this.plugin.registerEditorExtension(
			Prec.highest(
				keymap.of([
					{
						mac: 'Alt-Backspace',
						win: 'Ctrl-Backspace',
						// return boolean to show the key event is handled or not
						run: run,
					},
				]),
			),
		)
	}
}

const genItem = (indentLevel: number) => {
	let text = '\n'
	for (let i = 0; i < indentLevel; i++) {
		text += '\t'
	}
	text += '- '
	return text
}

const getIndentLevel = (line: string) => {
	let indentLevel = 0
	for (let char of line) {
		if (char === '\t') {
			indentLevel += 1
		} else {
			break
		}
	}
	return indentLevel
}
