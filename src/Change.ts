import MyPlugin from "../main";
// import {
// 	EditorView,
// 	PluginValue,
// 	ViewPlugin,
// 	ViewUpdate,
// } from "@codemirror/view";
// import { StateField } from "@codemirror/state";

export default class Change {
	constructor(private plugin: MyPlugin) {}

	load() {
		this.plugin.app.workspace.on("editor-change", (editor) => {
			const firstLine = editor.getLine(0); // 获取第一行的内容
			const lineCount = editor.lineCount();
			const lastLine = editor.getLine(lineCount - 1); // 获取最后一行的内容

			// if (!firstLine.startsWith("- ")) {
			// 	// 如果第一行不是以“- ”开头
			// 	editor.replaceRange("- ", { line: 0, ch: 0 }); // 在文档开始处插入“-”
			// }

			// if (!lastLine.endsWith("- ")) {
			// 	// 如果最后一行不是以“-”结尾
			// 	editor.replaceRange("- ", {
			// 		line: lineCount - 1,
			// 		ch: lastLine.length,
			// 	}); // 在文档末尾添加“-”
			// }
		});
	}
}
