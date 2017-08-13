/**
 * Async callback for Mocha.
 */
export type MochaDoneCallback = (done: MochaDone) => void;

/**
 * Create a Mocha callback function to run an asynchronous action as part of a test.
 * 
 * @param action The asynchronous action to perform.
 * @returns {MochaDoneCallback} The Mocha callback function.
 */
export function run(action: () => Promise<void>): MochaDoneCallback {
    return done => {
        action()
            .then(() => {
                done();
            })
            .catch(error => {
                done(error);
            });
    };
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
