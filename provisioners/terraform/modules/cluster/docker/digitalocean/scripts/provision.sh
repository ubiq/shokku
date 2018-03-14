#!/bin/sh

# Download docker repository keys
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Install APT transport over 
sudo apt install -y \
  apt-transport-https \
  software-properties-common \
  python-software-properties \
  jq

# Add docker repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Install docker
sudo apt update -y
sudo apt install -y docker-ce
sudo apt autoremove -y

## Setup Firewall
sudo ufw --force reset

#General
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Services
sudo ufw allow ssh

# Interfaces
sudo ufw allow from 127.0.0.0/8
sudo ufw allow in on lo
sudo ufw allow out on lo
sudo ufw allow in on ens7

# Docker Swarm
sudo ufw allow 2376/tcp
sudo ufw allow 2377/tcp
sudo ufw allow 7946/tcp
sudo ufw allow 7946/udp
sudo ufw allow 4789/udp

sudo ufw --force reload
sudo ufw --force enable