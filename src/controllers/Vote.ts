/* eslint-disable @typescript-eslint/no-explicit-any */
import { executeQuery, pool } from "../config/database";
import { IVote, IVoteData } from "../models/Vote";

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

      const updateQuery = `
        UPDATE votes
        SET voter_photo = $1
        WHERE id = $2;
      `;

      await client.query(updateQuery, [`voter-${id}.png`, id]);

      await client.query("COMMIT");
      return { message: "Seu voto foi confirmado!" };
    } catch (error) {
      await client.query("ROLLBACK");
      return errorMessage("Ocorreu um erro ao votar, tente novamente.");
    } finally {
      client.release();
    }
  }

  async getAllVotes() {
    try {
      const votesMap = new Map<string, IVoteData>();

      const getQuery = `
        SELECT * FROM votes;
      `;

      const votes = (await executeQuery<any>(getQuery)).rows;

      for (const vote of votes) {
        if (votesMap.has(vote.mayor)) {
          const data = votesMap.get(vote.mayor)!;
          data.votes++;
          data.photos.push(vote.voter_photo);
          data.isMayor = true;
          votesMap.set(vote.mayor, data);
        } else {
          votesMap.set(vote.mayor, {
            votes: 1,
            photos: [vote.voter_photo],
            isMayor: true,
          });
        }

        if (votesMap.has(vote.vice_mayor)) {
          const data = votesMap.get(vote.vice_mayor)!;
          data.votes++;
          data.photos.push(vote.voter_photo);
          data.isMayor = false;
          votesMap.set(vote.vice_mayor, data);
        } else {
          votesMap.set(vote.vice_mayor, {
            votes: 1,
            photos: [vote.voter_photo],
            isMayor: false,
          });
        }
      }

      const mayorTotal = Array.from(votesMap.values()).reduce(
        (acc, curr) => (curr.isMayor ? acc + curr.votes : acc),
        0
      );

      const viceMayorTotal = Array.from(votesMap.values()).reduce(
        (acc, curr) => (!curr.isMayor ? acc + curr.votes : acc),
        0
      );

      votesMap.forEach((value) => {
        if (value.isMayor) {
          value.percent = (value.votes / mayorTotal) * 100;
        } else {
          value.percent = (value.votes / viceMayorTotal) * 100;
        }
      });

      console.log(votesMap);

      return Object.fromEntries(votesMap);
    } catch (error) {
      return errorMessage("Ocorreu um erro ao buscar os votos.");
    }
  }

  async getPhoto(photoName: string) {
    const { data, error } = await supabase.storage
      .from("storage")
      .createSignedUrl(photoName, 60);

    if (error) {
      return errorMessage("Ocorreu um erro ao buscar a foto.");
    }

    return data.signedUrl;
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
}
