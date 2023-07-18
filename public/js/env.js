const envConfig = {
    local: "http://localhost:5000",
    live: "https://gwent-online.glitch.me"
}

const { hostname } = window.location;
const hostUrl = hostname === 'localhost' ? envConfig.local : envConfig.live;