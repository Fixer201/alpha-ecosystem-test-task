import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'export',
    
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fakestoreapi.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
            },
            {
                protocol: 'https',
                hostname: 'pinterest.com',
            },
            {
                protocol: "https",
                hostname: 'pin.it',
            }
        ],
    },
};

export default nextConfig;
