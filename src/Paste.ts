import MyPlugin from '../main'
import { EditorView } from '@codemirror/view'
import { editorInfoField } from 'obsidian'

export default class Paste {
	constructor(private plugin: MyPlugin) {}
	load() {
		// 使用EditorView.domEventHandlers创建一个视图扩展来监听粘贴事件
		const pasteHandlerExtension = EditorView.domEventHandlers({
			paste: (event, view) => {
				// 阻止默认粘贴行为
				// event.preventDefault()

				const data = view.state.field(editorInfoField)
				const editor = data.editor
				if (!editor) return false

				let text = event.clipboardData!.getData('text')

				const cursor = editor.getCursor()
				const currentLine = editor.getLine(cursor.line)

				const isOutlineMode = /^(\t*)- /

				if (!isOutlineMode.test(currentLine)) return false
				if (!isOutlineMode.test(text)) return false

				const nextLine = editor.getLine(cursor.line + 1)

				const currentIndent = getIndentLevel(currentLine)
				const nextIndent = getIndentLevel(nextLine)

				let prefix = ''
				if (nextIndent > currentIndent) {
					// 	如果next大于current，那么就按next
					for (let i = 0; i < nextIndent; i++) {
						prefix += '\t'
					}
				} else {
					// 	否则全按current
					for (let i = 0; i < currentIndent; i++) {
						prefix += '\t'
					}
				}

				text = text.trim()

				text = text
					.split('\n')
					.map((item) => {
						return prefix + item
					})
					.join('\n')

				text += '\n'

				const from = {
					line: cursor.line + 1,
					ch: 0,
				}

				console.log('fin paste', text)
				editor.replaceRange(text, from)

				return true
			},
		})

		this.plugin.registerEditorExtension(pasteHandlerExtension)
	}
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
