import * as vscode from "vscode";
import { after, before, beforeEach } from "mocha";
import * as chai from "chai";
import chaiJestSnapshot from "chai-jest-snapshot";

const expect = chai.expect;
chai.use(chaiJestSnapshot);

const documentContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Vivamus id lacus eu velit varius fringilla.
Nam auctor massa sit amet felis tempus pellentesque.
Integer porttitor diam ipsum, eu commodo nulla blandit nec.
Vivamus lobortis tincidunt lorem in rutrum.
Integer nec eleifend risus.
In quis risus et magna dignissim placerat.
Vestibulum ut libero at lectus ultrices porta.
Nullam ut metus vitae nibh volutpat scelerisque vel in ipsum.
Etiam aliquet erat ut laoreet lacinia.
Phasellus id suscipit velit.
Praesent vulputate venenatis eros, a pulvinar metus ullamcorper non.
Suspendisse viverra velit quis ultricies blandit. Mauris eget aliquam ex.
Fusce non odio ut urna vehicula condimentum et sit amet nibh.
Etiam feugiat id orci non bibendum.
Maecenas quis augue quis odio varius laoreet.
Donec urna orci, dignissim at pharetra sit amet, placerat a eros.
Praesent hendrerit ante nisi, bibendum vulputate ipsum faucibus ut.
Duis tempor pellentesque faucibus.
Morbi scelerisque ante fringilla nunc iaculis tempor.
Donec non gravida eros, non iaculis magna.
Vivamus id accumsan neque, in ullamcorper nisi.
Etiam aliquet nulla sed fringilla facilisis.
Nam non magna aliquam, semper massa et, imperdiet ex.
Aliquam erat volutpat.
Nulla a eros sit amet massa pretium vehicula.
Mauris velit eros, dapibus ac venenatis dictum, viverra vel est.`;

before(function () {
  chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(function () {
  chaiJestSnapshot.configureUsingMochaContext(this);
});

suite("Block Wrappers", () => {
  before(async function () {
    const extension = vscode.extensions.getExtension(
      "carlos-hdzm.markdown-format-menu",
    );

    if (!extension!.isActive) {
      await extension!.activate();
    }
  });

  after(async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  });

  const testCommand = (commandName: string) =>
    async function () {
      const document = await vscode.workspace.openTextDocument({
        content: documentContent,
        language: "markdown",
      });

      const editor = await vscode.window.showTextDocument(document);

      editor.selections = [
        new vscode.Selection(3, 2, 3, 6),
        new vscode.Selection(1, 2, 1, 6),
        new vscode.Selection(0, 6, 0, 2),
        new vscode.Selection(5, 2, 5, 2),
        new vscode.Selection(6, 2, 6, 6),
        new vscode.Selection(6, 10, 7, 2),
        new vscode.Selection(4, 2, 4, 6),
        new vscode.Selection(7, 6, 7, 10),
        new vscode.Selection(1, 10, 1, 15),
        new vscode.Selection(1, 20, 1, 23),
      ];

      // Execute command
      await vscode.commands.executeCommand(
        `markdown-format-menu.${commandName}`,
      );

      const updatedText = document.getText();
      expect(updatedText).to.matchSnapshot();
      expect(editor.selections).to.deep.equal([
        new vscode.Selection(3 + 5, 2, 3 + 5, 6),
        new vscode.Selection(1 + 3, 2, 1 + 3, 6),
        new vscode.Selection(0 + 1, 6, 0 + 1, 2),
        new vscode.Selection(5 + 9, 2, 5 + 9, 2),
        new vscode.Selection(6 + 11, 2, 6 + 11, 6),
        new vscode.Selection(6 + 11, 10, 7 + 11, 2),
        new vscode.Selection(4 + 7, 2, 4 + 7, 6),
        new vscode.Selection(7 + 11, 6, 7 + 11, 10),
        new vscode.Selection(1 + 3, 10, 1 + 3, 15),
        new vscode.Selection(1 + 3, 20, 1 + 3, 23),
      ]);
    };

  test("Code Block", testCommand("code-block"));
});
