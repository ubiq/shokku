/* General */
variable "domain" {
  description = "Domain where Shokku will reside (i.e myshokku.com)"
  default = "myshokku.com"
}

variable "hosts" {
  description = "Total number of servers to create (sum of managers + workers)"
  default = 6
}

variable "managers" {
  description = "Number of manager servers to create"
  default = 3
}

variable "workers" {
  description = "Number of worker servers to create"
  default = 3
}

variable "hostname_manager_format" {
  description = "Name that will be applied as hostname for manager nodes (i.e my-shokku-manager-%d)"
  default = "shokku-manager-%d"
}

variable "hostname_worker_format" {
  description = "Name that will be applied as hostname for worker nodes (i.e my-shokku-worker-%d)"
  default = "shokku-worker-%d"
}

/* Digital Ocean */
variable "do_token" {
  description = "DigitalOcean API token with read/write permissions"
  default = ""
}

variable "do_region" {
  description = "Datacenter region in which the cluster will be created"
  default = "ams3"
}

variable "do_os_image" {
  description = "Operating system used by the nodes"
  default = "ubuntu-16-04-x64"
}

variable "do_user" {
  description = "User used to log in to the droplets via ssh for issueing Docker commands"
  default = "root"
}

variable "do_ssh_keys" {
  type        = "list"
  description = "A list of SSH IDs or fingerprints to enable in the format [12345, 123456] that are added to worker nodes"
  default     = []
}

variable "do_backups" {
  description = "Enable backups of the worker nodes"
  default = "false"
}

/* vultr */
variable "vultr_token" {
  description = "Vultr API token with read/write permissions"
}

/* Cloudflare */
variable "cloudflare_token" {
  description = "Cloudflare API token with read/write permissions"
  default = ""
}

variable "cloudflare_email" {
  description = "Email of the associated account"
  default = "my@email.com"
}

variable "cloudflare_domain" {
  description = "Domain where Shokku will reside (i.e myshokku.com)"
  default = "myshokku.com"
}
