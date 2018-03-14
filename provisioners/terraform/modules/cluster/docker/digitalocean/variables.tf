variable "hosts" {
  description = "Total number of servers to create (including managers + workers)"
}

variable "hostname_manager_format" {
  description = "Name of the hostname for manager nodes"
}

variable "hostname_worker_format" {
  description = "Name of the hostname for manager nodes"
}

variable "token" {
  description = "DigitalOcean API token with read/write permissions"
}

variable "region" {
  description = "Datacenter region in which the cluster will be created"
}

variable "os_image" {
  description = "Operating system used by the nodes"
}

variable "user" {
  description = "User used to log in to the droplets via ssh for issueing Docker commands"
}

variable "ssh_keys" {
  type        = "list"
  description = "A list of SSH IDs or fingerprints to enable in the format [12345, 123456] that are added to worker nodes"
}

variable "backups" {
  description = "Enable backups of the worker nodes"
}

variable "worker_size" {
  description = "Droplet size of worker nodes"
}

variable "manager_size" {
  description = "Droplet size of manager nodes"
}

variable "join_token" {
  description = "Join token for the nodes"
}

variable "manager_private_ip" {
  description = "Private ip adress of a manager node, used to have a node join the existing cluster"
}

variable "manager_public_ip" {
  description = "Public ip adress of a manager node, used to unregister a node in the Docker swarm cluster on destroy"
}

variable "provision_ssh_key" {
  description = "File path to SSH private key used to access the provisioned nodes. Ensure this key is listed in the manager and work ssh keys list"
}

variable "provision_user" {
  description = "User used to log in to the droplets via ssh for issuing Docker commands"
}

variable "ssh_keys" {
  type        = "list"
  description = "A list of SSH IDs or fingerprints to enable in the format [12345, 123456] that are added to worker nodes"
}