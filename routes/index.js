const express = require("express");
const wrap = require("express-async-error-wrapper");

const router = express.Router();

router.get("/", wrap(async (req, res) => {
	res.render("index/index");
}));

router.get("/cadastro", wrap(async (req, res) => {
	res.render("index/cadastro");
}));


router.get("/listagem", wrap(async (req, res) => {
	res.render("index/listagem");
}));

router.get("/obter", wrap(async (req, res) => {
	res.render("index/obter");
}));

router.get("/edicao", wrap(async (req, res) => {
	const id = parseInt(req.query["id"]);
	if (!id) {
		res.status(400).render("erro", { mensagem: "Id inválido" });
		return;
	}

	res.render("index/edicao", { id });
}));


module.exports = router;
