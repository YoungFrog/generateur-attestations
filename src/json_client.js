import { JSONRPCClient } from "json-rpc-2.0";

const headers = {
    "content-type": "application.json"
}

export const initialize = async (username, password) => {
    if (headers["authorization"]) return

    const { key } = await client.request("gesetu~session:open", [username, password])

    if (!key) return Promise.reject(new Error('No key was received. Invalid username/password ?'))

    headers["authorization"] = `Bearer ${key}`
}

const client = new JSONRPCClient(
    jsonRPCRequest => fetch('http://gesetu.intranet.he2b.be/jsonrpc.php', {
        method: "POST",
        headers,
        body: JSON.stringify(jsonRPCRequest)
    }).then((response) => {
        if (response.status === 200) {
            // Use client.receive when you received a JSON-RPC response.
            return response
                .json()
                .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
        } else if (jsonRPCRequest.id !== undefined) {
            return Promise.reject(new Error(response.statusText));
        }
    })

);


export default client