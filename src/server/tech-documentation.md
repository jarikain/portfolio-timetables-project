# Server Documentation

The application is installed as a system daemon, and it is also *enabled* to start at boot. 
Managing can be done for example with, `systemctl`
```bash
systemctl restart jubu
```
And logs are available with `journalctl`:
```bash
journalctl -u jubu
```

There is a cronjob to restart the service once a week.
```cronexp
0 4 * * 6 sudo systemctl restart jubu
```
The service is run at port *3000* by default. Network traffic is re-routed from
port 80 to 3000 with **iptables**. The change is made persistent with 
`iptables-persistent` package.

## Environment variable to control the server application
The update interval time for making API requests from public APIs can be changed
from `server/.env` file. Backup timetable fetch time can be changed with 
cron expression.

```dotenv
SERVER_API_UPDATE_INTERVAL_SECONDS=30

BACKUP_UPDATE_TIME="0 3 * * *"
```

Restart the service after editing *.env*
```
systemctl restart jubu
```

## Resetting Admin Password

Forgotten admin password cannot be restored as the password is saved only as hashed value to the database.
If there is a need for resetting admin password, fastest way is to remove admin_user table from the database.
By default, the Sqlite3 database is saved to `server/prod-db.sqlite` (or `server/dev-db.sqlite`).

```
sqlite3 server/prod-db.sqlite
```

```sqlite
drop table admin_user;
```

After clearing the table, restart the server.
```bash
systemctl restart jubu
```

A new admin user can be now created at admin panel.