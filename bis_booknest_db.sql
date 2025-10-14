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






















