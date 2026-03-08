"use strict";

import { outbound_port, stream_settings } from "../common/stream.mjs";

export function shadowsocks_outbound(server, tag, forced_port) {
    const stream_settings_object = stream_settings(server, "shadowsocks", tag);
    const stream_settings_result = stream_settings_object["stream_settings"];
    const dialer_proxy = stream_settings_object["dialer_proxy"];
    const port = outbound_port(server["server_port"], forced_port);
    return {
        outbound: {
            protocol: "shadowsocks",
            tag: tag,
            settings: {
                servers: [{
                    address: server["server"],
                    port: port,
                    email: server["username"],
                    password: server["password"],
                    method: server["shadowsocks_security"],
                    uot: server["shadowsocks_udp_over_tcp"] == '1'
                }]
            },
            streamSettings: stream_settings_result
        },
        dialer_proxy: dialer_proxy
    };
};
