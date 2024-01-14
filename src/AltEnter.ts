import MyPlugin from "../main";

export default class AltEnter {
	constructor(private plugin: MyPlugin) {}
	load() {
		this.plugin.addCommand({
			id: "add-new",
			name: "Add New",
			hotkeys: [
				{
					modifiers: ["Alt"],
					key: "Enter",
				},
			],
			editorCallback: (editor) => {
				const cursor = editor.getCursor(); // 获取当前光标位置
				const currentLine = editor.getLine(cursor.line); // 获取当前行的内容

				// 匹配行首的空格或制表符来确定缩进
				const indentMatch = currentLine.match(/^(\s*)/);
				let indent = "";
				if (indentMatch) {
					indent = indentMatch[1];
				}

				const insertText = "\n" + indent + "- "; // 将缩进添加到插入文本中
				editor.replaceRange(insertText, cursor); // 插入新内容

				// 计算新光标位置
				const newCursorPos = {
					line: cursor.line + 1, // 移动到下一行
					ch: insertText.length - 1, // 移动到插入文本的末尾
				};

				editor.setCursor(newCursorPos); // 更新光标位置
				console.log("add new");
			},
		});
	}
}
