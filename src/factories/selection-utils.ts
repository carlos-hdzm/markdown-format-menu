import type { Selection } from "vscode";

const sortSelections = (selections: readonly Selection[]) => 
  selections.toSorted((a, b) => {
    if (a.start.line === b.start.line) {
      return a.start.character - b.start.character;
    }
    return a.start.line - b.start.line;
  });

const getLinesUnion = (selections: readonly Selection[]) => {
  const lineSet = selections.reduce((union, selection) => {
    const { start: { line: startLine }, end: { line: endLine } } = selection;

    for (let l = startLine; l <= endLine; l++) {
      union.add(l);
    }

    return union;
  }, new Set<number>());

  return [...lineSet].toSorted();
};

const getLineBlocks = (selections: readonly Selection[]) => {
  const sortedSelections = sortSelections(selections);

  let prevEndLine = -1;
  return sortedSelections.reduce((lineBlocks, selection) => {
    const { start, end } = selection;
    if (start.line === prevEndLine) {
      const prevLineBlock = lineBlocks[lineBlocks.length - 1];
      prevLineBlock.end = end.line;
      prevLineBlock.selections.push(selection);
      
    } else {
      lineBlocks.push({
        start: start.line,
        end: end.line,
        selections: [selection],
      });
    }

    prevEndLine = end.line;
    return lineBlocks;
  }, [] as { start: number, end: number, selections: Selection[] }[]);
};

export {
  sortSelections,
  getLinesUnion,
  getLineBlocks,
};