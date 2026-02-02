/**
 * Keyboard navigation directions
 */
export type KeyboardDirection = 'up' | 'down' | 'left' | 'right';
/**
 * Keyboard action types
 */
export type KeyboardAction = {
    type: 'navigate';
    direction: KeyboardDirection;
} | {
    type: 'select';
} | {
    type: 'close';
} | {
    type: 'today';
};
/**
 * Map keyboard event to action
 */
export declare function getKeyboardAction(event: KeyboardEvent): KeyboardAction | null;
/**
 * Get new focused date after keyboard navigation
 */
export declare function getNavigatedDate(currentDate: {
    year: number;
    month: number;
    day: number;
}, direction: KeyboardDirection, addDays: (date: any, days: number) => any): {
    year: number;
    month: number;
    day: number;
};
//# sourceMappingURL=keyboard.d.ts.map