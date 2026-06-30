import * as vscode from "vscode";
import { getLinesUnion } from "./selection-utils.js";

function blockPrependerFactory(prependText: string) {
  return function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    const originalSelections = editor.selections;
    let prependString = prependText;
    const isOrderedList = /%d/.test(prependText);

    return editor
      .edit((editBuilder) => {
        const linesToPrepend = getLinesUnion(originalSelections);
        let prevLine = -Infinity;
        let listItem = 1;

        linesToPrepend.forEach((line) => {
          if (isOrderedList) {
            // Ordered lists start with a number that increments
            if (prevLine === line - 1) {
              listItem++;
            } else {
              listItem = 1;
            }
            prependString = prependText.replace(/%d/, listItem.toString());
          }

          editBuilder.insert(new vscode.Position(line, 0), prependString);
          prevLine = line;
        });
      })
      .then((success) => {
        if (!success) {
          return;
        }

        editor.selections = originalSelections.map((selection) => {
          const { anchor, active } = selection;

          let charTranslationStart = prependString.length;
          let charTranslationEnd = prependString.length;
          if (isOrderedList) {
            // Handle dynamic prepended text for ordered lists
            const startLineText = editor.document.lineAt(
              selection.start.line,
            ).text;
            const endLineText = editor.document.lineAt(selection.end.line).text;

            charTranslationStart = startLineText.match(/\d+\. /)![0].length;
            charTranslationEnd = endLineText.match(/\d+\. /)![0].length;
          }

          if (selection.isReversed) {
            var newAnchor = anchor.translate(0, charTranslationEnd);
            var newActive = active.translate(0, charTranslationStart);
          } else {
            var newAnchor = anchor.translate(0, charTranslationStart);
            var newActive = active.translate(0, charTranslationEnd);
          }

          return new vscode.Selection(newAnchor, newActive);
        });
      });
  };
}

const unorderedList = (unorderedListBullet: string) => blockPrependerFactory(`${unorderedListBullet} `);
const orderedList = blockPrependerFactory("%d. ");
const blockquote = blockPrependerFactory("> ");
const heading1 = blockPrependerFactory("# ");
const heading2 = blockPrependerFactory("## ");
const heading3 = blockPrependerFactory("### ");
const heading4 = blockPrependerFactory("#### ");
const heading5 = blockPrependerFactory("##### ");
const heading6 = blockPrependerFactory("###### ");

export {
  unorderedList,
  orderedList,
  blockquote,
  heading1,
  heading2,
  heading3,
  heading4,
  heading5,
  heading6,
};
