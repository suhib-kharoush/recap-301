DROP TABLE IF EXISTS characters;

CREATE TABLE characters(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    image TEXT,
    house VARCHAR(255),
    patronus VARCHAR(255),
    is_alive boolean NOT NULL DEFAULT true,
    created_by VARCHAR(255)
)