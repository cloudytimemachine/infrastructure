# infrastructure
Infrastructure as Code for launching CTM cloud

## Install required software

* [Google Cloud SDK](https://cloud.google.com/sdk/)
* [Docker](https://www.docker.com/)
* [kubectl](http://kubernetes.io/docs/user-guide/prereqs/)
* [minikube](https://github.com/kubernetes/minikube)
* [nodejs](https://nodejs.org/)
* [rethinkdb](http://rethinkdb.com/)
* [redis](http://redis.io/)

## Getting Started

Automatically download the other necessary repos

```
make pull
```

Request access to our Google Account to access secrets (contact Ross).  Once you have access:

```
make sync-secrets
```

Startup minikube

```
make minikube
```

Configure docker to utilize the minikube environment

```
eval $(minikube docker-env) && export DOCKER_API_VERSION=1.23
```
