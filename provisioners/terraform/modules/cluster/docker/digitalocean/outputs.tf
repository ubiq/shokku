output "hostnames" {
  value = ["${digitalocean_droplet.managers.*.name}", "${digitalocean_droplet.workers.*.ipv4_address}"]
}

output "public_ips" {
  value = ["${digitalocean_droplet.managers.*.ipv4_address}", "${digitalocean_droplet.workers.*.ipv4_address}"]
}

output "private_ips" {
  value = ["${digitalocean_droplet.managers.*.ipv4_address_private}", "${digitalocean_droplet.workers.*.ipv4_address_private}"]
}

output "droplet_ids" {
  value = ["${digitalocean_droplet.managers.*.id}", "${digitalocean_droplet.workers.*.ipv4_address}"]
}