import fs from 'fs';
import path from 'path';
import listEndpoints from 'express-list-endpoints';
import {app} from '../index.js';

const endpoints = listEndpoints(app);

const collection = {
  info: {
    name: 'Chowly API',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: endpoints.flatMap((endpoint) =>
    endpoint.methods.map((method) => ({
      name: `${method} ${endpoint.path}`,
      request: {
        method,
        header: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
        url: {
          raw: `{{baseUrl}}${endpoint.path}`,
          host: ['{{baseUrl}}'],
          path: endpoint.path.split('/').filter(Boolean),
        },
        // stub body for methods that typically need one
        ...(method === 'POST' || method === 'PUT' || method === 'PATCH'
          ? {
              body: {
                mode: 'raw',
                raw: JSON.stringify({}, null, 2),
                options: { raw: { language: 'json' } },
              },
            }
          : {}),
      },
    }))
  ),
  variable: [
    {
      key: 'baseUrl',
      value: 'http://localhost:3000',
    },
  ],
};

const outputPath = path.join(__dirname, '../postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log(`✅ Postman collection generated at ${outputPath}`);
console.log(`Found ${endpoints.length} routes.`);