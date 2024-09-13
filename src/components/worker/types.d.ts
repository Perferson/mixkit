export type ResizerHandle = 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'bl' | 'bm' | 'br';

export type ElementLines = {
  cols: number[],
  rows: number[]
}

export type ElementLinesMap = Map<number, ElementLines>;

export type UpdateElementLinesMap = (target: number, lines: ElementLines) => void;

export type RemoveElementLines = (target: number) => void;

export type OnElementPositionUpdate = (id: number, lines: ElementLines) => void;

export type UpdateMatchedLines = (lines: ElementLines) => void;