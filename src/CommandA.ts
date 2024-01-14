import MyPlugin from "../main";
import { Editor, MarkdownView } from "obsidian";
import { fromMarkdown } from "mdast-util-from-markdown";

export default class CommandA {
	private pressCount: number = 0;
	/* note
	0 select nothing

	1
		if has content
			select current line content
		else
			select current line

	2 select current line

	n select  selectHigherLevels n

	 */

	constructor(private plugin: MyPlugin) {}

	load() {
		this.plugin.addCommand({
			id: "command-a-command",
			name: "Custom command+A",
			hotkeys: [
				{
					modifiers: ["Meta"],
					key: "a",
				},
			],
			editorCallback: (editor: Editor, view: MarkdownView) =>
				this.handleCommandA(editor, view),
		});
	}

	private handleCommandA(editor: Editor, view: MarkdownView) {
		// 获取当前选择范围
		const selection = editor.getSelection();

		// 如果当前没有选择任何内容，则重置 pressCount
		if (selection === "") {
			this.pressCount = 0;
		}

		this.pressCount++;

		switch (this.pressCount) {
			case 1:
				this.selectCurrentLineContent(editor);
				break;
			case 2:
				this.selectAllCurrentLine(editor);
				break;
			default:
				this.selectHigherLevels(editor, this.pressCount - 2);
				break;
		}
	}
	// 		- 传递this来完成各种数据和环境的共享

	// 修改bug：当前行是一个markdown的列表行，以 缩进 + - 开头
	// 要求如果有列表项后面有- 有内容（空格也算内容），就选中内容。否则就选择整个列表项目
	private selectCurrentLineContent(editor: Editor) {
		const cursor = editor.getCursor(); // 获取当前光标位置
		const currentLine = cursor.line;
		const lineText = editor.getLine(currentLine); // 获取当前行的文本

		const contentStart = lineText.indexOf("- ") + "- ".length;
		const hasContent = contentStart < lineText.length;
		if (hasContent) {
			editor.setSelection(
				{
					line: currentLine,
					ch: contentStart,
				},
				{
					line: currentLine,
					ch: lineText.length,
				},
			);
		} else {
			this.pressCount++;
			this.selectAllCurrentLine(editor);
		}
	}

	private selectAllCurrentLine(editor: Editor) {
		const cursor = editor.getCursor(); // 获取当前光标位置
		const currentLine = cursor.line;
		const nextLine = currentLine + 1; // 下一行的行号

		// 设置选择范围为整行，包括行末的换行符
		editor.setSelection(
			{ line: currentLine, ch: 0 }, // 行的起始位置
			{ line: nextLine, ch: 0 }, // 下一行的起始位置
		);
	}

	private selectHigherLevels(editor: Editor, levels: number) {
		const cursor = editor.getCursor();
		const currentLine = cursor.line;
		const nextLine = currentLine + 1; // 下一行的行号
		let startLine = currentLine;
		let currentLevel = this.getIndentLevel(editor, currentLine);

		// 向上搜索，直到找到所需级别或到达文档开始
		while (startLine > 0 && levels > 0) {
			const lineAbove = startLine - 1;
			const levelAbove = this.getIndentLevel(editor, lineAbove);

			if (levelAbove < currentLevel) {
				currentLevel = levelAbove;
				levels--;
			}

			startLine = lineAbove;
		}

		// 如果在减少 levels 到 0 之前已经到达了文档顶部
		// 则选择整个文档
		if (startLine === 0 && levels > 0) {
			editor.setSelection(
				{ line: 0, ch: 0 },
				{
					line: editor.lastLine(),
					ch: editor.getLine(editor.lastLine()).length,
				},
			);
			return;
		}

		// 否则，向下选择直到下一个同级列表项或文档结束
		let endLine = startLine;
		while (endLine < editor.lineCount() - 1) {
			const lineBelow = endLine + 1;
			const levelBelow = this.getIndentLevel(editor, lineBelow);

			if (levelBelow <= currentLevel) {
				break;
			}

			endLine = lineBelow;
		}

		// 设置选择范围
		editor.setSelection(
			{ line: startLine, ch: 0 },
			{ line: nextLine, ch: 0 }, // 下一行的起始位置
		);
	}

	// 辅助函数：获取给定行的缩进级别
	private getIndentLevel(editor: Editor, line: number): number {
		const lineText = editor.getLine(line);
		const indentMatch = lineText.match(/^(\s*)/);
		return indentMatch ? indentMatch[1].length : 0;
	}
}
