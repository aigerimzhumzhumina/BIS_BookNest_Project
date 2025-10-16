create table users (
                       user_id serial primary key,
                       username varchar(100) not null,
                       email varchar(255) unique not null,
                       password_hash varchar(255) not null,
                       role varchar(20) default 'user',
                       created_date timestamp default current_timestamp,
                       last_login timestamp
);
create table books (
                       book_id serial primary key,
                       title varchar(255) not null,
                       author varchar(255),
                       description text,
                       publication_date date,
                       genre varchar(100),
                       cover_image_url text,
                       file_url text,
                       upload_date timestamp default current_timestamp,
                       uploaded_by int references users(user_id) on delete set null
);
create table reading_sessions (
                                  session_id serial primary key,
                                  user_id int references users(user_id) on delete cascade,
                                  book_id int references books(book_id) on delete cascade,
                                  last_page int,
                                  progress_percentage decimal(5,2),
                                  last_updated timestamp default current_timestamp
);
create table bookmarks (
                           bookmark_id serial primary key,
                           user_id int references users(user_id) on delete cascade,
                           book_id int references books(book_id) on delete cascade,
                           page_number int,
                           note text,
                           created_date timestamp default current_timestamp
);
create table favorites (
                           favorite_id serial primary key,
                           user_id int references users(user_id) on delete cascade,
                           book_id int references books(book_id) on delete cascade,
                           added_date timestamp default current_timestamp
);
create table comments (
                          comment_id serial primary key,
                          user_id int references users(user_id) on delete cascade,
                          book_id int references books(book_id) on delete cascade,
                          content text not null,
                          created_date timestamp default current_timestamp,
                          parent_comment_id int references comments(comment_id) on delete cascade
);
create table highlights (
                            highlight_id serial primary key,
                            user_id int references users(user_id) on delete cascade,
                            book_id int references books(book_id) on delete cascade,
                            text_content text not null,
                            page_number int,
                            color varchar(50),
                            created_date timestamp default current_timestamp
);
create table personal_charts (
                                 chart_id serial primary key,
                                 user_id int references users(user_id) on delete cascade,
                                 chart_name varchar(255) not null,
                                 description text,
                                 created_date timestamp default current_timestamp
);

-- add some data so it won't be empty ugh
insert into users (username, email, password_hash, role)
values
    ('admin', 'admin@booknest.com', 'hash1', 'admin'),
    ('user1', 'user1@mail.com', 'hash2', 'user');

insert into books (title, author, description, genre, uploaded_by)
values
    ('The Goldfinch', 'Donna Tartt', 'Modern american novel', 'Fiction', 1),
    ('Waves', 'Virginia Woolf', '20th century english classic', 'Fiction', 1);

insert into comments (user_id, book_id, content)
values
    (2, 1, 'Amazing book! I cried sh... out of me lmao'),
    (2, 2, 'Very deep and thoughtful');

