/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        // TODO: выключить
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        formats: ["image/webp"],
    },
    trailingSlash: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: require.resolve("@svgr/webpack"),
                    options: {
                        typescript: true,
                    },
                },
            ],
        });

        return config;
    },
};

module.exports = nextConfig;
