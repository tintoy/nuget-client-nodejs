import { NuGetClient, NuGetApiVersion } from './base';
import { NuGetClientError } from './error';
import { NuGetClientV3, isV3IndexURL } from './v3';

/**
 * Create a NuGetClient for the specified feed.
 * 
 * @param feedURL The feed URL.
 * @param apiVersion An optional NuGet API version to use (if not specified, will attempt to auto-detect).
 */
export function createClient(feedURL: string, apiVersion?: NuGetApiVersion): Promise<NuGetClient> {
    apiVersion = apiVersion || NuGetApiVersion.Unknown;

    if (apiVersion === NuGetApiVersion.V3 || isV3IndexURL(feedURL))
        return NuGetClientV3.createFromIndex(feedURL);
    
    // AF: Only v3 supported for now.
    throw new NuGetClientError(
        `Unsupported API version "${NuGetApiVersion[apiVersion]}" for feed "${feedURL}".`
    );
}

export { NuGetClient, NuGetApiVersion } from './base';
export { NuGetClientError } from './error';
export { NuGetClientV3, defaultIndexURLV3, isV3IndexURL, NuGetIndex, NuGetApiResource } from './v3';
