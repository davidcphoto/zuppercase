// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let Alteração = true;
let Utexto;

let myStatusBarItem;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	vscode.window.onDidChangeActiveTextEditor(() => {
		myStatusBarItem.hide();
		Statusbar();
	});


	vscode.workspace.onDidChangeConfiguration(() => {
		Statusbar();
	});

	vscode.workspace.onDidChangeTextDocument(Alterações => {

		Statusbar();

		if (Alterações.reason == undefined) {


			const validaCobol = vscode.workspace.getConfiguration('zCase').get('UpperCaseCobolDocumentos');
			const validaJcl = vscode.workspace.getConfiguration('zCase').get('UpperCaseJclDocumentos');
			const validaRexx = vscode.workspace.getConfiguration('zCase').get('UpperCaseRexxDocumentos');
			const validaHlasm = vscode.workspace.getConfiguration('zCase').get('UpperCaseHlasmDocumentos');

			if(Alteração) {

				for (let i = 0; i < Alterações.contentChanges.length; i++) {

					Utexto = Alterações.contentChanges[i];

					if ((Alterações.document.languageId == "cobol" && validaCobol) ||
						(Alterações.document.languageId == "jcl" && validaJcl) ||
						(Alterações.document.languageId == "rexx" && validaRexx) ||
						(Alterações.document.languageId == "hlasm" && validaHlasm)) {




						if (Utexto.text != Utexto.text.toUpperCase()) {

							vscode.window.activeTextEditor.edit(edit => {


								let linhaInicio = 0;
								let linhaFim = 0;
								let inicio = 0;
								let fim = 0;

								linhaInicio = Utexto.range.start.line;
								inicio = Utexto.range.start.character;

								if (Utexto.rangeLength.length == 1) {
									linhaFim = Utexto.range.end.line;
									fim = Alterações.contentChanges[i].range.end.character + 1;
								} else {
									linhaFim = Utexto.range.start.line;
									fim = Alterações.contentChanges[i].range.start.character + 1;
								}


								const Inicio = new vscode.Position(linhaInicio, inicio);
								const Fim = new vscode.Position(linhaFim, fim);



								const Utextotext = String(Utexto.text).toUpperCase();
								const UtextoRange = new vscode.Range(Inicio, Fim);
								edit.replace(UtextoRange, Utextotext);
								Alteração[i] = false;
							})

						}
					}
				}
			}
		} else {
			Alteração = true;
		}
	})


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "zCase" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('zCase.Mudar', function () {
		// The code you place here will be executed every time your command is executed

		const Linguagem = vscode.window.activeTextEditor.document.languageId;
		const linguagemCapitalized = Linguagem.charAt(0).toUpperCase() + Linguagem.slice(1);
		let LinguagemCase = true;
		LinguagemCase = vscode.workspace.getConfiguration('zCase').get(`UpperCase${linguagemCapitalized}Documentos`);
		vscode.workspace.getConfiguration('zCase').update(`UpperCase${linguagemCapitalized}Documentos`, !LinguagemCase).then(() => {

			Statusbar();

		});


	});


	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	Statusbar();

	// statusBarItem.command = 'zCase.Mudar';

	context.subscriptions.push(disposable);
	context.subscriptions.push(myStatusBarItem);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

function Statusbar() {

	const Linguagem = vscode.window.activeTextEditor.document.languageId;
	if (["cobol", "rexx", "jcl", "hlasm"].includes(Linguagem)) {
		const linguagemCapitalized = Linguagem.charAt(0).toUpperCase() + Linguagem.slice(1);
		let LinguagemCase = true;
		LinguagemCase = vscode.workspace.getConfiguration('zCase').get(`UpperCase${linguagemCapitalized}Documentos`);
		let icon = '';

		if (LinguagemCase) {
			icon = "$(pass)";
		} else {
			icon = "$(circle-large-outline)";
		}

		myStatusBarItem.command = 'zCase.Mudar';
		myStatusBarItem.name = 'zCase';
		myStatusBarItem.text = `zCase ${icon}`;
		myStatusBarItem.tooltip = `zCase - Uppercase for the language ${vscode.window.activeTextEditor.document.languageId} is ${LinguagemCase}`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.hide();
	}
}