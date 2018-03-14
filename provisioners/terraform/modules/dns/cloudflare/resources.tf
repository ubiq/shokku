resource "cloudflare_record" "hosts" {
  count = "${var.count}"

  domain  = "${var.cloudflare_domain}"
  name    = "${element(var.hostnames, count.index)}"
  value   = "${element(var.public_ips, count.index)}"
  type    = "A"
  proxied = false
}