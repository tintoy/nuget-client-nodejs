# nuget-client

A NodeJS client the NuGet feed API.

```typescript
const client = new NuGetClient();
const suggestedPackageIds: string[] = await client.suggestPackageId('Newtonsoft');
const availablePackageVersions: string[] = await client.getAvailablePackageVersions('Newtonsoft.Json');
```

## Known issues

The NuGet API is _slow_; caching results is probably a good bet.
