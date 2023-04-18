async function getHandler(query, res) {
  const { room, startId } = query;
  const maxId = parseInt((await global.etcdClient.get(`${room}/count`)) || "0");
  if (startId && maxId < startId) res.json([]);
  else {
    const messages = [];
    for (let i = startId || 1; i <= maxId; i++) {
      messages.push(JSON.parse(await global.etcdClient.get(`${room}/${i}`)));
    }
    res.json(messages);
  }
}

async function postHandler(query, res) {
  const { room, message, from } = query;
  const maxId = parseInt((await global.etcdClient.get(`${room}/count`)) || "0");
  await global.etcdClient
    .put(`${room}/${maxId + 1}`)
    .value(JSON.stringify({ message, from }));
  await global.etcdClient.put(`${room}/count`).value(`${maxId + 1}`);
  res.json({ message, from, id: maxId + 1 });
}

export default function handler(req, res) {
  const { query, body, method } = req;

  switch (method) {
    case "GET":
      getHandler(query, res);
      break;
    case "POST":
      postHandler(body, res);
      break;
    default:
      res.status(405).end("Method not allowed");
  }
}
