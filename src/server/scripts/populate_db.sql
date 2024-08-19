INSERT INTO location (name, update_interval, city, theme)
VALUES ('Lahden kampus', 10, "Lahti", "LAB");

INSERT INTO device (ip, location_id)
VALUES ('172.26.82.20', (SELECT id FROM location WHERE name = 'Lahden kampus'));

INSERT INTO device (ip, location_id)
VALUES ('1', (SELECT id FROM location WHERE name = 'Lahden kampus'));

INSERT INTO view (type, content, location_id, enabled)
VALUES ('bus', NULL, (SELECT id FROM location WHERE name = 'Lahden kampus'), 1);
INSERT INTO view (type, content, location_id, enabled)
VALUES ('train', NULL, (SELECT id FROM location WHERE name = 'Lahden kampus'), 1);

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('To Travel Centre', 4, '103578', 'Lahti',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'bus'
           AND location.name = 'Lahden kampus'));

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('To Mukkula', 4, '103579', 'Lahti',
        (SELECT view.id
         FROM view
                  JOIN location ON view.location_id = location.id
         WHERE view.type = 'bus'
           AND location.name = 'Lahden kampus'));

INSERT INTO stop (title, trips, stop_api_id, stop_name, view_id)
VALUES ('Departures', 6, 'LH', 'Lahti',
     (SELECT view.id
      FROM view
               JOIN location ON view.location_id = location.id
      WHERE view.type = 'train'
        AND location.name = 'Lahden kampus'));