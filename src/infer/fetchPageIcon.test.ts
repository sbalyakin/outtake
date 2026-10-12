import http from 'http';
import { AddressInfo } from 'net';

import { fetchPageIcon } from './fetchPageIcon';

// 1x1 PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('fetchPageIcon', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      if (req.url?.endsWith('.png')) {
        res.setHeader('content-type', 'image/png');
        res.end(PNG);
      } else {
        res.setHeader('content-type', 'text/html');
        res.end('<html></html>');
      }
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}/`;
  });

  afterAll(() => {
    server.close();
  });

  // Fails if page-icon and the installed file-type drift apart (the child-process shim in fetchPageIcon.ts).
  test('downloads and detects a PNG icon through page-icon', async () => {
    const icon = await fetchPageIcon(baseUrl, '.png', 10000);
    expect(icon?.ext).toBe('.png');
    expect(icon?.data.equals(PNG)).toBe(true);
  });
});
