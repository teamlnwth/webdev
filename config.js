
const isProd = process.env.NODE_ENV === "production";

const config = {
  isProd,
  serverUrlPrefix: isProd
    ? "https://wd03.cloud-workshop.online/api"
    : "http://localhost:1337/api",
    serverAdminPrefix: isProd
    ? "https://wd03-admin.cloud-workshop.online"
    : "http://localhost:1337",
};


export default config;
