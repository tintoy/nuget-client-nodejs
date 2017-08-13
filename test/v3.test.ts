import { expect } from 'chai';
import 'mocha';

import { NuGetClientV3 } from '../src';

import { run } from './utils/async';

describe('Creating v3 API client with default URL', () => {
    it('should result in a client with 2 auto-complete URLs.', run(async () => {
        const client = await NuGetClientV3.createFromIndex();
        expect(client).to.not.be.null;
        expect(client.autoCompleteApiUrls).to.not.be.null;
        expect(client.autoCompleteApiUrls.length).to.equal(2);
    })).timeout(2000);
});

describe('Creating v3 API client with explicit URL', () => {
    it('should result in a client with 2 auto-complete URLs.', run(async () => {
        const client = await NuGetClientV3.createFromIndex('https://api.nuget.org/v3/index.json');
        expect(client).to.not.be.null;
        expect(client.autoCompleteApiUrls).to.not.be.null;
        expect(client.autoCompleteApiUrls.length).to.equal(2);
    })).timeout(2000);
});

describe('Default v3 API client', () => {
    let client: NuGetClientV3;
    before(run(async () => {
        client = await NuGetClientV3.createFromIndex();
    }));

    it('should suggest at least one package Id for "Newtonsoft.Json"', run(async () => {
        const suggestedPackageIds = await client.suggestPackageIds('Newtonsoft.Json');
        expect(suggestedPackageIds).to.not.be.null;
        expect(suggestedPackageIds.length).to.be.greaterThan(0);
    })).timeout(2000);

    it('should return at least one package version for "Newtonsoft.Json"', run(async () => {
        const availablePackageVersions = await client.getAvailablePackageVersions('Newtonsoft.Json');
        expect(availablePackageVersions).to.not.be.null;
        expect(availablePackageVersions.length).to.be.greaterThan(0);
    })).timeout(2000);
});
