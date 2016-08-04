pull:
	support/sync_repos.js pull

pull-ro:
	support/sync_repos.js pull-ro

sync-secrets:
	gsutil -m rsync -d -r secrets gs://ctm-secrets/infrastructure

minikube:
	@minikube version
	@minikube status
	@minikube start
	@echo 'Copy/Paste the following command into your shell:'
	@echo 'eval $$(minikube docker-env) && export DOCKER_API_VERSION=1.23'
	@export DOCKER_API_VERSION=1.23

minikube-delete:
	@minikube version
	@minikube status
	@minikube delete

minikube-stop:
	@minikube version
	@minikube status
	@minikube stop

minikube-services:
	kubectl create -f kube/redis.minikube.yml || true
	kubectl create -f kube/rethinkdb.minikube.yml || true

secrets-create:
	kubectl create -f secrets/gcloud-bucket.secret.yml

secrets-apply:
	kubectl apply -f secrets/gcloud-bucket.secret.yml
