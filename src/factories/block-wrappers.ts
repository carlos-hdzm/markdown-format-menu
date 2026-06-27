import * as vscode from "vscode";
import { getLineBlocks } from "./selection-utils.js";

function blockWrapperFactory(
  wrapperTextInitial: string,
  wrapperTextFinal: string = wrapperTextInitial,
) {
  return function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    const originalSelections = editor.selections;
    const selectionLineBlocks = getLineBlocks(originalSelections);

    return editor
      .edit((editBuilder) => {
        selectionLineBlocks.forEach(({ start, end }) => {
          const blockStart = new vscode.Position(start, 0);
          const blockEnd = new vscode.Position(
            end,
            editor.document.lineAt(end).text.length,
          );
          editBuilder.insert(blockStart, `${wrapperTextInitial}\n`);
          editBuilder.insert(blockEnd, `\n${wrapperTextFinal}`);
        });
      })
      .then((success) => {
        if (!success) {
          return;
        }

        const newSelections = [] as vscode.Selection[];

        selectionLineBlocks.forEach(({ selections }, index) => {
          selections.forEach((selection) => {
            const originalSelectionIndex =
              originalSelections.indexOf(selection);

            const newAnchor = selection.anchor.translate(1 + 2 * index, 0);
            const newActive = selection.active.translate(1 + 2 * index, 0);
            newSelections[originalSelectionIndex] = new vscode.Selection(
              newAnchor,
              newActive,
            );
          });
        });

        editor.selections = newSelections;
      });
  };
}

const codeBlock = blockWrapperFactory("```");

export { codeBlock };
