import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function cartQuery(storeId) {
  const requests = [];
  const exports = {};
  const source = fs.readFileSync(new URL('../src/api-manage/hooks/react-query/add-cart/useGetAllCartList.js', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const require = name => {
    if (name.includes('MainApi')) return { get: async url => { requests.push(url); return { data: { content: { data: [{ id: 42 }] } } }; } };
    if (name === 'react-query') return { useQuery: (key, query, options) => ({ query, options }) };
    if (name.includes('ApiRoutes')) return { all_cart_list: '/api/v1/customer/cart/list' };
    if (name.includes('getToken')) return { getToken: () => null, getGuestId: () => '220' };
    if (name.includes('getApiContent')) return { getApiList: response => response.content.data };
    if (name.includes('ErrorResponses')) return { onSingleErrorResponse: () => {} };
    throw new Error(`Unexpected dependency: ${name}`);
  };
  vm.runInNewContext(code, { exports, require, URLSearchParams });
  return { ...exports.default('220', undefined, storeId), requests };
}

test('explicit refetch without a store makes no API request', async () => {
  const query = cartQuery(undefined);
  assert.equal(query.options.enabled, false);
  assert.equal((await query.query()).length, 0);
  assert.equal(query.requests.length, 0);
});

test('store cart remains scoped to the visited store and guest', async () => {
  const query = cartQuery(7);
  assert.equal(query.options.enabled, true);
  assert.equal((await query.query())[0].id, 42);
  assert.deepEqual(query.requests, ['/api/v1/customer/cart/list?guest_id=220&store_id=7']);
});
