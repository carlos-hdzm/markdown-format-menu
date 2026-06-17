import * as vscode from "vscode";

function markdownWrapperFactory(wrapperTextInitial: string, wrapperTextFinal: string = wrapperTextInitial) {
  return function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    const originalSelections = editor.selections;
    const orderedSelections = originalSelections.toSorted((a, b) => {
      if (a.start.line === b.start.line) {
        return a.start.character - b.start.character;
      }
      return a.start.line - b.start.line;
    });

    editor
      .edit((editBuilder) => {
        originalSelections.forEach((selection) => {
          const selectedText = editor.document.getText(selection) || "";
          editBuilder.replace(selection, `${wrapperTextInitial}${selectedText}${wrapperTextFinal}`);
        });
      })
      .then((success) => {
        if (!success) {
          return;
        }

        editor.selections = originalSelections.map((selection) => {
          const index = orderedSelections.findIndex((sel) =>
            sel.isEqual(selection),
          );
          const [wrapperStart, wrapperEnd] = [wrapperTextInitial.length, wrapperTextFinal.length];
          const newAnchor = selection.anchor.translate(0, wrapperStart + (wrapperStart + wrapperEnd) * index);
          const newActive = selection.active.translate(0, wrapperStart + (wrapperStart + wrapperEnd) * index);
          return new vscode.Selection(newAnchor, newActive);
        });
      });
  };
}

const italic = markdownWrapperFactory("*");
const bold = markdownWrapperFactory("**");
const boldItalic = markdownWrapperFactory("***");
const strikethrough = markdownWrapperFactory("~~");
const codeInline = markdownWrapperFactory("`");
const codeBlock = markdownWrapperFactory("```");
const link = markdownWrapperFactory("[", "](url)");
const image = markdownWrapperFactory("![", "](url)");

export function activate(context: vscode.ExtensionContext) {
  const commands = [
    vscode.commands.registerCommand("markdown-format-menu.bold", bold),
    vscode.commands.registerCommand("markdown-format-menu.italic", italic),
    vscode.commands.registerCommand("markdown-format-menu.boldItalic", boldItalic),
    vscode.commands.registerCommand("markdown-format-menu.strikethrough", strikethrough),
    vscode.commands.registerCommand("markdown-format-menu.code-inline", codeInline),
    vscode.commands.registerCommand("markdown-format-menu.code-block", codeBlock),
    vscode.commands.registerCommand("markdown-format-menu.link", link),
    vscode.commands.registerCommand("markdown-format-menu.image", image),
  ];

  context.subscriptions.push(...commands);
}

export function deactivate() {}
