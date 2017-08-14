import { expect } from 'chai';
import 'mocha';

import { PackageSources, getConfiguredPackageSources, getUserNuGetConfigFile } from '../src/config';
import { run } from './utils/async';

describe('getConfiguredPackageSources from user-level NuGet.config', () => {
    it('should return at least one package source', run(async () => {
        const configFile = await getUserNuGetConfigFile();
        expect(configFile).to.not.be.null;

        const packageSources: PackageSources = await getConfiguredPackageSources(configFile);
        expect(packageSources).to.not.be.null;
        const packageSourceNames: string[] = Object.getOwnPropertyNames(packageSources);
        expect(packageSourceNames.length).to.be.greaterThan(0);
    }));
});
