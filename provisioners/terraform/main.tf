# ------------------
# Cluster
# ------------------

module "cluster" {
  source                  = "./modules/cluster/docker/digitalocean"
  hosts                   = "${var.hosts}"
  token                   = "${var.do_token}"
  region                  = "${var.do_region}"
  os_image                = "${var.do_os_image}"
  user                    = "${var.do_user}"
  worker_size             = "${var.workers}"
  manager_size            = "${var.managers}"
  ssh_keys                = "${var.do_ssh_keys}"
  backups                 = "${var.do_backups}"
  hostname_worker_format  = "${var.hostname_worker_format}"
  hostname_manager_format = "${var.hostname_manager_format}"
}

# ------------------
# DNS
# ------------------

module "dns" {
  source            = "./modules/dns/cloudflare"
  count             = "${var.hosts}"
  cloudflare_domain = "${var.cloudflare_domain}"  
  cloudflare_email  = "${var.cloudflare_email}"
  cloudflare_token  = "${var.cloudflare_token}"
  public_ips        = "${module.cluster.public_ips}"
  hostnames         = "${module.cluster.hostnames}"
}
