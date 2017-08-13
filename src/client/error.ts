/**
 * An error raised by NuGetClients.
 */
export class NuGetClientError extends Error {
    /**
     * Create a new NuGetClientError.
     * 
     * @param message The error message.
     */
    constructor(message: string) {
        super(message);
    }
}
