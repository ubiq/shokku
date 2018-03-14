variable "manager_servers" {
  description = "Number of servers that are going to be managers."
}

variable "hostname_manager_format" {
  description = "Name of the manager hostname."
}

variable "worker_servers" {
  description = "Number of servers that are going to be workers."
}

variable "hostname_worker_format" {
  description = "Name of the worker hostname."
}

variable "vultr_token" {
  description = "Vultr API token that allows to operate with their services."
}

variable "vultr_os_id" { 
  default = "215" 
}
