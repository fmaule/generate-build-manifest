export interface SCM {
  remote?: string;
  branch?: string;
  commit?: string;
}

export interface Package {
  name: string;
  version: string;
}

export interface ActionInfo {
  workflow?: string;
  runNumber?: number;
  runner?: {
    arch?: string;
    name?: string;
    os?: string;
  };
}

export interface Manifest {
  timestamp: string;
  scm?: SCM | null;
  package?: Package;
  action?: ActionInfo;
}
