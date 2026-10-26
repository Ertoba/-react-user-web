import assert from 'node:assert/strict';
import test from 'node:test';
import { recoveryValidation, normalizeOtpPhone, recoveryOtpRequestSucceeded } from '../src/utils/recoveryValidation.mjs';
const schema = method => recoveryValidation({ method, country: 'ge', t: value => value });

test('OTP input removes a repeated Georgian dial code while keeping incomplete numbers invalid', async () => {
  assert.equal(normalizeOtpPhone('995995555123456'), '+995555123456');
  assert.equal(normalizeOtpPhone('+995 555 123 456'), '+995555123456');
  assert.equal(normalizeOtpPhone('+12025550123'), '+12025550123');
  await schema('phone').validate({ phone: normalizeOtpPhone('995995555123456') });
  await assert.rejects(schema('phone').validate({ phone: normalizeOtpPhone('99599555512345') }));
});

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

test('OTP recovery advances only after a successful provider response', () => {
  assert.equal(recoveryOtpRequestSucceeded({ message: 'OTP sent' }), true);
  assert.equal(recoveryOtpRequestSucceeded({ errors: [], message: 'OTP sent' }), true);
  for (const rejected of [
    undefined, null, false, '',
    { errors: [{ code: 'invalid_number', message: 'Rejected' }] },
    { errors: 'provider_error' },
    { errors: { phone: ['rejected'] } },
    { success: false }, { status: false },
  ]) {
    assert.equal(recoveryOtpRequestSucceeded(rejected), false);
  }
});
