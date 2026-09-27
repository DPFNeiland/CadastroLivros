const Sql = require("../data/sql");
const fs = require("node:fs/promises");
const path = require("path");

class Livro {
	static validar(livro, criacao) {
		if (!livro) {
			return "Dados inválidos";
		}

		if (!criacao) {
			livro.id = parseInt(livro.id);

			if (!livro.id) {
				return "Id inválido";
			}
		}

		livro.nome = (livro.nome || "").normalize().trim();
		if (!livro.nome || livro.nome.length > 50) {
			return "Nome inválido";
		}

		livro.autor = (livro.autor || "").normalize().trim();
		if (!livro.autor || livro.autor.length > 50) {
			return "Autor inválido";
		}		
		

		livro.datapub = (livro.datapub || "").normalize().trim();
		if (!livro.datapub || livro.datapub.length > 50) {
			return "Data de publicação inválido";
		}

		livro.isbn = (livro.isbn || "").normalize().trim();
		if (!livro.isbn || livro.isbn.length > 50) {
			return "ISBN inválido";
		} 

		return null;
	}

	static async criar(livro, capa) {
		const erro = Livro.validar(livro, true);
		if (erro)
			return erro;

		if (!capa || !capa.length) {
			return "Capa inválido";
		}

		return await Sql.connect(async (sql) => {
			await sql.beginTransaction();

			await sql.query("INSERT INTO livro (nome, autor, datapub, isbn) VALUES (?, ?, ?, ?)", [livro.nome, livro.autor, livro.datapub, livro.isbn]);

			livro.id = await sql.scalar("SELECT last_insert_id()");

			const pastaCapas = path.join(__dirname, "../public/images/capa");
			await fs.mkdir(pastaCapas, { recursive: true });

			const caminho = path.join(pastaCapas, livro.id + ".jpg");

			await fs.writeFile(caminho, capa[0].buffer);

			await sql.commit();

			return livro;
		});
	}


	static async listar() {
		return await Sql.connect(async (sql) => {
			const lista = await sql.query("SELECT id, nome, autor, dataPub AS datapub, isbn FROM livro ORDER BY id ASC");

			return lista;
		});
	}

	static async obter(id) {
		if (!id) {
			return "Id inválido";
		}

		return await Sql.connect(async (sql) => {
			const lista = await sql.query("SELECT id, nome, autor, dataPub AS datapub, isbn FROM livro WHERE id = ?", [id]);

			if (!lista.length) {
				return "Livro não encontrado";
			}

			return lista[0];
		});
	}

	static async editar(livro, capa) {
		const erro = Livro.validar(livro, false);
		if (erro)
			return erro;

		return await Sql.connect(async (sql) => {
			await sql.beginTransaction();
			const existente = await sql.scalar("SELECT id FROM livro WHERE id = ?", [livro.id]);
			if (!existente) {
				return "Livro não encontrado";
			}

			await sql.query("UPDATE livro SET nome = ?, autor = ?, dataPub = ?, isbn = ? WHERE id = ?", [livro.nome, livro.autor, livro.datapub, livro.isbn, livro.id]);

			if (capa && capa.length) {
				const pastaCapas = path.join(__dirname, "../public/images/capa");
				await fs.mkdir(pastaCapas, { recursive: true });
				await fs.writeFile(path.join(pastaCapas, livro.id + ".jpg"), capa[0].buffer);
			}

			await sql.commit();
			return null;
		});
	}

	static async excluir(id) {
		if (!id) {
			return "Id inválido";
		}

		return await Sql.connect(async (sql) => {
			await sql.query("DELETE FROM livro WHERE id = ?", [id]);

			if (!sql.affectedRows) {
				return "Livro não encontrado";
			}

			const caminho = path.join(__dirname, "../public/images/capa", id + ".jpg");
			await fs.unlink(caminho).catch((erro) => {
				if (erro.code !== "ENOENT") {
					throw erro;
				}
			});

			return null;
		});
	}
}

module.exports = Livro;
