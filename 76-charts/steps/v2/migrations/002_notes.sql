-- Two years of rain (2026 up to October), and ten weeks of four tomato plants.
insert into rain (year, month, mm) values
    (2025, 1, 84), (2025, 2, 60), (2025, 3, 52), (2025, 4, 48), (2025, 5, 50), (2025, 6, 45),
    (2025, 7, 55), (2025, 8, 62), (2025, 9, 58), (2025, 10, 88), (2025, 11, 92), (2025, 12, 90),
    (2026, 1, 96), (2026, 2, 70), (2026, 3, 41), (2026, 4, 30), (2026, 5, 66), (2026, 6, 38),
    (2026, 7, 72), (2026, 8, 49), (2026, 9, 61), (2026, 10, 101);
insert into growth (plant, week, cm) values
    ('Sungold', 1, 12), ('Sungold', 2, 16), ('Sungold', 3, 23), ('Sungold', 4, 31), ('Sungold', 5, 42),
    ('Sungold', 6, 55), ('Sungold', 7, 68), ('Sungold', 8, 80), ('Sungold', 9, 91), ('Sungold', 10, 99),
    ('Moneymaker', 1, 10), ('Moneymaker', 2, 13), ('Moneymaker', 3, 17), ('Moneymaker', 4, 22), ('Moneymaker', 5, 30),
    ('Moneymaker', 6, 37), ('Moneymaker', 7, 41), ('Moneymaker', 8, 44), ('Moneymaker', 9, 46), ('Moneymaker', 10, 47),
    ('Black Krim', 1, 11), ('Black Krim', 2, 15), ('Black Krim', 3, 18), ('Black Krim', 4, 18), ('Black Krim', 5, 19),
    ('Black Krim', 6, 27), ('Black Krim', 7, 38), ('Black Krim', 8, 50), ('Black Krim', 9, 58), ('Black Krim', 10, 63),
    ('Gardener''s Delight', 1, 13), ('Gardener''s Delight', 2, 18), ('Gardener''s Delight', 3, 26), ('Gardener''s Delight', 4, 33), ('Gardener''s Delight', 5, 38),
    ('Gardener''s Delight', 6, 36), ('Gardener''s Delight', 7, 35), ('Gardener''s Delight', 8, 41), ('Gardener''s Delight', 9, 52), ('Gardener''s Delight', 10, 60);
