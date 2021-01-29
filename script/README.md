# Scripts

The scripts in this directory use the GitHub Scripts to Rule Them All
pattern:

https://githubengineering.com/scripts-to-rule-them-all/

# Script Descriptions

- `bootstrap`: Prepare your build environment by ensuring all submodules have
  been pulled
- `cibuild`: Runs `setup`
- `containthedocs`: Wrapper script to run the build container
- `containthedocs-image`: Specifies which container image to use
- `containthedocs-wget`: Server script uses this to grab container image
- `functions`: Shared shell functions
- `server <port>`: Start an HTTP server on port 8000 in the `_build` directory.
  A custom port can be specified via the `port` argument.
- `server-dependencies`: Server script pulls dependencies from clouddocs
- `setup`: Build all docs
- `update`: Rebuild add docs (doesn't `make clean`)
