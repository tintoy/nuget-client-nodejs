/**
 * Represents a well-known version of the NuGet API.
 */
export enum NuGetApiVersion {
    /**
     * An unknown version.
     */
    Unknown = 0,

    /**
     * v2 of the NuGet API.
     */
    V2 = 1,

    /**
     * v3 of the NuGet API.
     */
    V3 = 2
}

/**
 * The base class for NuGet auto-complete clients.
 */
export abstract class NuGetClient {
    /**
     * Create a new auto-complete client.
     */
    constructor() {}

    /**
     * The maximum number of results to return.
     */
    public defaultPageSize = 10;

    /**
     * The NuGet API version used by the client.
     */
    public abstract get apiVersion(): NuGetApiVersion;
    
    /**
     * Provide suggestions to complete a package Id.
     * 
     * @param partialId The partial package Id on which the suggestions will be based.
     * @returns {Promise<string[]>} A promise that resolves to all suggested package Ids.
     */
    public abstract suggestPackageIds(partialId: string, pageSize?: number): Promise<string[]>;

    /**
     * Get available versions for the specified package.
     * 
     * @param packageId The Id of the target package.
     * @returns {Promise<string[]>} A promise that resolves to all suggested package versions.
     */
    public abstract getAvailablePackageVersions(packageId: string, pageSize?: number): Promise<string[]>;
}
