const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const getBool = (input) => (input === "on" ? true : false);

const getPackageInfo = () => {
  const packageJsonLocation = `${process.env.GITHUB_WORKSPACE}/package.json`;
  const packageJson = require(packageJsonLocation);
  const { name, version } = packageJson;
  return { name, version };
};

const getActionInfo = () => {
  const workflow = process.env.GITHUB_WORKFLOW;
  const runnerArch = process.env.RUNNER_ARCH;
  const runnerName = process.env.RUNNER_NAME;
  const runnerOs = process.env.RUNNER_OS;

  const ghAction = {
    workflow,
    runner: {
      arch: runnerArch,
      name: runnerName,
      os: runnerOs,
    },
  };
  return { ghAction };
};

const getScm = () => {
  const { repository } = github.context?.payload || {};
  const { ssh_url } = repository || {};

  const remote = ssh_url;
  const branch = process.env.GITHUB_REF_NAME;
  const commit = process.env.GITHUB_SHA;

  const scm = {
    remote,
    branch,
    commit,
  };

  return { scm };
};

const writeDockerFile = (manifestName) => {
  const dockerCommand = `\nCOPY ${manifestName} ./\n`;
  const dockerFile = `${process.env.GITHUB_WORKSPACE}/Dockerfile`;
  core.debug(
    `Appending command to docker file (${dockerFile}): ${dockerCommand}`,
  );
  fs.appendFileSync(dockerFile, dockerCommand);
};

try {
  const writeScm = getBool(core.getInput("scm-info"));
  const writePackageInfo = getBool(core.getInput("package-info"));
  const writeActionInfo = getBool(core.getInput("action-info"));
  const appendDockerFile = getBool(core.getInput("append-dockerfile"));
  const manifestName = core.getInput("manifest-name");

  core.debug(
    `Manifest ${manifestName} being generated with SCM: ${writeScm}, package.json info: ${writePackageInfo}, action info: ${writeActionInfo}`,
  );

  const timestamp = new Date().toISOString();

  const manifest = {
    timestamp,
    ...(writeScm && getScm()),
    ...(writePackageInfo && getPackageInfo()),
    ...(writeActionInfo && getActionInfo()),
  };

  fs.writeFileSync(
    manifestName,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf-8",
  );

  if (appendDockerFile) {
    writeDockerFile(manifestName);
  }
} catch (error) {
  core.error(error);
  core.setFailed(error.message);
}
