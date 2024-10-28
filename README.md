# GitHub Action: generate build manifest

This GitHub Action creates a `build-manifest.json` for NodeJS projects, enhancing traceability and debugging capabilities of your builds. The generated manifest offers detailed insights into various aspects of your project, such as source control metadata, package details, and the environment specifics of the GitHub Actions runner. By integrating this manifest into your build process, you gain a comprehensive overview of your application's build history and current state. This can be invaluable for debugging, ensuring consistent deployments, and understanding the nuances of each build.

Inspired by [make-manifest](https://github.com/guidesmiths/make-manifest).

## 🚀 Installation

To use this GitHub Action, add the following step to your GitHub workflow YAML file:

```yaml
- name: Generate manifest
  uses: fmaule/generate-build-manifest@v3
```

## 📋 Prerequisites

- NodeJS project with a `package.json` file
- Git repository

## 📥 Inputs

<!-- start inputs -->

| **Input**               | **Description**                                                           | **Default**           | **Required** |
| ----------------------- | ------------------------------------------------------------------------- | --------------------- | ------------ |
| **`scm-info`**          | Get information from SCM/GitHub                                           | `true`                | **false**    |
| **`package-info`**      | Get information from package.json                                         | `true`                | **false**    |
| **`action-info`**       | Write GitHub action info in the manifest                                  | `true`                | **false**    |
| **`package-json`**      | Provide the path for the package.json (name included)                     | `./package.json`      | **false**    |
| **`dockerfile`**        | Provide the path for the Dockerfile (name included)                       | `./Dockerfile`        | **false**    |
| **`append-dockerfile`** | Automatically append COPY command in Dockerfile                           | `true`                | **false**    |
| **`manifest-file`**     | Manifest filename                                                         | `build-manifest.json` | **false**    |

<!-- end inputs -->

## 💡 Usage Examples

Simple example:

```yaml
uses: fmaule/generate-build-manifest@v3
with:
  action-info: false # disable writing action information to manifest (just an example)
```

Provide custom Dockerfile and package.json:

```yaml
uses: fmaule/generate-build-manifest@v3
with:
  # assuming you have a 'libs' folder that includes the service
  dockerfile: './libs/service1/my-dockerfile'
  package-json: './libs/service1/package.json'
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
        uses: fmaule/generate-build-manifest@v3
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

**Q: What is the purpose of the `build-manifest.json`?**

- **A:** The `build-manifest.json` provides a comprehensive overview of the container's build process and its contents. This is particularly valuable when deploying multiple docker images or microservices. By having a manifest inside the image, you get an in-depth view of the build specifications and the contents of the container. This can be extremely helpful for debugging, tracking builds, and ensuring consistent deployments.

**Q: How can the `build-manifest.json` be utilized in real-world scenarios?**

- **A:** The `build-manifest.json` can be served over HTTP, making it an effective health check or probe for Kubernetes pods. Additionally, it can be used for inventory purposes, providing a snapshot of the state of the application and its dependencies at the time of the build.

**Q: Why is the `append-dockerfile` input useful?**

- **A:** The `append-dockerfile` input automatically adds a COPY command to your Dockerfile, ensuring the `build-manifest.json` is included in your container during the build phase. This saves you the manual step of adding it yourself and ensures that the manifest is always present in your built containers.

**Q: I already have a build process in place. How hard is it to integrate this action into my workflow?**

- **A:** Integration is straightforward. All you need to do is add a few lines to your GitHub workflow YAML file. This action is designed to be plug-and-play, making it easy to adopt without major changes to your existing setup.

**Q: What if I don't want certain information, like GitHub action details, in my manifest?**

- **A:** This action is flexible. You can easily customize the content of the manifest by using the provided inputs. For instance, if you don't want the GitHub action details in your manifest, you can set the `action-info` input to `false`.
