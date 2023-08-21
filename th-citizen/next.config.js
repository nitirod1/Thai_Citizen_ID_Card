/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    env: {
        SEPOLIA_RPC : "https://eth-sepolia.g.alchemy.com/v2/EbYOlAXgjvtwwwxlkYu2eJRi_DPwWV9L",
        CONTRACT_ADDRESS : '0xf00E350FA96f3bBD935b2182a9E3cE6689bC4559',
        BACKEND_URL : "http://localhost:8080/",
        PINATA: "pink-fond-pheasant-668.mypinata.cloud/",
        AUTH_PINATA :  `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhOGU0NjdjNi1kZDQ5LTQ2OGEtYThiYS0wNmU4NGU1MjZkZWQiLCJlbWFpbCI6Im5pdGlyb2QuNTU1NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDNkN2ZhYmQwNWNlYTM0YzVkODAiLCJzY29wZWRLZXlTZWNyZXQiOiI2MTljOGQ3ZmJjZTI1MmNiOGNhYWNiM2E0ODQ2YjUzNzIyMGYxMTViM2NmYjVlODUxYjE1NzdhZjk5MTQ3MGY3IiwiaWF0IjoxNjgzNTMwMTc1fQ.y2GGodX06OlbjiAESKOfoxZBonJKtFC30uN-b1XnuV0`
    },

}

module.exports = nextConfig
