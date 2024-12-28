# BSD Stack

# Swagger

I am using a Swagger (OpenAPI3) file with and a custom gen script to auto-magically
implement all of the Types, Data Fetching, TanStack Queries & S3 Requirements of the App.
Both Native & Web

# Go

The backend is written in Go and serves the web frontend, as well as all the endpoints.

# React 19 & Vite 6 [ with TanStack ]

This app serves a Typescript React app with TanStack Router and TanStack Query
With all the queries and api calls auto generated.

# Expo React Native

This app also includes a Native app using Expo Router and TanStack Query
Also with all queries and api calls auto generated.

# Postgres

Hosts a Postgres Service with soon Authentication and Dashboard Support

# Minio

Hosts a Minio service in Docker allowing for complete S3 integration for Object Storage

# Dockerized

I am using Docker to Deploy this app

# TODO

- [ ] Implement Auth/OAuth Support
- [ ] Implement Dashboard for Easier Postgres Migrations & Viewing
- [ ] Implement Dashboard for Easier OpenAPI Configuration
- [ ] Improve Auto Code Generation and add Dashboard make Support
- [ ] Add Kubernetes & NFS Support
- [ ] Implement Terraform 
- [ ] Implement Microservice gen & support?


# GOAL 

Use this to... 
Deploy system with terraform. Implement migrations and swagger spec in the dashboard.
Implement required microservices. Generate API. Implement backend handlers.
Implement client.



