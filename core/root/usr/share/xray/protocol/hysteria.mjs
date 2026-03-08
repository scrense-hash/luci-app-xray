"use strict";

import { outbound_port, stream_settings } from "../common/stream.mjs";

export function hysteria_outbound(server, tag, forced_port) {
    const stream_settings_object = stream_settings(server, "hysteria", tag);
    const stream_settings_result = stream_settings_object["stream_settings"];
    const dialer_proxy = stream_settings_object["dialer_proxy"];
    const port = outbound_port(server["server_port"], forced_port);
    return {
        outbound: {
            protocol: "hysteria",
            tag: tag,
            settings: {
                version: 2,
                address: server["server"],
                port: port,
            },
            streamSettings: stream_settings_result
        },
        dialer_proxy: dialer_proxy
    };
};
