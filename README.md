# ⚙️ Generate manifest.json for NodeJS projects

Use this action to generate (and optionally inject) a manifest file in your Docker image.

Inspired by [make-manifest](https://github.com/guidesmiths/make-manifest) to replace it in GitHub workflows.

You need to use this action AFTER checking out your code.

# 🤨 Why?

It's good practice to ship some basic information about your application build in case you need to rebuild or debug it from source. It can also be useful to guarantee at least one new layer if you're deploying your application within a docker image. Copying a freshly generated manifest in the last step of your Dockerfile will achieve this.

### Example output manifest.json

```
{
  "timestamp": "2022-03-01T15:06:02.897Z",
  "scm": {
    "remote": "git@github.com:fmaule/test-playground.git",
    "branch": "main",
    "commit": "6eca3ecdf80a78e3bfbbfbd37da02a85cea63c96"
  },
  "name": "test-package",
  "version": "0.0.3",
  "ghAction": {
    "workflow": "docker build",
    "runner": {
      "arch": "X64",
      "name": "Hosted Agent",
      "os": "Linux"
    }
  }
}
```

# 📥 Inputs

## `scm-info`
`on/off`: default on

Write information related to the ref in the manifest (remote, branch name, commit sha).

## `package-info`
`on/off`: default on 

Write package information. 
Works only if it's a project with a package.json (package name, package version)

## `action-info`
`on/off`: default on

Write action related info. (workflow name, runner info)

## `append-dockerfile`
`on/off`: default off

**WARNING** this is experimental.
Appends a COPY command to Dockerfile that injects the manifest file in your WORKDIR before building the image.

## `manifest-name`
`filename`: default `manifest.json`

Sets the name of the manifest file.

# 💡 Usage examples

```
uses: fmaule/generate-manifest@v1
with:
  append-dockerfile: 'on' # enable injection into docker image
```

### Full usage example
```
jobs:
build_with_manifest:
  runs-on: ubuntu-latest
  name: Generate manifest and build docker image
  steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Hello world action step
      uses: fmaule/generate-manifest@v1
      with:
        append-dockerfile: 'on' # enable injection into docker image

[...docker build steps]
```
More about docker build actions: [here](https://github.com/docker/build-push-action)

# 🐛 Debugging
You can set the secret `ACTIONS_STEP_DEBUG` to enable debug info.
https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs


# 👏 Contributing
Any contribution / suggestion is more than welcome.