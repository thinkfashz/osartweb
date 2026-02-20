import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OSART | Core API System</title>
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
          <style>
              body {
                  background-color: #09090b;
                  color: #fafafa;
                  font-family: 'Inter', sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  overflow: hidden;
              }
              .container {
                  border: 1px solid #27272a;
                  padding: 3rem;
                  background: #18181b;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                  max-width: 600px;
                  text-align: center;
                  position: relative;
              }
              .border-accent {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 4px;
                  height: 100%;
                  background: #22d3ee;
              }
              h1 {
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 1.5rem;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                  margin-bottom: 1.5rem;
                  color: #22d3ee;
              }
              p {
                  color: #a1a1aa;
                  line-height: 1.6;
                  margin-bottom: 2rem;
              }
              .status {
                  display: inline-flex;
                  align-items: center;
                  gap: 0.5rem;
                  background: #020617;
                  padding: 0.5rem 1rem;
                  border-radius: 4px;
                  border: 1px solid #1e293b;
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 0.8rem;
                  color: #4ade80;
                  margin-bottom: 2rem;
              }
              .pulse {
                  width: 8px;
                  height: 8px;
                  background: #4ade80;
                  border-radius: 50%;
                  box-shadow: 0 0 10px #4ade80;
                  animation: pulse 2s infinite;
              }
              @keyframes pulse {
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
              }
              .links {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 1rem;
              }
              a {
                  padding: 0.75rem;
                  background: #27272a;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-size: 0.9rem;
                  font-weight: 600;
                  transition: all 0.2s;
                  border: 1px solid transparent;
              }
              a:hover {
                  background: #3f3f46;
                  border-color: #22d3ee;
                  color: #22d3ee;
              }
              .warning {
                  font-size: 0.7rem;
                  color: #71717a;
                  margin-top: 2rem;
                  font-family: 'JetBrains Mono', monospace;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="border-accent"></div>
              <h1>OSART | CORE ENGINE</h1>
              <div class="status">
                  <div class="pulse"></div>
                  CORE_SYSTEM_ACTIVE | PORT_3001
              </div>
              <p>
                  Estás en el <strong>Cerebro de Datos</strong>. Este servidor gestiona la lógica de productos, carritos y autenticación mediante GraphQL. No contiene interfaces gráficas de usuario.
              </p>
              <div class="links">
                  <a href="http://localhost:3000">Ir a la Tienda (Puerto 3000)</a>
                  <a href="/graphql">GraphQL Playground</a>
              </div>
              <div class="warning">
                  ACCESO RESTRINGIDO | PROTOCOLO INDUSTRIAL OSART 2026
              </div>
          </div>
      </body>
      </html>
    `;
  }

  @Get('admin')
  getAdminRedirect(): string {
    return this.getHello();
  }
}
