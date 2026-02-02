/**
 * Keyboard navigation directions
 */
export type KeyboardDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Keyboard action types
 */
export type KeyboardAction =
    | { type: 'navigate'; direction: KeyboardDirection }
    | { type: 'select' }
    | { type: 'close' }
    | { type: 'today' };

/**
 * Map keyboard event to action
 */
export function getKeyboardAction(event: KeyboardEvent): KeyboardAction | null {
    switch (event.key) {
        case 'ArrowUp':
            return { type: 'navigate', direction: 'up' };
        case 'ArrowDown':
            return { type: 'navigate', direction: 'down' };
        case 'ArrowLeft':
            return { type: 'navigate', direction: 'left' };
        case 'ArrowRight':
            return { type: 'navigate', direction: 'right' };
        case 'Enter':
        case ' ':
            return { type: 'select' };
        case 'Escape':
            return { type: 'close' };
        case 't':
        case 'T':
            if (event.ctrlKey || event.metaKey) {
                return { type: 'today' };
            }
            return null;
        default:
            return null;
    }
}

/**
 * Get new focused date after keyboard navigation
 */
export function getNavigatedDate(
    currentDate: { year: number; month: number; day: number },
    direction: KeyboardDirection,
    addDays: (date: any, days: number) => any
): { year: number; month: number; day: number } {
    switch (direction) {
        case 'left':
            return addDays(currentDate, -1);
        case 'right':
            return addDays(currentDate, 1);
        case 'up':
            return addDays(currentDate, -7);
        case 'down':
            return addDays(currentDate, 7);
    }
}
