const express = require("express");
const wrap = require("express-async-error-wrapper");
const Livro = require("../../models/livro");
const multer = require("multer");

const router = express.Router();

// Os arquivos ficarão armazenados temporariamente na memória RAM do servidor
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		callback(null, file.mimetype === "image/jpeg");
	}
});

// Cria um middleware para receber um campo de arquivo
const middleware = upload.fields([
	{ name: "capa", maxCount: 1 }
]);

router.post("/criar", middleware, wrap(async (req, res) => {
	const resultado = await Livro.criar(req.body, req.files && req.files["capa"]);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
 	}));

router.get("/listar", wrap(async (req, res) => {
	const resultado = await Livro.listar();

	res.json(resultado);
}));

router.get("/obter", wrap(async (req, res) => {
	const id = parseInt(req.query["id"]);

	const resultado = await Livro.obter(id);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));



router.put("/editar", middleware, wrap(async (req, res) => {
	const resultado = await Livro.editar(req.body, req.files && req.files["capa"]);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));

router.delete("/excluir", wrap(async (req, res) => {
	const id = parseInt(req.query["id"]);

	const resultado = await Livro.excluir(id);

	if (typeof resultado === "string") {
		res.status(400);
	}

	res.json(resultado);
}));

module.exports = router;
