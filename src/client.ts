import { AxiosInstance, default as axios, AxiosResponse } from 'axios';

/**
 * A client for the NuGet API.
 */
export class NuGetClient {
    /**
     * The URL of the default NuGet API end-point.
     */
    public static defaultEndPointUrl = 'https://api.nuget.org/v3/index.json';

    /**
     * The URLs of NuGet API end-points used by the client.
     */
    private readonly _endPointURLs: string[];

    /**
     * The Axios HTTP client(s) used to communicate with the NuGet API.
     */
    private readonly _httpClients: AxiosInstance[];

    /**
     * Create a new {@link NuGetClient}.
     * 
     * @param endPointUrls The URLs of NuGet feed API end-points to use.
     */
    constructor(...endPointUrls: string[]) {
        if (endPointUrls && endPointUrls.length)
            this._endPointURLs = endPointUrls;
        else
            this._endPointURLs = [ NuGetClient.defaultEndPointUrl ];

        const v3Suffix = '/index.json';
        this._httpClients = this._endPointURLs.map(endPointURL => {
            // Trim off trailing 'index.json'.
            const baseUrl = endPointURL.endsWith(v3Suffix)
                ? endPointURL.substring(0, endPointURL.length - v3Suffix.length + 1)
                : endPointURL;
            
            const httpClient = axios.create({
                baseURL: baseUrl
            });

            return httpClient;
        });
    }

    /**
     * Provide suggestions to complete a package Id.
     * 
     * @param partialId The partial package Id on which the suggestions will be based.
     * @returns {Promise<string[]>} A promise that resolves to all suggested package Ids.
     */
    public async suggestPackageIds(partialId: string): Promise<string[]> {
        let url = '/package-ids?includePrerelease=true&partialId=' + encodeURIComponent(partialId);
        const requests = this._httpClients.map(
            httpClient => httpClient.get(url)
        );

        const suggestedPackageIds = new Set<string>();
        for (const request of requests) {
            let feedPackageIds = await this.getResponseOrNull<string[]>(request);
            if (!Array.isArray(feedPackageIds))
                continue;

            feedPackageIds.forEach(
                packageId => suggestedPackageIds.add(packageId)
            );
        }
        
        return Array.from(suggestedPackageIds).sort();
    }

    /**
     * Get available versions for the specified package.
     * 
     * @param packageId The Id of the target package.
     * @returns {Promise<string[]>} A promise that resolves to all suggested package versions.
     */
    public async getAvailablePackageVersions(packageId: string): Promise<string[]> {
        let url = '/package-versions/' + encodeURIComponent(packageId) + '?includePrerelease=true';
        const requests = this._httpClients.map(
            httpClient => httpClient.get(url)
        );

        const packageVersions = new Set<string>();
        for (const request of requests) {
            let feedPackageVersions = await this.getResponseOrNull<string[]>(request);
            if (!Array.isArray(feedPackageVersions))
                continue;

            feedPackageVersions.forEach(
                packageVersion => packageVersions.add(packageVersion)
            );
        }
        
        return Array.from(packageVersions).sort(); // TODO: SemVer-aware sort.
    }

    /**
     * Get the value of the specified request's response data, or null.
     * 
     * @param request A promise representing the outstanding request.
     * @returns {Promise<T | null>} A promise that resolves to the response data or null if the request failed.
     */
    private getResponseOrNull<T>(request: Promise<AxiosResponse>): Promise<T | null> {
        const responseData = request
            .then(response => response.data as T)
            .catch(error => {
                console.error(error);

                return null;
            });

        return responseData;
    }
}
