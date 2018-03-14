data "external" "swarm_tokens" {
  program = ["bash", "${path.module}/scripts/get-swarm-join-tokens.sh"]

  query = {
    host        = "${element(digitalocean_droplet.managers.*.ipv4_address, 0)}"
    user        = "${var.provision_user}"
    private_key = "${var.provision_ssh_key}"
  }
}