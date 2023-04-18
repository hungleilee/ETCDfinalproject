const { spawn } = require("child_process");
const { Etcd3 } = require("etcd3");

function getHandler(query, res) {
  res.json({ health: !!global.etcd });
}

// {"name": "server1", "peer_url": "http://127.0.0.1:2380", "client_url": "http://127.0.0.1:2379", "cluster": "server1=http://127.0.0.1:2380,server2=http://127.0.0.1:2381,server3=http://127.0.0.1:2382", "state": "new"}
function postHandler(query, res) {
  if (!global.etcd) {
    if (
      !query.name ||
      !query.peer_url ||
      !query.client_url ||
      !query.cluster ||
      !query.state
    ) {
      return res.status(401).json({ error: "Bad input" });
    }
    global.etcd = spawn("etcd", [
      `--name`,
      query.name,
      `--initial-advertise-peer-urls`,
      query.peer_url,
      `--listen-peer-urls`,
      query.peer_url,
      `--listen-client-urls`,
      query.client_url,
      `--advertise-client-urls`,
      query.client_url,
      `--initial-cluster-token`,
      `chat-cluster`,
      `--initial-cluster`,
      query.cluster,
      `--initial-cluster-state`,
      query.state,
    ]);
    global.etcdConfig = query;
    if (!process.env.DISABLE_ETCD_LOG) {
      global.etcd.on("exit", (code) => {
        delete global.etcd;
        delete global.etcdConfig;
        delete global.etcdClient;
      });
      global.etcd.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });
      global.etcd.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
      });
    }
    global.etcdClient = new Etcd3({ hosts: query.peer_url });
    res.json({ health: !!global.etcd });
  } else {
    res.status(401).json({ error: "Alread up" });
  }
}

function delHandler(query, res) {
  if (global.etcd) {
    global.etcd.kill();
    delete global.etcd;
    delete global.etcdConfig;
    delete global.etcdClient;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Alread down" });
  }
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
    case "DELETE":
      delHandler(query, res);
      break;
    default:
      res.status(405).end("Method not allowed");
  }
}
