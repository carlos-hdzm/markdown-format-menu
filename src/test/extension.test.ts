import * as assert from "assert";
import * as vscode from "vscode";
import { beforeEach } from "mocha";
import { expect } from "chai";

suite("Extension Test Suite", () => {
  beforeEach(async () => {
    const extension = vscode.extensions.getExtension("carlos-hdzm.markdown-format-menu");

    assert.ok(extension, "Extension not found by id");

    if (!extension!.isActive) {
      await extension!.activate();
    }
  });

  test("Command is registered", async () => {
    const commands = await vscode.commands.getCommands(true);
	const registeredCommands = [
		"markdown-format-menu.italic",
		"markdown-format-menu.bold",
		"markdown-format-menu.bold-italic",
		"markdown-format-menu.strikethrough",
		"markdown-format-menu.code-inline",
		"markdown-format-menu.code-block",
		"markdown-format-menu.link",
		"markdown-format-menu.image",
		"markdown-format-menu.unordered-list",
		"markdown-format-menu.ordered-list",
		"markdown-format-menu.blockquote",
		"markdown-format-menu.heading1",
		"markdown-format-menu.heading2",
		"markdown-format-menu.heading3",
		"markdown-format-menu.heading4",
		"markdown-format-menu.heading5",
		"markdown-format-menu.heading6",
	];
	
    expect(commands).to.include.members(registeredCommands);
  });
});
