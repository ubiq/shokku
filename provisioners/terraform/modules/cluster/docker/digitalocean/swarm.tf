resource "digitalocean_droplet" "managers" {
  count              = "${var.hosts}"
  name               = "${format(var.hostname_manager_format, count.index + 1)}"
  image              = "${var.os_image}"
  size               = "${var.manager_size}"
  region             = "${var.region}"
  private_networking = true
  backups            = "${var.backups}"
  ipv6               = false
  ssh_keys           = "${var.ssh_keys}"

  connection {
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      "while [ ! $(docker info) ]; do sleep 2; done",
      "if [ ${count.index} -eq 0 ]; then sudo docker swarm init --advertise-addr ${digitalocean_droplet.managers.0.ipv4_address_private}; exit 0; fi",
      "sudo docker node update --availability drain ${self.name}"
    ]
  }
}

resource "digitalocean_droplet" "workers" {
  count              = "${var.hosts}"
  name               = "${format(var.hostname_worker_format, count.index + 1)}"
  image              = "${var.os_image}"
  size               = "${var.worker_size}"
  region             = "${var.region}"
  private_networking = true
  backups            = "${var.backups}"
  ipv6               = false
  ssh_keys           = "${var.ssh_keys}"

  connection {
    type        = "ssh"
    user        = "${var.user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "2m"
  }

  provisioner "remote-exec" {
    inline = [
      "while [ ! $(docker info) ]; do sleep 2; done",
      "sudo docker swarm join --token ${var.join_token} ${var.manager_private_ip}:2377",
    ]
  }

  provisioner "remote-exec" {
    when = "destroy"

    inline = [
      "docker swarm leave",
    ]

    on_failure = "continue"
  }
}