INSERT INTO users (username, email, password_hash, role, created_date, last_login)
VALUES
('aigerim', 'aigerim@mail.kz', 'hash_user_002', 'user', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('bekzat', 'bekzat@mail.kz', 'hash_user_003', 'user', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('diana', 'diana@example.com', 'hash_user_004', 'user', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('murat', 'murat@example.com', 'hash_user_005', 'moderator', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('aidana', 'aidana@mail.kz', 'hash_user_006', 'user', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('sergey', 'sergey@example.com', 'hash_user_007', 'user', CURRENT_TIMESTAMP - INTERVAL '10 days', NULL),
('gulnaz', 'gulnaz@example.com', 'hash_user_008', 'user', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
('nursultan', 'nursultan@mail.kz', 'hash_user_009', 'admin', CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
('aslan', 'aslan@mail.kz', 'hash_user_010', 'user', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO books (title, author, description, publication_date, genre, cover_image_url, file_url, upload_date, uploaded_by)
VALUES
('War and Peace', 'Leo Tolstoy', 'Epic novel about Russian society during the Napoleonic wars.', '1869-01-01', 'Historical Fiction',
'https://example.com/covers/war_and_peace.jpg', 'https://example.com/files/war_and_peace.pdf', CURRENT_TIMESTAMP - INTERVAL '90 days', 1),

('Crime and Punishment', 'Fyodor Dostoevsky', 'Psychological novel about morality and guilt.', '1866-01-01', 'Philosophical Fiction',
'https://example.com/covers/crime_and_punishment.jpg', 'https://example.com/files/crime_and_punishment.pdf', CURRENT_TIMESTAMP - INTERVAL '85 days', 2),

('Pride and Prejudice', 'Jane Austen', 'Classic novel about manners, marriage, and morality in early 19th century England.', '1813-01-28', 'Romance',
'https://example.com/covers/pride_and_prejudice.jpg', 'https://example.com/files/pride_and_prejudice.pdf', CURRENT_TIMESTAMP - INTERVAL '80 days', 3),

('The Great Gatsby', 'F. Scott Fitzgerald', 'Story of wealth and illusion in the Jazz Age.', '1925-04-10', 'Classic',
'https://example.com/covers/the_great_gatsby.jpg', 'https://example.com/files/the_great_gatsby.pdf', CURRENT_TIMESTAMP - INTERVAL '70 days', 4),

('To Kill a Mockingbird', 'Harper Lee', 'A tale of racial injustice and moral growth in the American South.', '1960-07-11', 'Drama',
'https://example.com/covers/to_kill_a_mockingbird.jpg', 'https://example.com/files/to_kill_a_mockingbird.pdf', CURRENT_TIMESTAMP - INTERVAL '60 days', 5),

('The Master and Margarita', 'Mikhail Bulgakov', 'A brilliant satire blending fantasy, politics, and philosophy.', '1967-01-01', 'Satire',
'https://example.com/covers/master_and_margarita.jpg', 'https://example.com/files/master_and_margarita.pdf', CURRENT_TIMESTAMP - INTERVAL '50 days', 6),

('1984', 'George Orwell', 'A dystopian vision of totalitarianism and surveillance.', '1949-06-08', 'Dystopian',
'https://example.com/covers/1984.jpg', 'https://example.com/files/1984.pdf', CURRENT_TIMESTAMP - INTERVAL '40 days', 7),

('The Old Man and the Sea', 'Ernest Hemingway', 'A symbolic tale of struggle, endurance, and redemption.', '1952-09-01', 'Adventure',
'https://example.com/covers/old_man_and_sea.jpg', 'https://example.com/files/old_man_and_sea.pdf', CURRENT_TIMESTAMP - INTERVAL '30 days', 8),

('Brave New World', 'Aldous Huxley', 'A futuristic society controlled by technology and pleasure.', '1932-08-30', 'Science Fiction',
'https://example.com/covers/brave_new_world.jpg', 'https://example.com/files/brave_new_world.pdf', CURRENT_TIMESTAMP - INTERVAL '20 days', 9),

('The Catcher in the Rye', 'J.D. Salinger', 'A rebellious teenager’s journey through alienation and identity.', '1951-07-16', 'Coming-of-Age',
'https://example.com/covers/catcher_in_the_rye.jpg', 'https://example.com/files/catcher_in_the_rye.pdf', CURRENT_TIMESTAMP - INTERVAL '10 days', 10);
INSERT INTO reading_sessions (user_id, book_id, last_page, progress_percentage, last_updated)
VALUES
(1, 1, 320, 75.50, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 3, 120, 40.00, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 5, 50, 20.00, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(4, 2, 550, 90.25, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(5, 6, 200, 65.00, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(6, 9, 90, 30.00, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
(7, 4, 150, 50.00, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(8, 8, 25, 10.00, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(9, 7, 310, 80.75, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(10, 10, 214, 55.60, CURRENT_TIMESTAMP - INTERVAL '12 hours');

INSERT INTO bookmarks (user_id, book_id, page_number, note, created_date)
VALUES
(1, 1, 123, 'Napoleon’s strategy part — reread later.', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(2, 3, 45, 'First encounter between Darcy and Elizabeth.', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(3, 5, 87, 'Scout’s first moral lesson — quote this.', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(4, 2, 410, 'Raskolnikov’s confession scene.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(5, 6, 290, 'Pontius Pilate chapter is brilliant.', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(6, 7, 105, 'Important section about control and freedom.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(7, 9, 52, 'Interesting world-building concept.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(8, 10, 12, 'Holden’s first impressions — funny.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(9, 4, 80, 'Symbolism in Gatsby’s parties.', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(10, 8, 18, 'The struggle metaphor here is powerful.', CURRENT_TIMESTAMP - INTERVAL '2 hours');

INSERT INTO favorites (user_id, book_id, added_date)
VALUES
(1, 1, CURRENT_TIMESTAMP - INTERVAL '30 days'),  -- admin любит "War and Peace"
(2, 3, CURRENT_TIMESTAMP - INTERVAL '25 days'),  -- aigerim любит "Pride and Prejudice"
(3, 5, CURRENT_TIMESTAMP - INTERVAL '20 days'),  -- bekzat добавил "To Kill a Mockingbird"
(4, 2, CURRENT_TIMESTAMP - INTERVAL '18 days'),  -- diana читает "Crime and Punishment"
(5, 6, CURRENT_TIMESTAMP - INTERVAL '15 days'),  -- murat фанат "Master and Margarita"
(6, 9, CURRENT_TIMESTAMP - INTERVAL '10 days'),  -- aidana любит "Brave New World"
(7, 4, CURRENT_TIMESTAMP - INTERVAL '8 days'),   -- sergey выбрал "The Great Gatsby"
(8, 8, CURRENT_TIMESTAMP - INTERVAL '6 days'),   -- gulnaz добавила "The Old Man and the Sea"
(9, 7, CURRENT_TIMESTAMP - INTERVAL '3 days'),   -- nursultan добавил "1984"
(10, 10, CURRENT_TIMESTAMP - INTERVAL '1 day');  -- aslan любит "The Catcher in the Rye"

INSERT INTO comments (user_id, book_id, content, created_date, parent_comment_id)
VALUES
-- Основные комментарии
(1, 1, 'An incredible epic. Tolstoy really captures the soul of history.', CURRENT_TIMESTAMP - INTERVAL '12 days', NULL),
(2, 3, 'Loved how Elizabeth stands up for herself. Classic Austen brilliance.', CURRENT_TIMESTAMP - INTERVAL '10 days', NULL),
(3, 5, 'A deep and emotional read — timeless message.', CURRENT_TIMESTAMP - INTERVAL '8 days', NULL),
(4, 2, 'Dostoevsky’s insight into guilt and redemption is unmatched.', CURRENT_TIMESTAMP - INTERVAL '6 days', NULL),
(5, 6, 'Masterpiece! The satire is as relevant today as ever.', CURRENT_TIMESTAMP - INTERVAL '5 days', NULL),
(6, 7, 'Every time I read 1984, it feels more real...', CURRENT_TIMESTAMP - INTERVAL '4 days', NULL),
(7, 9, 'Huxley was ahead of his time. Brilliant dystopia.', CURRENT_TIMESTAMP - INTERVAL '3 days', NULL),
(8, 10, 'Holden’s character feels raw and human.', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),
(9, 4, 'Fitzgerald’s prose is pure poetry.', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),
(10, 8, 'Hemingway at his best — simple but powerful.', CURRENT_TIMESTAMP - INTERVAL '12 hours', NULL),

-- Ответы на комментарии (вложенные)
(2, 1, 'Agree completely! Especially the parts on Pierre’s journey.', CURRENT_TIMESTAMP - INTERVAL '11 days', 1),
(3, 3, 'Yes! Her wit is unmatched.', CURRENT_TIMESTAMP - INTERVAL '9 days', 2),
(4, 2, 'That chapter was intense — truly philosophical.', CURRENT_TIMESTAMP - INTERVAL '5 days', 4),
(5, 6, 'Absolutely, and the ending is genius.', CURRENT_TIMESTAMP - INTERVAL '4 days', 5),
(6, 7, 'Feels almost prophetic now.', CURRENT_TIMESTAMP - INTERVAL '2 days', 6);

INSERT INTO highlights (user_id, book_id, text_content, page_number, color, created_date)
VALUES
(1, 1, 'We can know only that we know nothing. And that is the highest degree of human wisdom.', 220, 'yellow', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(2, 3, 'I declare after all there is no enjoyment like reading!', 45, 'pink', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(3, 5, 'You never really understand a person until you consider things from his point of view.', 88, 'green', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(4, 2, 'Pain and suffering are always inevitable for a large intelligence and a deep heart.', 305, 'blue', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(5, 6, 'Manuscripts don’t burn.', 270, 'yellow', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(6, 7, 'Big Brother is watching you.', 10, 'orange', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(7, 9, 'Words can be like X-rays if you use them properly—they’ll go through anything.', 90, 'green', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(8, 8, 'A man can be destroyed but not defeated.', 35, 'blue', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(9, 4, 'So we beat on, boats against the current, borne back ceaselessly into the past.', 150, 'purple', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
(10, 10, 'Don’t ever tell anybody anything. If you do, you start missing everybody.', 22, 'yellow', CURRENT_TIMESTAMP - INTERVAL '2 hours');

INSERT INTO personal_charts (user_id, chart_name, description, created_date)
VALUES
(1, 'Classics I Recommend', 'Timeless masterpieces everyone should read.', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(2, 'Romantic Reads', 'My favorite love stories with strong characters.', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(3, 'Moral Lessons', 'Books that make you think deeper about right and wrong.', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(4, 'Psychological Depth', 'Novels exploring the complexity of human mind.', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(5, 'Soviet Era Satire', 'Brilliant critiques of totalitarianism and hypocrisy.', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(6, 'Dystopian Worlds', 'Books warning about the dark sides of progress.', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(7, 'Philosophical Favorites', 'Ideas that changed my worldview.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(8, 'Short but Powerful', 'Books under 200 pages that hit hard.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(9, '20th Century Icons', 'Defining works of modern literature.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(10, 'Weekend Reading', 'Light novels for cozy evenings.', CURRENT_TIMESTAMP - INTERVAL '1 day');










