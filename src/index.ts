import { ActionInfo, Manifest, Package, SCM } from "./types";

import fs from "fs";
import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  PullRequestEvent,
  PushEvent,
  WorkflowDispatchEvent,
} from "@octokit/webhooks-definitions/schema";

// first we attempt to read the file from the path provided, if not found, we try to search in the GITHUB_WORKSPACE
const getFilePath = (filePath: string) => {
  let fileLocation = filePath;

  if (!fs.existsSync(fileLocation)) {
    core.warning(
      `${fileLocation} not found, searching in the GITHUB_WORKSPACE ${process.env.GITHUB_WORKSPACE}`,
    );
    fileLocation = `${process.env.GITHUB_WORKSPACE}/${filePath}`;
  }
  if (!fs.existsSync(fileLocation)) {
    throw new Error(
      `${filePath} not found in ${fileLocation}. Make sure you have one or turn off the append-dockerfile option if not needed (see README)`,
    );
  }

  // file is found, return the path
  return fileLocation;
};

const getPackageInfo = (packageJson: string): Package => {
  const packageJsonLocation = getFilePath(packageJson);

  const packageJsonContent = fs.readFileSync(packageJsonLocation, "utf-8");
  const { name, version } = JSON.parse(packageJsonContent);
  return { name, version };
};

const getActionInfo = (): { ghAction: ActionInfo } => {
  const workflow = process.env.GITHUB_WORKFLOW;
  const runNumber = process.env.GITHUB_RUN_NUMBER
    ? parseInt(process.env.GITHUB_RUN_NUMBER, 10)
    : undefined;
  const runnerArch = process.env.RUNNER_ARCH;
  const runnerName = process.env.RUNNER_NAME;
  const runnerOs = process.env.RUNNER_OS;

  const ghAction = {
    workflow,
    runNumber,
    runner: {
      arch: runnerArch,
      name: runnerName,
      os: runnerOs,
    },
  };

  return { ghAction };
};

const getScm = (): { scm: SCM | null } => {
  const { context } = github;
  const events = ["push", "pull_request", "workflow_dispatch"];

  if (!events.includes(context.eventName)) {
    return { scm: null };
  }

  const { repository } = github.context.payload as
    | PushEvent
    | WorkflowDispatchEvent
    | PullRequestEvent;
  const { sha, ref } = context;
  const { ssh_url, clone_url } = repository;

  // "sha-1234567" is what you get by default by the official docker/metadata-action
  const short_sha = `sha-${sha.slice(0, 7)}`;

  const branch = process.env.GITHUB_REF_NAME;

  const scm = {
    eventName: context.eventName,
    ssh_url,
    clone_url,
    branch,
    sha,
    short_sha,
    ref,
  };

  return { scm };
};

const writeDockerFile = (dockerfile: string, manifestName: string) => {
  const dockerCommand = `\nCOPY ${manifestName} ./\n`;

  const dockerFilePath = getFilePath(dockerfile);
  core.debug(
    `Appending command to docker file (${dockerFilePath}): ${dockerCommand}`,
  );
  fs.appendFileSync(dockerFilePath, dockerCommand);
};

try {
  if (!process.env.GITHUB_WORKSPACE)
    throw new Error("Please checkout your repository first (see README)");

  const writeScm = core.getBooleanInput("scm-info");
  const writePackageInfo = core.getBooleanInput("package-info");
  const writeActionInfo = core.getBooleanInput("action-info");
  const packageJson = core.getInput("package-json");
  const dockerFile = core.getInput("dockerfile");
  const appendDockerFile = core.getBooleanInput("append-dockerfile");
  const manifestFile = core.getInput("manifest-file");

  core.debug(
    `Manifest ${manifestFile} being generated with SCM: ${writeScm}, package.json info: ${writePackageInfo}, action info: ${writeActionInfo}`,
  );

  const timestamp = new Date().toISOString();

  const manifest: Manifest = {
    timestamp,
    ...(writeScm && getScm()),
    ...(writePackageInfo && getPackageInfo(packageJson)),
    ...(writeActionInfo && getActionInfo()),
  };

  const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
  fs.writeFileSync(manifestFile, manifestContent, "utf-8");

  if (appendDockerFile) {
    writeDockerFile(dockerFile, manifestFile);
  }

  appendDockerFile
    ? core.info(`📝 Manifest: ${manifestFile} + COPY to Dockerfile`)
    : core.info(`📝 Manifest: ${manifestFile}`);

  core.setOutput("manifest-content", manifestContent);
} catch (e) {
  core.error(e as Error);
  core.setFailed((e as Error).message);
}
