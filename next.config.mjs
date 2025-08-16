/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@untitledui/icons"],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/game/new",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
