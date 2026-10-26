import assert from 'node:assert/strict';
import test from 'node:test';
import { recoveryValidation, normalizeOtpPhone, recoveryOtpRequestSucceeded, availableRecoveryMethods, selectRecoveryMethod } from '../src/utils/recoveryValidation.mjs';
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

test('Georgian country-picker recovery input normalizes repeated prefixes idempotently', async () => {
  const raw = '995995555123456';
  const e164 = normalizeOtpPhone(raw);
  assert.equal(e164, '+995555123456');
  assert.equal(normalizeOtpPhone(e164), e164, 'normalization must be stable');
  assert.equal(normalizeOtpPhone('995'), '+995', 'incomplete dial code stays invalid');
  assert.equal(normalizeOtpPhone(''), '', 'empty widget state stays empty');
  await schema('phone').validate({ phone: e164 });
  await assert.rejects(schema('phone').validate({ phone: normalizeOtpPhone('995') }));
});

test('recovery choices expose both enabled channels while preserving selected method', () => {
  const base = { centralize_login: { otp_login_status: 1 } };
  const channels = availableRecoveryMethods({ ...base, is_sms_active: 1, is_mail_active: '1' });
  assert.deepEqual(channels, ['phone','email']);
  assert.equal(selectRecoveryMethod(channels, 'email'), 'email');
  assert.equal(selectRecoveryMethod(channels, 'bogus'), 'phone');
  assert.equal(selectRecoveryMethod(['email'], 'phone'), 'email');
  assert.deepEqual(availableRecoveryMethods({ ...base, is_sms_active: '0', is_mail_active: false }), []);
  assert.deepEqual(availableRecoveryMethods({ is_sms_active: 1, is_mail_active: 1 }), []);
  assert.deepEqual(availableRecoveryMethods({ ...base, is_sms_active: false, is_mail_active: 1 }), ['email']);
});
