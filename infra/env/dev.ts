export const devConfig = {
  account: '416607071533', // Replace with your AWS account ID
  region: 'ap-northeast-1', // Your AWS region
  
  // Database
  databaseUrl: 'postgresql://neondb_owner:npg_Mrk1K7cLneZE@ep-restless-sunset-a154k4e7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  
  // App settings
  stage: 'dev',
  appName: 'edward-learning-app',
  
  // Lambda settings
  lambdaTimeout: 30,
  lambdaMemory: 512,
  
  // CORS origins (for development)
  corsOrigins: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
  ],
};
