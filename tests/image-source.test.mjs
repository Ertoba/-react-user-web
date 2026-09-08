import assert from 'node:assert/strict';
import test from 'node:test';
import { imageSource } from '../src/utils/imageSource.mjs';

test('loading API image values use a local fallback without requesting invalid paths', () => {
  for (const source of [null, undefined, '', '  ', 'null/undefined', '/undefined', 'https://example.test/storage/null']) {
    assert.equal(imageSource(source, '/placeholder.png'), '/placeholder.png');
  }
});
test('valid remote, relative and imported images preserve their sources', () => {
  for (const source of ['https://example.test/image.png', '/images/logo.svg', 'data:image/png;base64,AA==', '/images/undefined.png']) {
    assert.equal(imageSource(source), source);
  }
  assert.equal(imageSource({ src: '/_next/static/logo.svg' }), '/_next/static/logo.svg');
});
