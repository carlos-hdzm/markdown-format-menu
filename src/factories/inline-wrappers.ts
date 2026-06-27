import * as vscode from "vscode";
import { sortSelections } from "./selection-utils.js";

function inlineWrapperFactory(
  wrapperTextInitial: string,
  wrapperTextFinal: string = wrapperTextInitial,
) {
  return function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    const originalSelections = editor.selections;
    const orderedSelections = sortSelections(originalSelections);

    return editor
      .edit((editBuilder) => {
        originalSelections.forEach((selection) => {
          const selectedText = editor.document.getText(selection) || "";
          editBuilder.replace(
            selection,
            `${wrapperTextInitial}${selectedText}${wrapperTextFinal}`,
          );
        });
      })
      .then((success) => {
        if (!success) {
          return;
        }

        const [wrapperStart, wrapperEnd] = [
          wrapperTextInitial.length,
          wrapperTextFinal.length,
        ];

        let charTranslation = 0;
        let prevSelectionEndLine = -1;
        const newSelections = [] as vscode.Selection[];

        orderedSelections.forEach((selection) => {
          const originalSelectionIndex = originalSelections.indexOf(selection);
          const { start, end } = selection;

          if (start.line > prevSelectionEndLine) {
            charTranslation = 0;
          }
          const newStart = start.translate(0, wrapperStart + charTranslation);

          let newEnd: vscode.Position;
          if (end.line > start.line) {
            newEnd = end;
            charTranslation = wrapperEnd;
          } else {
            newEnd = end.translate(0, wrapperStart + charTranslation);
            charTranslation += wrapperStart + wrapperEnd;
          }
          prevSelectionEndLine = end.line;

          const [newAnchor, newActive] = selection.isReversed
            ? [newEnd, newStart]
            : [newStart, newEnd];

          newSelections[originalSelectionIndex] = new vscode.Selection(
            newAnchor,
            newActive,
          );
        });

        editor.selections = newSelections;
      });
  };
}

const italic = inlineWrapperFactory("*");
const bold = inlineWrapperFactory("**");
const boldItalic = inlineWrapperFactory("***");
const strikethrough = inlineWrapperFactory("~~");
const codeInline = inlineWrapperFactory("`");
const link = inlineWrapperFactory("[", "](url)");
const image = inlineWrapperFactory("![", "](url)");

export { italic, bold, boldItalic, strikethrough, codeInline, link, image };
