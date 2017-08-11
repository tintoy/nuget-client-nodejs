#!/bin/bash

Remove-Item -Recurse .\docs -ErrorAction SilentlyContinue
& .\node_modules\.bin\typedoc.cmd --mode modules --excludePrivate --out .\docs
Set-Content .\docs\.nojekyll -Value "# Tell GitHub Pages that we're not using Jekyll"
