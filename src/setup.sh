#!/bin/bash

# Paths and port
REPO_DIR=~/jubu-aikataulut
SERVER_DIR=${REPO_DIR}/server
PORT=3000

# System settings
sudo timedatectl set-timezone 'Europe/Helsinki'

# System packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y\
 sqlite3\
 curl\

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Install and build project
cd $REPO_DIR || exit
npm run init
npm run install:all
npm run build:prod

# System service install
SERVER_FULL_PATH=$(realpath "$SERVER_DIR")
SERVER_DIST_FULL_PATH=$(realpath "$SERVER_DIR/dist/index.js")

cat << EOF | sudo tee /etc/systemd/system/jubu.service
[Unit]
Description=jubu
After=network.target

[Service]
EnvironmentFile=${SERVER_FULL_PATH}/.env
WorkingDirectory=${SERVER_FULL_PATH}
Type=simple
User=$USER
ExecStart=/usr/bin/node ${SERVER_DIST_FULL_PATH}
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable jubu

# Setup IP Forwarding with iptables

# To skip the install prompt
sudo debconf-set-selections <<EOF
iptables-persistent iptables-persistent/autosave_v4 boolean true
iptables-persistent iptables-persistent/autosave_v6 boolean true
EOF

sudo apt-get install -y iptables-persistent
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port $PORT
sudo netfilter-persistent save
sudo systemctl enable netfilter-persistent

echo "After setting API keys to server/.env, run:"
echo "sudo systemctl start jubu"