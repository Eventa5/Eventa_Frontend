export default {
  input: "https://eventa-backend-pgun.onrender.com/api/docs/swagger.json",
  output: "src/services/api/client",
  plugins: [
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./src/services/api/hey-api.ts",
    },
  ],
};
