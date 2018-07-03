# WSO2 API Manager Docker Artifacts

This repository contains following Docker artifacts, for trying out WSO2 API Manager on plain Docker:
- WSO2 API Manager Dockerfile
- WSO2 API Manager Docker Compose File

## Getting Started

Execute following command to clone the repository:

```bash
git clone https://github.com/wso2/docker-apim.git
```

Checkout required product version branch:

```bash
git branch
git checkout <product-version>
```

The bash files in dockerfile folder make use of scripts in [wso2/docker-common](https://github.com/wso2/docker-common) repository
and it has been imported into dockerfile/common folder as a sub-module. Once the clone process is completed execute following 
commands to pull the sub-module content:

```bash
git submodule init
git submodule update
```
## Note
For running a containerized WSO2 API Manager deployment in production, its recommended to use a container cluster manager such as Kubernetes/Openshift. Please refer [APIM Kubernetes Artifacts](https://github.com/wso2/kubernetes-apim/) repository.
