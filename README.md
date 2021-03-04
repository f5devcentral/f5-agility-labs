# f5-agility-labs

[![master](https://travis-ci.com/f5devcentral/f5-agility-labs.svg?branch=master)](https://travis-ci.org/f5devcentral/f5-agility-labs)
[![Issues](https://img.shields.io/github/issues/f5devcentral/f5-agility-labs)](https://github.com/f5devcentral/f5-agility-labs/issues)

This repository contains the build infrastructure used to create lab content
for F5 Networks Agility Labs hosted at http://clouddocs.f5.com

It is recommended that you use the Sphinx lab template here:

https://github.com/f5devcentral/f5-agility-labs-template

This repository leverages a CI/CD toolchain with full build, test and publish
to production environment.

# Install/Build Content

- `git clone https://github.com/f5devcentral/f5-agility-labs.git`
- `cd f5-agility-labs`
- `script/setup`
- Built content will be in the `_build` directory
- `script/server` will start a python SimpleHTTPServer in `_build`
- Browse to `http://localhost:8000`

# Adding your Lab

**At this time only F5 Networks employees can request addition of a lab**

To add your lab to this repository please email:

 - *AgilityLabsRTD

Be sure to include your lab repository URL.

# Repo Structure

All labs are included as git submodules in the `labs` directory.  The submodule
tracks the `master` branch on the remote repository.  It should be assumed that
all commits to `master` will be published to a production environment.

The scripts in the `script` directory automatically build HTML and PDF content
and output to the `_build/<lab_name>/[html|pdf]/` directory.

During build an index page is generated using the Sphinx project in `docs`.  The
generated index is then copied to the `_build` directory.

# Branches

- `master`: Protected branch; **HEAD publishes to production**; No push access
- `develop`: Protected branch; Pull Requests are tested through Travis CI
  before merge

All modifications to this repo should be via a Pull Request to the `develop`
branch.  PR's will be tested before merge.  Repo admins will then merge
`develop` to `master` as required to publish to production.

# Update Lab Submodule

First be sure to do a `git pull`

To `pull` the latest commits for **ALL** submodules:

`git submodule update --recursive --remote`

To `pull` the latest commits for a specific submodule:

`git submodule update --remote labs/<name>`

Push new commit hashes for submodules:

- `git commit -a -m "commit msg"`
- `git push`

# Add Lab Submodule

- `git submodule add <repo_url> labs/<name>`
- `git commit -a -m "commit msg"`
- `git push`

# Remove Lab Submodule

- `git submodule deinit -f labs/<name>`
- `rm -rf .git/modules/labs/<name>`
- `git rm -f labs/<name>`

# Build Options

The following environment variables can be used to modify what is built:

- ``SKIP_BUILDLABS``: Presense of the variable will cause lab content 
  build to be skipped.  Landing page will still be built

  - Example: ``export SKIP_BUILDLABS=1``

- ``BUILD_LIST``: A space delimted list of lab submodules to build.  By 
  default the contents of the labs/ submodule directory are populated
  in this variable.  Setting allows you to build only specific labs

  - Example: ``export BUILD_LIST="adc ddos programmability"``

- ``BUILD_ALL``: Force a build of all submodules in ``BUILD_LIST``

  - Example: ``export BUILD_ALL=1``

- ``AWS_S3_RM_DIR``: Removes the corresponding Lab directory from S3 bucket.

  - Example: ``export AWS_S3_RM_DIR=1``
