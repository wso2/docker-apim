# Contributing to docker-apim

Docker and Docker Compose resources for WSO2 API Management platform are open source and we encourage contributions from our community.

## How you can Contribute

### Mailing Lists

The recommended way to discuss anything related to WSO2 products is via our mailing lists. First, go to https://wso2.com/mail/ and subscribe to any mailing lists. Here are the two most popular lists:

* dev@wso2.org: To discuss all WSO2 products.
* architecture@wso2.org: To discuss the architecture of WSO2 products.

### Posting Issues

We encourage you to report any problems in the WSO2 product Docker and Docker Compose resources or their documentation by creating GitHub issues in the respective repositories.
The issues page on GitHub is for tracking bugs and feature requests. When posing a new issue, follow the guidelines below.

* Check whether the issue has already been reported.
* Create a separate issue for each bug you are reporting or feature you are requesting.

### Code Contributions

If you like to contribute with a bug fix or a new feature, start by posting an issue and discussing the best way to implement it.

Unlike most projects, development for this repository is carried out on the `4.2.x` branch. This is because the `master` branch contains the latest stable release of the project.
The code in `4.2.x` is merged to the `master` branch after a final review and a round of testing.

Please follow these guidelines when contributing to the code:

1. Fork the current repository.
2. Create a topic branch from the `4.2.x` branch.
3. Make commits in logical units.
4. Before you send out the pull request, sync your forked repository with a remote repository. This makes your pull request simple and clear.

```bash
git clone https://github.com/<user>/docker-apim.git
git remote add upstream https://github.com/wso2/docker-apim.git
git fetch upstream
git checkout -b <topic-branch> upstream/4.2.x

# add some work

git push origin <topic-branch>

# submit pull request
```

**Thanks for contributing!**
