INSERT INTO location (name, update_interval, city, theme)
VALUES ('Lappeenrannan kampus', 10, "Lappeenranta", "LUT");

INSERT INTO device (ip, location_id)
VALUES ('172.30.10.10', (SELECT id FROM location WHERE name = 'Lappeenrannan kampus'));

INSERT INTO view (type, content, location_id, enabled)
VALUES ('bus', NULL, (SELECT id FROM location WHERE name = 'Lappeenrannan kampus'), 0);

INSERT INTO view (type, content, location_id, enabled)
VALUES ('train', NULL, (SELECT id FROM location WHERE name = 'Lappeenrannan kampus'), 0);

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('LUT-University', 6, '205390', 'Lappeenranta',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'bus'
           AND location.name = 'Lappeenrannan kampus'));

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('Departures', 6, 'LR', 'Lappeenranta',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'train'
           AND location.name = 'Lappeenrannan kampus'));