import MyPlugin from '../main'
import { Prec } from '@codemirror/state'
// @ts-ignore
import { EditorView, keymap } from '@codemirror/view'
import { editorInfoField } from 'obsidian'

export default class Delete {
	constructor(private plugin: MyPlugin) {}

	load() {
		const run = (editorView: EditorView): boolean => {
			if (this.plugin.isComposing) return false

			const data = editorView.state.field(editorInfoField)
			const editor = data.editor
			if (!editor) return false

			const cursor = editor.getCursor()
			const currentLine = editor.getLine(cursor.line)

			const isOutlineMode = /^(\t*)- /
			if (!isOutlineMode.test(currentLine)) return false

			// at line end
			if (cursor.ch === currentLine.length) {
				const nextLine = editor.getLine(cursor.line + 1)
				const currentIndent = getIndentLevel(currentLine)
				const nextIndent = getIndentLevel(nextLine)

				if (currentIndent > nextIndent || currentIndent < nextIndent) {
					return true
				} else {
					const from = cursor
					const to = {
						line: cursor.line + 1,
						ch: 2,
					}
					editor.replaceRange('', from, to)
					return false
				}
			}
			return false
		}

		this.plugin.registerEditorExtension(
			Prec.highest(
				keymap.of([
					{
						key: 'Delete',
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
