output "hostnames" {
  value = ["${vultr_instance.managers.*.name}", "${vultr_instance.workers.*.name}"]
}

output "public_ips" {
  value = ["${vultr_instance.managers.*.ipv4_address}", "${vultr_instance.workers.*.ipv4_address}"]
}