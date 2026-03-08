"use strict";

import { outbound_port, stream_settings } from "../common/stream.mjs";

export function http_outbound(server, tag, forced_port) {
    const stream_settings_object = stream_settings(server, "http", tag);
    const stream_settings_result = stream_settings_object["stream_settings"];
    const dialer_proxy = stream_settings_object["dialer_proxy"];
    const port = outbound_port(server["server_port"], forced_port);
    let users = null;
    if (server["username"] && server["password"]) {
        users = [
            {
                user: server["username"],
                pass: server["password"],
            }
        ];
    }
    return {
        outbound: {
            protocol: "http",
            tag: tag,
            settings: {
                servers: [{
                    address: server["server"],
                    port: port,
                    users: users
                }]
            },
            streamSettings: stream_settings_result
        },
        dialer_proxy: dialer_proxy
    };
};
