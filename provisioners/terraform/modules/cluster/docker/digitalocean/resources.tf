resource "null_resource" "bootstrap" {
  count = "${var.hosts}"

  triggers {
    cluster_instance_ids = "${join(",", digitalocean_droplet.managers.*.id)}"
  }

  connection {
    host        = "${element(digitalocean_droplet.managers.*.ipv4_address, count.index)}"
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      "while [ ! $(docker info) ]; do sleep 2; done",
      "if [ ${count.index} -gt 0 ] && [! sudo docker info | grep -q \"Swarm: active\" ]; then sudo docker swarm join --token ${lookup(data.external.swarm_tokens.result, "manager")} ${element(digitalocean_droplet.managers.*.ipv4_address_private, 0)}:2377; exit 0; fi",
    ]
  }
}