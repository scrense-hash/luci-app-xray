"use strict";

import { port_array } from "../common/stream.mjs";

export function balancer(ref, x, prefix, config) {
    const v = ref[x] || [];
    if (length(v) == 0) {
        return ["direct"];
    }
    let result = [];
    for (let k in v) {
        const tag = `${prefix}@balancer_outbound:${k}`;
        const section = config != null ? config[k] : null;
        if (section == null || section["server_port"] == null) {
            push(result, tag);
            continue;
        }
        const ports = port_array(section["server_port"]);
        if (length(ports) <= 1) {
            push(result, tag);
            continue;
        }
        for (let p in ports) {
            push(result, `${tag}@port:${p}`);
        }
    }
    return result;
};

export function api_conf(proxy) {
    if (proxy["xray_api"] == '1') {
        return {
            tag: "api",
            services: [
                "HandlerService",
                "LoggerService",
                "StatsService"
            ]
        };
    }
    return null;
};

export function metrics_conf(proxy) {
    if (proxy["metrics_server_enable"] == "1") {
        return {
            tag: "metrics"
        };
    }
    return null;
};

export function policy(proxy) {
    const stats = proxy["stats"] == "1";
    return {
        levels: {
            "0": {
                handshake: int(proxy["handshake"] || 4),
                connIdle: int(proxy["conn_idle"] || 300),
                uplinkOnly: int(proxy["uplink_only"] || 2),
                downlinkOnly: int(proxy["downlink_only"] || 5),
                bufferSize: int(proxy["buffer_size"] || 4),
                statsUserUplink: stats,
                statsUserDownlink: stats,
            }
        },
        system: {
            statsInboundUplink: stats,
            statsInboundDownlink: stats,
            statsOutboundUplink: stats,
            statsOutboundDownlink: stats
        }
    };
};

export function logging(proxy) {
    return {
        access: proxy["access_log"] == "1" ? "" : "none",
        loglevel: proxy["loglevel"] || "warning",
        dnsLog: proxy["dns_log"] == "1"
    };
};

export function system_route_rules(proxy) {
    let result = [];
    if (proxy["xray_api"] == '1') {
        push(result, {
            type: "field",
            inboundTag: ["api"],
            outboundTag: "api"
        });
    }
    if (proxy["metrics_server_enable"] == "1") {
        push(result, {
            type: "field",
            inboundTag: ["metrics"],
            outboundTag: "metrics"
        });
    }
    return result;
};
