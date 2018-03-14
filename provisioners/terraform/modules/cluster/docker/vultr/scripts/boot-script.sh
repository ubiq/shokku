#!/bin/sh

# Enable private network if not previously enabled
if ! grep -Fxq "auto ens7" /etc/network/interfaces
then

# Fetch private ip
METADATA_ENDPOINT=http://169.254.169.254/v1/interfaces/1/ipv4/address
PRIVATE_IP=$(curl $METADATA_ENDPOINT)

# Append auto network configuration
cat <<EOT >> /etc/network/interfaces
auto ens7
iface ens7 inet static
    address ${PRIVATE_IP}
    netmask 255.255.0.0
    mtu 1450
EOT

# Enable private network
ifup ens7

fi