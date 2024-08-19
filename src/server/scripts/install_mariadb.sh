#!/bin/bash

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <root password> <database username> <database user password> <database name>"
    exit 1
fi

ROOT_PASSWORD=$1
DB_USER=$2
DB_USER_PASSWORD=$3
DB_NAME=$4

sudo apt update
sudo apt install mariadb-server -y

sudo mysql -u root <<EOF

# These steps are the same steps as running 'mysql_secure_installation'

# If ALTER is used, it will disable unix_socket login and enable password login (for production)
# ALTER USER 'root'@'localhost' IDENTIFIED BY '$ROOT_PASSWORD';

# Remove remote root
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

# Remove anonymous users
DELETE FROM mysql.user WHERE User='';

# Remove test databases
DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';

# Setup server application database and user
CREATE DATABASE $DB_NAME;
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_USER_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EXIT

EOF

echo "MariaDB setup completed. Database '$DB_NAME' and user '$DB_USER' created."
