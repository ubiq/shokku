variable "count" {}
variable "hostnames" { type = "list" }
variable "public_ips" { type = "list" }

variable "cloudflare_domain" {}
variable "cloudflare_email" {}
variable "cloudflare_token" {}