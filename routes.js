require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const route = express.Router();

const PROJECT_URL = process.env.URL;
const PROJECT_KEY = process.env.KEY;

const supaClient = createClient(PROJECT_URL, PROJECT_KEY);

route.get("/saldo", async (req, res) => {
  const { data } = await supaClient
    .from("clients")
    .select("id, credit")
    .eq("id", req.body.id)
    .single();

  res.status(200).json(data);
});

route.post("/depositar", async (req, res) => {
  const { id, credit } = req.body;
  if (credit < 0) {
    res.status(400).json({ message: "Credito invalido" });
  }
  const { data } = await supaClient
    .from("clients")
    .select("id, credit")
    .eq("id", id)
    .single();

  if (data == null) {
    res.status(404).json({ mensage: "um erro " });
    return;
  }

  const { id: userId, credit: userCredit } = data;
  const {
    data: [{ credit: updatedCredit }],
  } = await supaClient
    .from("clients")
    .upsert({ id: userId, credit: credit + userCredit });

  return res.status(200).json({ credit: updatedCredit });
});

route.post("/debitar", async (req, res) => {
  const { id, credit } = req.body;
  const { data } = await supaClient
    .from("clients")
    .select("id, credit")
    .eq("id", id)
    .single();

  if (data == null) {
    res.status(404).json({ mensage: "um erro " });
    return;
  }
  if (data?.credit < credit) {
    res.status(400).json({ message: "Credito invalido" });
  }

  const {
    data: [{ credit: updatedCredit }],
  } = await supaClient
    .from("clients")
    .upsert({ id: data.id, credit: data.credit - credit });

  res.status(200).json({ credit: updatedCredit });
});

route.post("/criauser", async (req, res) => {
  const { id, credit } = req.body;
  const { data } = await supaClient
    .from("clients")
    .select("id, credit")
    .eq("id", id)
    .single();

  if (data) {
    res.status(400).json({ message: "usuario existente" });
  }

  const {
    data: [{ id: createID, credit: updatedCredit }],
  } = await supaClient.from("clients").upsert({ id: id, credit: credit });

  res.status(200).json({ id: createID, credit: updatedCredit });
});

module.exports = route;
