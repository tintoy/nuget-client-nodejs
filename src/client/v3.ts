import { default as axios } from 'axios';
import * as semver from 'semver';

import { NuGetClient, NuGetApiVersion } from './base';

/**
 * The default URL for the NuGet v3 API index.
 */
export const defaultIndexURLV3 = 'https://api.nuget.org/v3/index.json';

/**
 * Determine whether the specified base URL represents the index for v3 of the NuGet API.
 * 
 * @param indexURL The URL to examine.
 */
export function isV3IndexURL(indexURL: string): boolean {
    return indexURL.endsWith('/v3/index.json');
}

/**
 * A client for v3 of the NuGet API.
 */
export class NuGetClientV3 extends NuGetClient {
    /**
     * The URLs for API end-points used by the client.
     */
    private readonly autoCompleteApiUrls: string[];

    /**
     * Create a new NuGet v3 API client.
     * 
     * @param apiResources Available NuGet API resources (used to select API end-points).
     */
    constructor(apiResources: NuGetApiResource[]) {
        super();

        this.autoCompleteApiUrls = apiResources
            .filter(resource => resource['@type'] === 'SearchAutocompleteService')
            .map(resource => resource['@id']);
    }

    /**
     * The NuGet API version used by the client.
     */
    public get apiVersion(): NuGetApiVersion {
        return NuGetApiVersion.V3;
    }

    /**
     * Provide suggestions to complete a package Id.
     * 
     * @param partialId The partial package Id on which the suggestions will be based.
     * @returns {Promise<string[]>} A promise that resolves to all suggested package Ids.
     */
    public async suggestPackageIds(partialId: string, pageSize?: number): Promise<string[]> {
        pageSize = pageSize || this.defaultPageSize;

        const requests = this.autoCompleteApiUrls.map(baseURL => axios.get(
            `${baseURL}?q=${encodeURIComponent(partialId)}&take=${pageSize}&prerelease=true`
        ));

        const suggestedPackageIds = new Set<string>();
        const responses = await Promise.all(requests);
        for (const response of responses) {
            const packageIds = response.data.data;
            if (Array.isArray(packageIds)) {
                packageIds.forEach(
                    packageId => suggestedPackageIds.add(packageId)
                );
            }
        }

        return Array.from(suggestedPackageIds.values()).sort();
    }

    /**
     * Get available versions for the specified package.
     * 
     * @param packageId The Id of the target package.
     * @returns {Promise<string[]>} A promise that resolves to all suggested package versions.
     */
    public async getAvailablePackageVersions(packageId: string, pageSize?: number): Promise<string[]> {
        pageSize = pageSize || this.defaultPageSize;
        
        const requests = this.autoCompleteApiUrls.map(baseURL => axios.get(
            `${baseURL}?id=${encodeURIComponent(packageId)}&take=${pageSize}&prerelease=true`
        ));

        const availablePackageVersions = new Set<string>();
        const responses = await Promise.all(requests);
        for (const response of responses) {
            const packageVersions = response.data.data;
            if (Array.isArray(packageVersions)) {
                packageVersions.forEach(
                    packageVersion => availablePackageVersions.add(packageVersion)
                );
            }
        }

        return Array.from(availablePackageVersions.values()).sort(this.comparePackageVersions);
    }

    /**
     * Compare the specified package versions for sorting purposes.
     * 
     * @param version1 The first package version.
     * @param version2 The second package version.
     * @returns 0, if the versions are equal, 1 if version1 is greater, or -1 if version2 is greater.
     */
    private comparePackageVersions(version1: string, version2: string): number {
        return semver.compare(version1, version2);
    }

    /**
     * Create a new v3 API client from the NuGet v3 API index.
     * 
     * @param apiIndexURL The URL of the API index to use (defaults to defaultIndexURLV3).
     */
    public static async createFromIndex(apiIndexURL?: string): Promise<NuGetClientV3> {
        apiIndexURL = apiIndexURL || defaultIndexURLV3;

        const indexResponse = await axios.get(apiIndexURL);
        const index: NuGetIndex = indexResponse.data;
        if (!index || !Array.isArray(index.resources))
            throw new Error('Request for the NuGet API index failed.');

        return new NuGetClientV3(index.resources);
    }
}

/**
 * Represents the index response from the NuGet v3 API.
 */
export interface NuGetIndex {
    /**
     * Available API resources.
     */
    resources: NuGetApiResource[];
}

/**
 * Represents a NuGet API resource.
 */
export interface NuGetApiResource {
    /**
     * The resource Id (end-point URL).
     */
    '@id': string;

    /**
     * The resource type.
     */
    '@type': 'SearchQueryService' | 'SearchAutocompleteService' | 'PackageBaseAddress/3.0.0';

    /**
     * An optional comment describing the resource.
     */
    comment?: string;
}
