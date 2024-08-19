-- sudo mysql -u username -p
-- if unix_socket is on:
-- sudo mysql

-- use database_name;

-- source /path/to/script.sql;

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
