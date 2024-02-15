import { executeQuery, pool } from "../config/database";
import { IVote } from "../models/Vote";

import { createClient } from "@supabase/supabase-js";
import { errorMessage } from "../utils";

const supabaseUrl = "https://zfznabqjtcrjgppdynot.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmem5hYnFqdGNyamdwcGR5bm90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODAwMjI4OCwiZXhwIjoyMDIzNTc4Mjg4fQ.58ohLnc-O1dHu8LSRQYFHU2l0Rz_4qp1ChUDB9Tr90A";
const supabase = createClient(supabaseUrl, supabaseKey);

export class VoteController {
  async createTable() {
    const queryText = `
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        mayor VARCHAR(100) NOT NULL,
        vice_mayor VARCHAR(100) NOT NULL,
        voter_photo VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await executeQuery(queryText);
      return true;
    } catch (error) {
      return false;
    }
  }

  async vote(data: IVote, photo?: Express.Multer.File) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const queryText = `
        INSERT INTO votes (mayor, vice_mayor, voter_photo)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;

      const values = [data.mayor, data.viceMayor, "voter-6.png"];

      const [{ id }] = (await client.query(queryText, values)).rows;

      const uploadedPhoto = await this.uploadFile(id, photo!);

      if (!uploadedPhoto) {
        await client.query("ROLLBACK");
        return false;
      }

      await client.query("COMMIT");
      return { message: "Seu voto foi confirmado!" };
    } catch (error) {
      await client.query("ROLLBACK");
      return errorMessage("Ocorreu um erro ao votar, tente novamente.");
    } finally {
      client.release();
    }
  }

  async uploadFile(id: number, file: Express.Multer.File) {
    const { error } = await supabase.storage
      .from("storage")
      .upload(`voter-${id}.png`, file.buffer, { contentType: file.mimetype });

    if (error) {
      return false;
    }

    return true;
  }

  // Exemplo de download de arquivo do armazenamento do Supabase
  async downloadFile(fileName: string) {
    const { error } = await supabase.storage.from("storage").download(fileName);
    if (error) {
      console.error("Erro ao baixar o arquivo:", error.message);
      return;
    }
    // const url = URL.createObjectURL(data);
    // Faça algo com o URL do arquivo baixado, como exibir em uma tag <img> ou <a>
  }
}
