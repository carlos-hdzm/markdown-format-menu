import * as vscode from "vscode";
import { italic, bold, boldItalic, strikethrough, codeInline, link, image } from "./factories/inline-wrappers.js";
import { codeBlock } from "./factories/block-wrappers.js";
import { unorderedList, orderedList, blockquote, heading1, heading2, heading3, heading4, heading5, heading6 } from "./factories/block-prependers.js";

export function activate(context: vscode.ExtensionContext) {
  const commands = [
    vscode.commands.registerCommand("markdown-format-menu.bold", bold),
    vscode.commands.registerCommand("markdown-format-menu.italic", italic),
    vscode.commands.registerCommand("markdown-format-menu.bold-italic", boldItalic),
    vscode.commands.registerCommand("markdown-format-menu.strikethrough", strikethrough),

    vscode.commands.registerCommand("markdown-format-menu.code-inline", codeInline),
    vscode.commands.registerCommand("markdown-format-menu.code-block", codeBlock),

    vscode.commands.registerCommand("markdown-format-menu.link", link),
    vscode.commands.registerCommand("markdown-format-menu.image", image),

    vscode.commands.registerCommand("markdown-format-menu.unordered-list", unorderedList),
    vscode.commands.registerCommand("markdown-format-menu.ordered-list", orderedList),

    vscode.commands.registerCommand("markdown-format-menu.blockquote", blockquote),
    
    vscode.commands.registerCommand("markdown-format-menu.heading1", heading1),
    vscode.commands.registerCommand("markdown-format-menu.heading2", heading2),
    vscode.commands.registerCommand("markdown-format-menu.heading3", heading3),
    vscode.commands.registerCommand("markdown-format-menu.heading4", heading4),
    vscode.commands.registerCommand("markdown-format-menu.heading5", heading5),
    vscode.commands.registerCommand("markdown-format-menu.heading6", heading6),
  ];

  context.subscriptions.push(...commands);
}

export function deactivate() {}
