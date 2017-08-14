import { fs } from 'mz';

import { parseXml } from '../utils/xml';

/**
 * Represents the configuration from NuGet.config.
 */
export interface Config {
    /**
     * Package sources to add.
     */
    packageSources?: PackageSourcesConfig;
}

/**
 * The configuration for one or more package sources.
 */
export interface PackageSourcesConfig {
    /**
     * Add a package source.
     */
    add?: PackageSourceConfig[];
}

/**
 * The configuration for a package source.
 */
export interface PackageSourceConfig {
    /**
     * The package source name.
     */
    key: string;
    
    /**
     * The package source's URI or file-system path.
     */
    value: string;
}

/**
 * Load NuGet configuration from from the specified file.
 * 
 * @param filePath The full path to NuGet.config.
 */
export async function loadConfig(filePath: string): Promise<Config> {
    const configXml = await fs.readFile(filePath, { encoding: 'utf8' });

    return await parseXml<Config>(configXml);
}
