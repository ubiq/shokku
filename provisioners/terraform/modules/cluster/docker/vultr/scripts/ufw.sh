#!/bin/sh

ufw --force reset

#General
ufw default deny incoming
ufw default allow outgoing

# Services
ufw allow ssh

# Interfaces
ufw allow from 127.0.0.0/8
ufw allow in on lo
ufw allow out on lo
ufw allow in on ens7

# Docker Swarm
ufw allow 2376/tcp
ufw allow 2377/tcp
ufw allow 7946/tcp
ufw allow 7946/udp
ufw allow 4789/udp

ufw --force reload
ufw --force enable
