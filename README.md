# contact_book

The Application runs on docker using docker compose

To run ensure you have docker installed in you PC and docker compose

## Docker & docker compose set up

Steps to install on docker on linux ubuntu:


```bash
sudo apt-get update
```
```bash
sudo apt-get install ca-certificates curl gnupg
```
```bash
sudo install -m 0755 -d /etc/apt/keyrings
```
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```
```bash
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```
```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

## Application set up

With the commands above docker will be enabled

to run the application:

1. clone the repo into your PC
2. Set up the environment variables by using the `.env.example` to create a `.env` file fill in the appropriate configuration options for the application as required
3. run the command below to build the docker containers and run them

```bash
docker compose up --build - d
```
This will run the container in detach mode to desable this run the command without the `-d` flag

4. Access the Api on `http://localhost:3000/` access a view of the database through Mongo Express `http://localhost:8081/` use the login credentials set up in `.env` file.
5. To test the APIs refer to the postman collection attached under the `docs/Kron- CRUD, test & variable.postman_collection.json` in the project root import this into postman to be able to see the various endpoints and expected requests and results.
6. To kill the containers run 
```bash
docker-compose down --volumes
```
This will stop the containers and delete all persisted data from the database volumes
