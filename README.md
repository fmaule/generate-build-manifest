# Generate `manifest.json` for NodeJS Projects

This GitHub Action generates a `manifest.json` file for your NodeJS projects, which can be especially helpful for debugging and tracking the build information. The manifest includes information such as the source control metadata, package details, and GitHub Actions runner info. This action is best used after checking out your code in a GitHub workflow.

Inspired by [make-manifest](https://github.com/guidesmiths/make-manifest).

## 🚀 Installation
To use this GitHub Action, add the following step to your GitHub workflow YAML file:

```yaml
- name: Generate manifest
  uses: fmaule/generate-manifest@1.0
```

## 📋 Prerequisites
- NodeJS project with a `package.json` file
- Git repository

## 📥 Inputs

| Input              | Description                               | Default |
|--------------------|-------------------------------------------|---------|
| `scm-info`         | Include SCM (Source Control) information  | `true`    |
| `package-info`     | Include package information               | `true`    |
| `action-info`      | Include GitHub Actions runner information | `true`    |
| `append-dockerfile`| Append a COPY command to Dockerfile       | `true`   |
| `manifest-file`    | Sets the name of the manifest file        | `build-manifest.json`|

## 💡 Usage Examples

Simple example:

```yaml
uses: fmaule/generate-manifest@v1.0
with:
  append-dockerfile: true # enable injection into docker image
```

### Full Usage Example

```yaml
jobs:
  build_with_manifest:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Generate manifest
        uses: fmaule/generate-manifest@v1.0
        with:
          action-info: false # disable writing action information to manifest
          
# ... your docker build steps go here
```

More about Docker build actions can be found [here](https://github.com/docker/build-push-action).

## 🐛 Debugging
Enable debug info by setting the secret `ACTIONS_STEP_DEBUG`. [Read more](https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs).

## 👏 Contributing
Any contribution or suggestion is more than welcome. Please open an issue or submit a pull request.

## 📚 FAQs

