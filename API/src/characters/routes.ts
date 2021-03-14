import express, { Router } from "express";
import { DataService } from "../utility";
import { createCharacter } from "./createCharacter";
import { getCharacter } from "./getCharacter";
import { getCharacters } from "./getCharacters";
import { getCharacterHp } from "./getCharacterHp";
import { updateCharacterHp } from "./updateCharacterHp";
import { setCharacterHp } from "./setCharacterHp";
import { setCharacterTempHp } from "./setCharacterTempHp";

export const buildRouter = (service: DataService): Router => {
  const router = express.Router();
  
  router.get("/", getCharacters(service));
  router.post("/", createCharacter(service));
  router.get("/:characterId", getCharacter(service));
  router.get("/:characterId/hp", getCharacterHp(service));
  router.post("/:characterId/hp", updateCharacterHp(service));
  router.put("/:characterId/hp", setCharacterHp(service));
  router.put("/:characterId/hp/updateTemp", setCharacterTempHp(service));

  return router;
}