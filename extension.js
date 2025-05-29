// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
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


			const validaCobol = vscode.workspace.getConfiguration('Cobol').get('UpperCaseCobolDocumentos');
			const CobolUpperCaseComments = vscode.workspace.getConfiguration('Cobol').get('UpperCaseComments');
			const CobolUpperCaseString = vscode.workspace.getConfiguration('Cobol').get('UpperCaseString');

			const validaJcl = vscode.workspace.getConfiguration('Jcl').get('UpperCaseJclDocumentos');
			const JclUpperCaseComments = vscode.workspace.getConfiguration('Jcl').get('UpperCaseComments');
			const JclUpperCaseString = vscode.workspace.getConfiguration('Jcl').get('UpperCaseString');
			const validaRexx = vscode.workspace.getConfiguration('Rexx').get('UpperCaseRexxDocumentos');
			const RexxUpperCaseComments = vscode.workspace.getConfiguration('Rexx').get('UpperCaseComments');
			const RexxUpperCaseString = vscode.workspace.getConfiguration('Rexx').get('UpperCaseString');
			const validaHlasm = vscode.workspace.getConfiguration('Hlasm').get('UpperCaseHlasmDocumentos');
			const HlasmUpperCaseComments = vscode.workspace.getConfiguration('Hlasm').get('UpperCaseComments');
			const HlasmUpperCaseString = vscode.workspace.getConfiguration('Hlasm').get('UpperCaseString');

			// if (Alteração) {


			if ((Alterações.document.languageId == "cobol" && validaCobol) ||
				(Alterações.document.languageId == "jcl" && validaJcl) ||
				(Alterações.document.languageId == "rexx" && validaRexx) ||
				(Alterações.document.languageId == "hlasm" && validaHlasm)) {

				vscode.window.activeTextEditor.edit(edit => {
					let ativo = true;

					for (let i = 0; i < Alterações.contentChanges.length; i++) {

						Utexto = Alterações.contentChanges[i];

						const linha = Utexto.range.start.line;
						const coluna = Utexto.range.start.character;

						let textoLinha = '';

						const inicioLinha = new vscode.Position(linha, 0);
						const fimLinha = new vscode.Position(linha, coluna);
						const rangeEsquerda = new vscode.Range(inicioLinha, fimLinha);
						textoLinha = vscode.window.activeTextEditor.document.getText(rangeEsquerda);


						const texto1 = textoLinha.split("'").length - 1;
						const texto2 = textoLinha.split('"').length - 1;

						switch (Alterações.document.languageId) {
							case "cobol":

								if (textoLinha.charAt(6) == '*' && !CobolUpperCaseComments) {
									ativo = false;
								}
								if ((texto1 & 1 && !CobolUpperCaseString) || (texto2 & 1 && !CobolUpperCaseString)) {
									ativo = false;
								}

								break;

							case "jcl":

								if (textoLinha.substring(0, 3) == '//*' && !JclUpperCaseComments) {
									ativo = false;
								}
								if ((texto1 & 1 && !JclUpperCaseString) || (texto2 & 1 && !JclUpperCaseString)) {
									ativo = false;
								}

								break;

							case "rexx":

								let textoLinhaRexx = '';
								const inicioLinhaRexx = new vscode.Position(0, 0);
								const rangeEsquerdaRexx = new vscode.Range(inicioLinhaRexx, fimLinha);
								textoLinhaRexx = vscode.window.activeTextEditor.document.getText(rangeEsquerdaRexx);

								if (textoLinhaRexx.lastIndexOf('/*') > textoLinhaRexx.lastIndexOf('*/') && !RexxUpperCaseComments) {
									ativo = false;
								}
								if ((texto1 & 1 && !RexxUpperCaseString) || (texto2 & 1 && !RexxUpperCaseString)) {
									ativo = false;
								}

								break;

							case "hlasm":

								if (textoLinha.indexOf('*') >= 0 && !HlasmUpperCaseComments) {
									ativo = false;
								}
								if ((texto1 & 1 && !HlasmUpperCaseString) || (texto2 & 1 && !HlasmUpperCaseString)) {
									ativo = false;
								}

								break;

						}



						if (ativo) {



							if (Utexto.text != Utexto.text.toUpperCase()) {



								let linhaInicio = 0;
								let linhaFim = 0;
								let inicio = 0;
								let fim = 0;

								linhaInicio = Utexto.range.start.line;
								inicio = Utexto.range.start.character;
								linhaFim = Utexto.range.start.line;

								if (Utexto.text.length == 1) {
									fim = inicio + 1;
								} else {
									fim = Alterações.contentChanges[i].range.start.character + 1;
								}


								let Inicio = new vscode.Position(linhaInicio, inicio);
								let Fim = new vscode.Position(linhaFim, fim);



								let Utextotext = String(Utexto.text).toUpperCase();
								let UtextoRange = new vscode.Range(Inicio, Fim);
								edit.replace(UtextoRange, Utextotext)


							}
						}
					}
				})
			}
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
		LinguagemCase = vscode.workspace.getConfiguration(linguagemCapitalized).get(`UpperCase${linguagemCapitalized}Documentos`);
		vscode.workspace.getConfiguration(linguagemCapitalized).update(`UpperCase${linguagemCapitalized}Documentos`, !LinguagemCase).then(() => {

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
		LinguagemCase = vscode.workspace.getConfiguration(linguagemCapitalized).get(`UpperCase${linguagemCapitalized}Documentos`);
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