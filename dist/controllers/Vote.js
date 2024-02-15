"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteController = void 0;
const database_1 = require("../config/database");
const supabase_js_1 = require("@supabase/supabase-js");
const utils_1 = require("../utils");
const supabaseUrl = "https://zfznabqjtcrjgppdynot.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmem5hYnFqdGNyamdwcGR5bm90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODAwMjI4OCwiZXhwIjoyMDIzNTc4Mjg4fQ.58ohLnc-O1dHu8LSRQYFHU2l0Rz_4qp1ChUDB9Tr90A";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
class VoteController {
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
            await (0, database_1.executeQuery)(queryText);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async vote(data, photo) {
        const client = await database_1.pool.connect();
        try {
            await client.query("BEGIN");
            const queryText = `
        INSERT INTO votes (mayor, vice_mayor, voter_photo)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
            const values = [data.mayor, data.viceMayor, "voter-6.png"];
            const [{ id }] = (await client.query(queryText, values)).rows;
            const uploadedPhoto = await this.uploadFile(id, photo);
            if (!uploadedPhoto) {
                await client.query("ROLLBACK");
                return false;
            }
            await client.query("COMMIT");
            return { message: "Seu voto foi confirmado!" };
        }
        catch (error) {
            await client.query("ROLLBACK");
            return (0, utils_1.errorMessage)("Ocorreu um erro ao votar, tente novamente.");
        }
        finally {
            client.release();
        }
    }
    async uploadFile(id, file) {
        const { error } = await supabase.storage
            .from("storage")
            .upload(`voter-${id}.png`, file.buffer, { contentType: file.mimetype });
        if (error) {
            return false;
        }
        return true;
    }
    // Exemplo de download de arquivo do armazenamento do Supabase
    async downloadFile(fileName) {
        const { error } = await supabase.storage.from("storage").download(fileName);
        if (error) {
            console.error("Erro ao baixar o arquivo:", error.message);
            return;
        }
        // const url = URL.createObjectURL(data);
        // Faça algo com o URL do arquivo baixado, como exibir em uma tag <img> ou <a>
    }
}
exports.VoteController = VoteController;
