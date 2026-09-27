
-- Caso ocorra algum problema no login, executar o código abaixo, para arrumar a senha do usuário root:
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

-- Esse script vale para o MySQL 8.x. Se seu MySQL for 5.x, precisa executar essa linha comentada:
-- CREATE DATABASE IF NOT EXISTS agenda;
CREATE DATABASE IF NOT EXISTS agenda DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE agenda;

CREATE TABLE Livro (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  autor varchar(50) NOT NULL,
  dataPub varchar(50) NOT NULL,
  isbn varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY livro_nome_UN (nome)
);
