import assert from 'node:assert/strict';
import test from 'node:test';
import { recoveryValidation } from '../src/utils/recoveryValidation.mjs';
const schema = method => recoveryValidation({ method, country: 'ge', t: value => value });

test('phone recovery rejects missing and malformed numbers and accepts Georgian numbers with the dial code', async () => {
  for (const phone of ['', '+995', '+995123', '+99559510033', '+9955551234567', 'not-a-phone']) {
    await assert.rejects(schema('phone').validate({ phone, email: '' }));
  }
  await schema('phone').validate({ phone: '+995555123456', email: '' });
});
test('email recovery validates the selected method independently of a stale discriminator', async () => {
  await assert.rejects(schema('email').validate({ phone: '+995555123456', email: '', verification_method: 'phone' }));
  await assert.rejects(schema('email').validate({ email: 'invalid' }));
  await schema('email').validate({ email: 'qa@example.test', phone: '' });
});
