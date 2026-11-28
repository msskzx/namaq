
export const FLOW_SIZE = 0.063;

export const FLOW_LINE = 1.7;

export const WORD_GAP = 0.2;

export const flowFontSize = (width: number, zoom = 1) => width * FLOW_SIZE * zoom;

export const PHONE_WIDTH = 430;

export const CARD_MARGINS = 64;

export const wordFontSize = (screen: number) => flowFontSize(Math.min(screen, PHONE_WIDTH) - CARD_MARGINS);
