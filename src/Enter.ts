import MyPlugin from '../main'
import { Prec } from '@codemirror/state'
// @ts-ignore
import { EditorView, keymap } from '@codemirror/view'
import { editorInfoField } from 'obsidian'

export default class Enter {
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

			const indent = getIndentLevel(currentLine)
			const insertText = genItem(indent)
			editor.replaceRange(insertText, cursor)
			// move cursor to new item
			const newCursorPos = {
				line: cursor.line + 1,
				ch: insertText.length - 1,
			}
			editor.setCursor(newCursorPos)

			return true
		}

		this.plugin.registerEditorExtension(
			Prec.highest(
				keymap.of([
					{
						key: 'Enter',
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
