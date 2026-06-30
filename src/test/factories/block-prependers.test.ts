import * as vscode from "vscode";
import { after, afterEach, before, beforeEach } from "mocha";
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

suite("Block Prependers", () => {
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

  const scope = vscode.ConfigurationTarget.Global;

  afterEach(async () => {
    const defaultConfig: Record<string, string> = {
      "unorderedListBulletString": "-",
    };

    for (let key in defaultConfig) {
      await vscode.workspace
        .getConfiguration("markdown-format-menu")
        .update(key, defaultConfig[key], scope);
    }
  });

  const testCommand = (
    commandName: string,
    prependLength: number,
    config?: Record<string, string>,
  ) =>
    async function () {
      if (config) {
        for (let key in config) {
          await vscode.workspace
            .getConfiguration("markdown-format-menu")
            .update(key, config[key], scope);
        }
      }

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
        new vscode.Selection(3, 2 + prependLength, 3, 6 + prependLength),
        new vscode.Selection(1, 2 + prependLength, 1, 6 + prependLength),
        new vscode.Selection(0, 6 + prependLength, 0, 2 + prependLength),
        new vscode.Selection(5, 2 + prependLength, 5, 2 + prependLength),
        new vscode.Selection(6, 2 + prependLength, 6, 6 + prependLength),
        new vscode.Selection(6, 10 + prependLength, 7, 2 + prependLength),
        new vscode.Selection(4, 2 + prependLength, 4, 6 + prependLength),
        new vscode.Selection(7, 6 + prependLength, 7, 10 + prependLength),
        new vscode.Selection(1, 10 + prependLength, 1, 15 + prependLength),
        new vscode.Selection(1, 20 + prependLength, 1, 23 + prependLength),
      ]);
    };

  test(
    "Unordered List - Default config (dash)",
    testCommand("unordered-list", 2),
  );
  test(
    "Unordered List - Custom config (asterisk)",
    testCommand("unordered-list", 2, {
      "unorderedListBulletString": "*",
    }),
  );
  test("Ordered List", testCommand("ordered-list", 3));
  test("Blockquote", testCommand("blockquote", 2));
  test("Heading h1", testCommand("heading1", 2));
  test("Heading h2", testCommand("heading2", 3));
  test("Heading h3", testCommand("heading3", 4));
  test("Heading h4", testCommand("heading4", 5));
  test("Heading h5", testCommand("heading5", 6));
  test("Heading h6", testCommand("heading6", 7));
});
