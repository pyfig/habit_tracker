#!/bin/bash

# yet another debug 
docker-compose down -v
docker-compose build --no-cache 
docker-compose up -d