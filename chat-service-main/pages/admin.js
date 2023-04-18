import { useState } from "react";
import {
  Button,
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { Container, Box } from "@mui/system";
import axios from "axios";

export default function Admin() {
  const [serverStatus, setServerStatus] = useState("");
  const [spawnStatus, setSpawnStatus] = useState("");
  const [spawnName, setSpawnName] = useState("");
  const [spawnPeerUrl, setSpawnPeerUrl] = useState("");
  const [spawnClientUrl, setSpawnClientUrl] = useState("");
  const [spawnCluster, setSpawnCluster] = useState("");
  const [spawnState, setSpawnState] = useState("existing");
  const [stopStatus, setStopStatus] = useState("");
  const [clusterStatus, setClusterStatus] = useState({});
  const [clustAddPeer, setClustAddPeer] = useState("");
  const [clustAddStatus, setClustAddStatus] = useState("");
  const [clustRemovePeer, setClustRemovePeer] = useState("");
  const [clustRemoveStatus, setClustRemoveStatus] = useState("");
  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h4">Server Operation</Typography>
        <Box>
          <Typography variant="h5">Server Status</Typography>
          <Button
            variant="contained"
            onClick={() => {
              axios
                .get("/api/admin")
                .then(({ data }) => {
                  setServerStatus(data.health ? "Up" : "Down");
                })
                .catch(() => setServerStatus("Down"));
            }}
          >
            Test
          </Button>
          <p>Server Status: {serverStatus}</p>
        </Box>
        <Box>
          <Typography variant="h5">Spawn Server</Typography>
          <Typography variant="body">
            Use cluster operation to add a server before spawning
          </Typography>
          <br />
          <TextField
            id="name"
            label="Name"
            type="text"
            variant="standard"
            size="sm"
            value={spawnName}
            onChange={(evt) => setSpawnName(evt.currentTarget.value)}
          />
          <br />
          <TextField
            id="peerURL"
            label="Peer URL"
            type="text"
            variant="standard"
            size="sm"
            value={spawnPeerUrl}
            onChange={(evt) => setSpawnPeerUrl(evt.currentTarget.value)}
          />
          <br />
          <TextField
            id="clientURL"
            label="Client URL"
            type="text"
            variant="standard"
            size="sm"
            value={spawnClientUrl}
            onChange={(evt) => setSpawnClientUrl(evt.currentTarget.value)}
          />
          <br />
          <TextField
            id="cluster"
            label="Cluster"
            type="text"
            variant="standard"
            size="sm"
            value={spawnCluster}
            onChange={(evt) => setSpawnCluster(evt.currentTarget.value)}
          />
          <br />
          <TextField
            id="state"
            label="State"
            type="text"
            variant="standard"
            size="sm"
            value={spawnState}
            onChange={(evt) => setSpawnState(evt.currentTarget.value)}
          />
          <br />
          <Button
            variant="contained"
            onClick={() => {
              axios
                .post("/api/admin", {
                  name: spawnName,
                  peer_url: spawnPeerUrl,
                  client_url: spawnClientUrl,
                  cluster: spawnCluster,
                  state: spawnState,
                })
                .then(({ data }) => {
                  setSpawnStatus("Spawned");
                })
                .catch(() => setSpawnStatus("Failed"));
            }}
          >
            Spawn
          </Button>
          <p>Spawn Status: {spawnStatus}</p>
        </Box>
        <Box>
          <Typography variant="h5">Stop Server</Typography>
          <Button
            variant="contained"
            onClick={() => {
              axios
                .delete("/api/admin")
                .then(({ data }) => {
                  setStopStatus("Stoped");
                })
                .catch(() => setStopStatus("Failed"));
            }}
          >
            Stop
          </Button>
          <p>Spawn Status: {stopStatus}</p>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "2rem" }}>
        <Typography variant="h4">Cluster Operation</Typography>
        <Box>
          <Typography variant="h5">Cluster Status</Typography>
          <p>
            Cluster ID:{" "}
            {clusterStatus.header && clusterStatus.header.cluster_id}
          </p>
          <p>
            Member ID: {clusterStatus.header && clusterStatus.header.member_id}
          </p>
          <div>
            Peers:
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Member Name</TableCell>
                  <TableCell>Client URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clusterStatus.members &&
                  clusterStatus.members.map((member) => (
                    <TableRow key={`member-${member.ID}`}>
                      <TableCell>{member.ID}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        {member.clientURLs && member.clientURLs[0]}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="contained"
            onClick={() => {
              axios
                .get("/api/server")
                .then(({ data }) => {
                  setClusterStatus(data);
                })
                .catch(() => setClusterStatus("Down"));
            }}
          >
            Test
          </Button>
        </Box>
        <Box>
          <Typography variant="h5">Cluster Add</Typography>
          <TextField
            id="peerURL"
            label="Peer URL"
            type="text"
            variant="standard"
            size="sm"
            value={clustAddPeer}
            onChange={(evt) => setClustAddPeer(evt.currentTarget.value)}
          />
          <br />
          <Button
            variant="contained"
            onClick={() => {
              axios
                .post("/api/server", { peer_url: clustAddPeer })
                .then(({ data }) => {
                  setClustAddStatus("Success");
                })
                .catch(() => setClustAddStatus("Failed"));
            }}
          >
            Add
          </Button>
          <p>Peer Add Status: {clustAddStatus}</p>
        </Box>
        <Box>
          <Typography variant="h5">Cluster Delete</Typography>
          <TextField
            id="peerID"
            label="Peer ID"
            type="text"
            variant="standard"
            size="sm"
            value={clustRemovePeer}
            onChange={(evt) => setClustRemovePeer(evt.currentTarget.value)}
          />
          <br />
          <Button
            variant="contained"
            onClick={() => {
              axios
                .delete("/api/server", { data: {peer_id: clustRemovePeer} })
                .then(({ data }) => {
                  setClustRemoveStatus("Success");
                })
                .catch(() => setClustRemoveStatus("Failed"));
            }}
          >
            Remove
          </Button>
          <p>Peer Remove Status: {clustRemoveStatus}</p>
        </Box>
      </Box>
    </Container>
  );
}
