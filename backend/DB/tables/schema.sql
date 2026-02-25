CREATE TABLE flowers (
                         id VARCHAR(64) PRIMARY KEY,
                         x DOUBLE NOT NULL,
                         y DOUBLE NOT NULL,
                         name VARCHAR(255) NOT NULL,
                         hours DOUBLE NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);