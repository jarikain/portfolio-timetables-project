DELETE
FROM mysql.user
WHERE User = 'root'
  AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DELETE
FROM mysql.user
WHERE User = '';
DELETE
FROM mysql.db
WHERE Db = 'test'
   OR Db = 'test_%';
CREATE DATABASE infoscreen_server_db;
CREATE USER 'infoscreen_server'@'%' IDENTIFIED BY 'Koodaus1';
GRANT ALL PRIVILEGES ON infoscreen_server_db.* TO 'infoscreen_server'@'%';
FLUSH PRIVILEGES;

use infoscreen_server_db;

create table if not exists location
(
    id              int auto_increment primary key,
    name            varchar(255) not null,
    update_interval int          not null
);

create table device
(
    id          int auto_increment primary key,
    ip          varchar(255) not null,
    location_id int          null,
    constraint IDX_f43bc27dee3408abb58215482a
        unique (ip),

    constraint FK_133d3795779b0d900f862831801
        foreign key (location_id) references location (id)
);

create table if not exists view
(
    id          int auto_increment primary key,
    type        varchar(255) not null,
    content     text         null,
    location_id int          null,

    constraint FK_e51bc9d17d08ef5120731c97340
        foreign key (location_id) references location (id)
);

create table if not exists stop
(
    id          int auto_increment primary key,
    title       varchar(255) not null,
    trips       int          not null,
    stop_api_id varchar(255) not null,
    stop_name   varchar(255) null,
    view_id     int          null,

    constraint FK_26e07dd70c49ea01f50b70df4a4
        foreign key (view_id) references view (id)
);

create table if not exists device
(
    id          int auto_increment
        primary key,
    ip          varchar(255) not null,
    location_id int          null,
    constraint IDX_f43bc27dee3408abb58215482a
        unique (ip),
    constraint REL_133d3795779b0d900f86283180
        unique (location_id),
    constraint FK_133d3795779b0d900f862831801
        foreign key (location_id) references location (id)
);

create table if not exists admin_user
(
    id       int auto_increment primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    constraint IDX_4d0392574f49340bb75a102b04
        unique (username)
);

INSERT INTO location (name, update_interval)
VALUES ('Mukkulankatu', 5);

INSERT INTO device (ip, location_id)
VALUES ('172.30.133.93', (SELECT id FROM location WHERE name = 'Mukkulankatu'));

INSERT INTO device (ip, location_id)
VALUES ('172.30.133.100', (SELECT id FROM location WHERE name = 'Mukkulankatu'));

INSERT INTO device (ip, location_id)
VALUES ('172.30.133.112', (SELECT id FROM location WHERE name = 'Mukkulankatu'));

INSERT INTO view (type, content, location_id)
VALUES ('bus', NULL, (SELECT id FROM location WHERE name = 'Mukkulankatu'));
INSERT INTO view (type, content, location_id)
VALUES ('train', NULL, (SELECT id FROM location WHERE name = 'Mukkulankatu'));

INSERT INTO view (type, content, location_id)
VALUES ('bus', NULL, (SELECT id FROM location WHERE name = 'Lappeenranta'));
INSERT INTO view (type, content, location_id)
VALUES ('train', NULL, (SELECT id FROM location WHERE name = 'Lappeenranta'));

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('To Mukkula', 3, '103579', 'Lahti',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'bus'
           AND location.name = 'Mukkulankatu'));

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('To Travel Centre', 3, '103578', 'Lahti',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'bus'
           AND location.name = 'Mukkulankatu'));

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('Departures', 6, 'LH', 'Lahti',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'train'
           AND location.name = 'Mukkulankatu'));

-- Lappeenrannan pysäkit:

-- INSERT INTO location (name, update_interval)
-- VALUES ('Lappeenranta', 10);

-- INSERT INTO device (ip, location_id)
-- VALUES ('172.30.133.201', (SELECT id FROM location WHERE name = 'Lappeenranta'));

-- INSERT INTO device (ip, location_id)
-- VALUES ('172.30.133.200', (SELECT id FROM location WHERE name = 'Lappeenranta'));

-- INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
-- VALUES ('Kärrinkatu keskustaan', 3, '205258', 'Lappeenranta',
--       (SELECT view.id
--       FROM view
--                JOIN location ON view.location_id = location.id
--       WHERE view.type = 'bus'
--         AND location.name = 'Lappeenranta'));

-- INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
-- VALUES ('Kärrinkatu keskustasta', 3, '205259', 'Lappeenranta',
--        (SELECT view.id
--        FROM view
--                JOIN location ON view.location_id = location.id
--       WHERE view.type = 'bus'
--         AND location.name = 'Lappeenranta'));

-- INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
-- VALUES ('Departures', 6, 'LR', 'Lappeenranta',
--         (SELECT view.id
--       FROM view
--                JOIN location ON view.location_id = location.id
--       WHERE view.type = 'train'
--         AND location.name = 'Lappeenranta'));