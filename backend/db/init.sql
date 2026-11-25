CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL
);

INSERT INTO tareas (titulo) VALUES ('Instalar Docker'),('Crear contenedores');