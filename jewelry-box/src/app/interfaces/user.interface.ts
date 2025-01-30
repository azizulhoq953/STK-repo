// Add these to your config.ts or config/index.ts file

interface Config {
    // ... your existing config properties ...
    emailService: string;     // e.g., 'gmail'
    emailUser: string;        // email address
    emailPassword: string;    // email password or app-specific password
    emailFrom: string;        // sender email address
    frontendUrl: string;      // your frontend application URL
  }
  
  // Example config implementation
  const config: Config = {
    // ... your existing config ...
    emailService: process.env.EMAIL_SERVICE || 'gmail',
    emailUser: process.env.EMAIL_USER || '',
    emailPassword: process.env.EMAIL_PASSWORD || '',
    emailFrom: process.env.EMAIL_FROM || 'noreply@yourapp.com',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  };
  
  export default config;