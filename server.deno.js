import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import { POST_add_DB_SP } from "./library/post_add_db_sp.js";
import { POST_delete_DB_SP } from "./library/post_delete_db_sp.js";
import { ID_create_DB, ID_get_DB } from "./library/id_create_db.js"; //ローカルストレージからIDを読み込む(key="myId")。なければIDを作って保存してその値を返す
import { Get_grade } from "./library/get_grade.js";
import { POST_get_DB_SP } from "./library/get_sp.js";
import { Quest_completed } from "./library/quest_completed.js"; //クエスト完了
import { POST_buy_sticker } from "./library/post_sticker_buy.js"; //ステッカーの購入
import { GET_mySticker } from "./library/get_mySticker.js";//ステッカーの確認
import { POST_sticker_cp } from "./library/post_sticker_cp.js"//ステッカーの移動
import { POST_user_location_save_db } from "./library/post_location_save_db.js"; // 定期的にユーザーの位置情報をdbに保存する
import { distilled_user_within_24hours } from "./library/distilled_user_within_24hour.js"; // 定期的にユーザーの位置情報をdbに保存する
import "https://deno.land/std@0.224.0/dotenv/load.ts"; //.envの読み込み用

let kv;

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  if (kv === undefined) {
    // リクエストに応じて環境変数を設定する
    // Deno KVの読み込み
    kv = await Deno.openKv(
      Deno.env.get("URL"),
    );
  }

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }

  if (req.method === "POST" && pathname === "/sp") {
    return POST_add_DB_SP(req, kv);
  }

  if (req.method === "DELETE" && pathname === "/sp") {
    return POST_delete_DB_SP(req, kv);
  }

  if (req.method === "GET" && pathname === "/sp") {
    return POST_get_DB_SP(req, kv);
  }

  if (req.method === "GET" && pathname === "/user") {
    return ID_get_DB(req, kv);
  }

  //自分のIDの読み出し(あれば値を返し、なければ新しく作って保存してその値を返す。)
  if (req.method === "POST" && pathname === "/user") {
    return ID_create_DB(req, kv);
  }

  if (req.method === "POST" && pathname === "/quest_completed") {
    return Quest_completed(req, kv);
  }

  if (req.method === "POST" && pathname === "/receive_location") {
    return POST_user_location_save_db(req, kv);
  }

  //自身のグレード取得(文字列JSON)
  if (req.method === "GET" && pathname === "/grade") {  
    return Get_grade(req, kv);
  }

  if (req.method === "GET" && pathname === "/distilled_user") {  
    return distilled_user_within_24hours(req, kv);
  }

  //ステッカーの購入
  if (req.method === "POST" && pathname === "/buy_sticker") {  
    return POST_buy_sticker(req, kv);
  }
  //ステッカーの確認
  if (req.method === "GET" && pathname === "/get_mySticker") {  
    return GET_mySticker(req, kv);
  }
  //ステッカーの確認
  if (req.method === "POST" && pathname === "/move_mySticker") {  
    return POST_sticker_cp(req, kv);
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
