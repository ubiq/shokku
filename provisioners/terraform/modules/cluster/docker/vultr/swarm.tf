resource "vultr_instance" "main-manager" {
  count              = "${var.manager_servers}"
  
  name               = "${format(var.hostname_manager_format, count.index + 1)}"
  hostname           = "${format(var.hostname_manager_format, count.index + 1)}"
  tag                = "${format(var.hostname_manager_format, count.index + 1)}"
  region_id          = "${data.vultr_region.region.id}"
  plan_id            = "${data.vultr_plan.plan_manager.id}"
  os_id              = "${var.vultr_os_id}"
  ssh_key_ids        = ["${data.vultr_ssh_key.ssh_key.id}"]
  startup_script_id  = "${vultr_startup_script.boot_script.id}"
  private_networking = true

  provisioner "remote-exec" {
    script = "${path.module}/scripts/install-docker.sh"
  }

  provisioner "remote-exec" {
    script = "${path.module}/scripts/ufw.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "docker swarm init --advertise-addr ens7",
      "docker node update --availability drain ${self.hostname}"
    ]
  }
}

resource "vultr_instance" "managers" {
  count              = "${var.manager_servers + 1}"
  
  name               = "${format(var.hostname_manager_format, count.index + 1)}"
  hostname           = "${format(var.hostname_manager_format, count.index + 1)}"
  tag                = "${format(var.hostname_manager_format, count.index + 1)}"
  region_id          = "${data.vultr_region.region.id}"
  plan_id            = "${data.vultr_plan.plan_manager.id}"
  os_id              = "${var.vultr_os_id}"
  ssh_key_ids        = ["${data.vultr_ssh_key.ssh_key.id}"]
  startup_script_id  = "${vultr_startup_script.boot_script.id}"
  private_networking = true

  provisioner "remote-exec" {
    script = "${path.module}/scripts/install-docker.sh"
  }

  provisioner "remote-exec" {
    script = "${path.module}/scripts/ufw.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "docker swarm init --advertise-addr ens7",
      "if [ ${count.index} -eq 0 ]; then docker swarm init --advertise-addr ens7; else docker swarm join ${vultr_instance.managers.0.private_ip}:2377 --advertise-addr ens7 --token $(docker -H ${vultr_instance.managers.0.private_ip} swarm join-token -q manager); fi",
      "docker node update --availability drain ${self.hostname}"
    ]
  }
}

resource "vultr_instance" "workers" {
  count              = "${var.worker_servers}"
  
  name               = "${format(var.hostname_worker_format, count.index + 1)}"
  hostname           = "${format(var.hostname_worker_format, count.index + 1)}"
  tag                = "${format(var.hostname_worker_format, count.index + 1)}"
  region_id          = "${data.vultr_region.region.id}"
  plan_id            = "${data.vultr_plan.plan_worker.id}"
  os_id              = "${var.vultr_os_id}"
  ssh_key_ids        = ["${data.vultr_ssh_key.ssh_key.id}"]
  startup_script_id  = "${vultr_startup_script.boot_script.id}"
  private_networking = true

  provisioner "remote-exec" {
    script = "${path.module}/scripts/install-docker.sh"
  }

  provisioner "remote-exec" {
    script = "${path.module}/scripts/ufw.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "docker swarm join ${vultr_instance.managers.0.private_ip}:2377 --token $(docker -H ${vultr_instance.managers.0.private_ip} swarm join-token -q worker)",
    ]
  }

  depends_on = [
    "vultr_instance.managers"
  ]
}