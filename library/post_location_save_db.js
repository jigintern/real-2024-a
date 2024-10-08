//経度と緯度の取得
async function postUserLocationSaveDb(req, kv) {
  // リクエストのペイロードを取得
  const requestJson = await req.json();
  // JSONの中から欲しい情報を取り出す
  const userID = requestJson["userID"]; //userIDの取得
  const latitude = requestJson["latitude"]; //user_latitudeの取得
  const longitude = requestJson["longitude"]; //user_longitudeの取得

  // get: 単体の取得
  const getResult = await kv.get(["user", userID]);
  const user = getResult.value;

  // latitudeとlongitudeを上書きする
  user.latitude = latitude;
  user.longitude = longitude;

  // keyが既に存在する場合は、更新
  await kv.set(["user", userID], user);

  return new Response();
}

export { postUserLocationSaveDb };
