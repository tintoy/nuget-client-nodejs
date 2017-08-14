import { fs } from 'mz';
import * as os from 'os';
import * as path from 'path';

import { Config, PackageSourceConfig, loadConfig } from './config';

/**
 * Configured package sources.
 */
export interface PackageSources {
    /**
     * Get the package source with the specified name.
     * 
     * @param packageSourceName The package source name.
     * @returns The package source URL or file-system path.
     */
    [packageSourceName: string]: string;
}

/**
 * Get configured package sources from NuGet.config.
 * 
 * @param nugetConfigPath The path to NuGet.config.
 */
export async function getConfiguredPackageSources(nugetConfigPath: string): Promise<PackageSources>
{
    const config = await loadConfig(nugetConfigPath);

    const packageSources: PackageSources = {};
    if (!config.packageSources.add)
        return packageSources;

    for (const packageSource of config.packageSources.add) {
        console.log(`PackageSource["${packageSource.key}"] = "${packageSource.value}"`);
        packageSources[packageSource.key] = packageSource.value;
    }

    return packageSources;
}

/**
 * Get the full path to the user-level NuGet.config file.
 * 
 * @returns {Promise<string | null>} A promise that resolves to NuGet.config, or null if the file does not exist.
 */
export async function getUserNuGetConfigFile(): Promise<string | null> {
    const homeDir = os.homedir();
    if (!homeDir)
        throw new Error("Cannot determine user's home directory.");

    let nugetConfigFile: string;
    if (os.platform() === 'win32') {
        nugetConfigFile = path.join(homeDir, 'AppData', 'Roaming', 'NuGet', 'NuGet.config');
    } else {
        nugetConfigFile = path.join(homeDir, '.nuget', 'NuGet', 'NuGet.config');
    }

    if (await fs.exists(nugetConfigFile))
        return nugetConfigFile;

    return null;
}
