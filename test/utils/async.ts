/**
 * Run an asynchronous action as part of a test.
 * 
 * @param done The Mocha `done` function.
 * @param action The asynchronous action to perform.
 */
export function runAsync(done: MochaDone, action: () => Promise<void>): void {
    action()
        .then(() => {
            done();
        })
        .catch(error => {
            done(error);
        });
}

/**
 * Create a promise that resolves after the specified delay.
 * 
 * @param milliseconds The delay, in milliseconds.
 */
export function delay(milliseconds: number): Promise<void> {
    return new Promise((accept, reject) => {
        setTimeout(() => accept(), milliseconds);
    });
}
