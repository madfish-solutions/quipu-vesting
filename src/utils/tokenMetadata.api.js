import axios from "axios";

const api = axios.create({ baseURL: "https://metadata.templewallet.com" });

export async function getTokensMetadata(address, id, timeout = 15000) {
  const metadata = await api
    .get(`metadata/${address}/${id}`, { timeout })
    .then((r) => r.data);
  return metadata;
}
