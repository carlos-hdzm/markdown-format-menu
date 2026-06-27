import * as vscode from "vscode";
import { expect } from "chai";
import { getLineBlocks, getLinesUnion, sortSelections } from "../../factories/selection-utils.js";

suite("sortSelections", () => {
  test("returns the same array when only one selection is provided", () => {
    const selections = [{
      start: { line: 2, character: 5 },
      end: { line: 2, character: 10 },
    }] as unknown as readonly vscode.Selection[];

    const result = sortSelections(selections);

    expect(result).to.deep.equal(selections);
  });

  test("returns the same array when selections are already in order", () => {
    const selections = [
      {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 3 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 2 },
      },
      {
        start: { line: 2, character: 0 },
        end: { line: 2, character: 4 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = sortSelections(selections);

    expect(result).to.deep.equal(selections);
  });

  test("sorts selections correctly when all selections have different lines", () => {
    const selections = [
      {
        start: { line: 5, character: 0 },
        end: { line: 5, character: 1 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 2 },
      },
      {
        start: { line: 3, character: 0 },
        end: { line: 3, character: 4 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = sortSelections(selections);

    expect(result).to.deep.equal([
      selections[1],
      selections[2],
      selections[0],
    ]);
  });

  test("sorts selections with the same line by start character", () => {
    const selections = [
      {
        start: { line: 2, character: 10 },
        end: { line: 2, character: 12 },
      },
      {
        start: { line: 2, character: 2 },
        end: { line: 2, character: 4 },
      },
      {
        start: { line: 2, character: 5 },
        end: { line: 2, character: 7 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = sortSelections(selections);

    expect(result).to.deep.equal([
      selections[1],
      selections[2],
      selections[0],
    ]);
  });

  test("sorts multi-line selections correctly when only start line differs", () => {
    const selections = [
      {
        start: { line: 5, character: 0 },
        end: { line: 10, character: 0 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 3, character: 5 },
      },
      {
        start: { line: 3, character: 9 },
        end: { line: 4, character: 0 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = sortSelections(selections);

    expect(result).to.deep.equal([
      selections[1],
      selections[2],
      selections[0],
    ]);
  });

  test("sorts multi-line selections with the same start line by start character", () => {
    const selections = [
      {
        start: { line: 7, character: 10 },
        end: { line: 8, character: 0 },
      },
      {
        start: { line: 2, character: 2 },
        end: { line: 3, character: 5 },
      },
      {
        start: { line: 4, character: 5 },
        end: { line: 5, character: 0 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = sortSelections(selections);

    expect(result).to.deep.equal([
      selections[1],
      selections[2],
      selections[0],
    ]);
  });
});

suite("getLinesUnion", () => {
  test("returns lines union when only one selection is provided", () => {
    const selections = [{
      start: { line: 2, character: 5 },
      end: { line: 2, character: 10 },
    }] as unknown as readonly vscode.Selection[];

    const result = getLinesUnion(selections);

    expect(result).to.have.deep.members([2]);
  });

  test("returns lines union for multiple single-line selections", () => {
    const selections = [
      {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 3 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 2 },
      },
      {
        start: { line: 2, character: 0 },
        end: { line: 2, character: 4 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = getLinesUnion(selections);

    expect(result).to.have.deep.members([0, 1, 2]);
  });

  test("returns lines union for multiple selections on the same line", () => {
    const selections = [
      {
        start: { line: 2, character: 10 },
        end: { line: 2, character: 12 },
      },
      {
        start: { line: 2, character: 2 },
        end: { line: 2, character: 4 },
      },
      {
        start: { line: 2, character: 5 },
        end: { line: 2, character: 7 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = getLinesUnion(selections);

    expect(result).to.have.deep.members([2]);
  });

  test("returns lines union for multiple-line selections", () => {
    const selections = [
      {
        start: { line: 5, character: 0 },
        end: { line: 10, character: 0 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 3, character: 5 },
      },
      {
        start: { line: 3, character: 9 },
        end: { line: 4, character: 0 },
      },
      {
        start: { line: 12, character: 4 },
        end: { line: 16, character: 10 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = getLinesUnion(selections);

    expect(result).to.have.deep.members([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16]);
  });
});

suite("getLineBlocks", () => {
  test("returns lines blocks when only one selection is provided", () => {
    const selections = [{
      start: { line: 2, character: 5 },
      end: { line: 2, character: 10 },
    }] as unknown as readonly vscode.Selection[];

    const result = getLineBlocks(selections);

    expect(result).to.have.deep.members([{
      start: 2,
      end: 2,
      selections,
    }]);
  });

  test("returns lines blocks for multiple single-line selections", () => {
    const selections = [
      {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 3 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 2 },
      },
      {
        start: { line: 2, character: 0 },
        end: { line: 2, character: 4 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = getLineBlocks(selections);

    expect(result).to.have.deep.members([{
      start: 0,
      end: 0,
      selections: [selections[0]],
    }, {
      start: 1,
      end: 1,
      selections: [selections[1]],
    }, {
      start: 2,
      end: 2,
      selections: [selections[2]],
    }]);
  });

  test("returns lines blocks for multiple selections on the same line", () => {
    const selections = [
      {
        start: { line: 2, character: 10 },
        end: { line: 2, character: 12 },
      },
      {
        start: { line: 2, character: 2 },
        end: { line: 2, character: 4 },
      },
      {
        start: { line: 2, character: 5 },
        end: { line: 2, character: 7 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = getLineBlocks(selections);

    expect(result).to.have.deep.members([{
      start: 2, 
      end: 2,
      selections: [
        selections[1],
        selections[2],
        selections[0],
      ],
    }]);
  });

  test("returns lines blocks for multiple-line selections", () => {
    const selections = [
      {
        start: { line: 5, character: 0 },
        end: { line: 10, character: 0 },
      },
      {
        start: { line: 1, character: 0 },
        end: { line: 3, character: 5 },
      },
      {
        start: { line: 3, character: 9 },
        end: { line: 4, character: 0 },
      },
      {
        start: { line: 12, character: 4 },
        end: { line: 16, character: 10 },
      },
    ] as unknown as readonly vscode.Selection[];

    const result = getLineBlocks(selections);

    expect(result).to.have.deep.members([{
      start: 1,
      end: 4,
      selections: [
        selections[1],
        selections[2],
      ],
    }, {
      start: 5,
      end: 10,
      selections: [selections[0]],
    }, {
      start: 12,
      end: 16,
      selections: [selections[3]],
    }]);
  });
});
