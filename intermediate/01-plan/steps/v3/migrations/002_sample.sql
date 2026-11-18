-- Four recipes to start with, and their ingredients.
insert into recipes (title, servings, minutes) values
    ('Fluffy Pancakes', 4, 20),
    ('Banana Bread', 8, 70),
    ('Tomato Soup', 4, 35),
    ('Veggie Fried Rice', 2, 15);

insert into ingredients (recipe_id, name, amount, unit) values
    (1, 'flour', '1.5', 'cups'), (1, 'milk', '1.25', 'cups'), (1, 'eggs', '2', ''),
    (1, 'sugar', '2', 'tbsp'), (1, 'butter', '3', 'tbsp'),
    (2, 'bananas', '3', ''), (2, 'flour', '2', 'cups'), (2, 'eggs', '2', ''),
    (2, 'sugar', '0.5', 'cups'), (2, 'butter', '0.5', 'cups'),
    (3, 'tomatoes', '800', 'g'), (3, 'onion', '1', ''), (3, 'garlic', '2', 'cloves'),
    (3, 'stock', '2', 'cups'), (3, 'cream', '0.25', 'cups'),
    (4, 'cooked rice', '3', 'cups'), (4, 'eggs', '2', ''), (4, 'peas', '1', 'cups'),
    (4, 'carrot', '1', ''), (4, 'soy sauce', '3', 'tbsp');
