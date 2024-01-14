import MyPlugin from "../main";
// import {
// 	EditorView,
// 	PluginValue,
// 	ViewPlugin,
// 	ViewUpdate,
// } from "@codemirror/view";
// import { StateField } from "@codemirror/state";

export default class Delete {
	constructor(private plugin: MyPlugin) {}

	load() {
		this.plugin.app.workspace.on("editor-change", (_, info) => {});
	}

	// load() {
	// 	this.plugin.registerEditorExtension(
	// 		EditorView.updateListener.of((update) => {
	// 			console.log("-------- Update Listener --------");
	// 			console.log("previos:", update.startState.doc.toString());
	// 			console.log("current:", update.state.doc.toString());
	// 		}),
	// 	);
	//
	// 	this.plugin.registerEditorExtension(
	// 		StateField.define<null>({
	// 			create: () => null,
	// 			update: (value, tr) => {
	// 				console.log("-------- State Field --------");
	// 				console.log("previos:", tr.startState.doc.toString());
	// 				console.log("current:", tr.state.doc.toString());
	// 				return value;
	// 			},
	// 		}),
	// 	);
	//
	// 	this.plugin.registerEditorExtension(
	// 		ViewPlugin.fromClass(
	// 			class implements PluginValue {
	// 				constructor(public view: EditorView) {}
	// 				update(update: ViewUpdate) {
	// 					console.log("-------- View Plugin --------");
	// 					console.log(
	// 						"previos:",
	// 						update.startState.doc.toString(),
	// 					);
	// 					console.log("current:", update.state.doc.toString());
	// 				}
	// 			},
	// 		),
	// 	);
	// }
}
