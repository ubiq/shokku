#!/bin/sh

# Download docker repository keys
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Install APT transport over 
apt install -y \
  apt-transport-https \
  software-properties-common \
  python-software-properties

# Add docker repository
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Install docker
apt update -y
apt install -y docker-ce
apt autoremove -y