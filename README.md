# nuget-client

A NodeJS client the NuGet feed API.

```javascript
import { NuGetClient, createClient } from 'nuget-client';

const client = createClient('https://api.nuget.org/v3/index.json');
const suggestedPackageIds = await client.suggestPackageId('Newtonsoft');
const availablePackageVersions = await client.getAvailablePackageVersions('Newtonsoft.Json');
```

## Known issues

The NuGet API is _slow_; caching results is probably a good bet.
