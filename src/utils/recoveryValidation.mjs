import * as Yup from 'yup';

export function normalizeOtpPhone(value) {
  let digits = String(value ?? '').replace(/\D/g, '');
  // The controlled country picker can prepend Georgia's dial code again.
  if (digits.startsWith('995995')) digits = digits.slice(3);
  return digits ? `+${digits}` : '';
}

export function isRecoveryPhone(value, country) {
  const phone = String(value ?? '').trim();
  if (String(country).toLowerCase() === 'ge') return /^\+?995\d{9}$/.test(phone);
  return /^\+?[1-9]\d{7,14}$/.test(phone);
}

export function recoveryValidation({ method, country, t }) {
  return Yup.object({
    phone: method === 'phone'
      ? Yup.string().required(t('Please provide a phone number')).test('phone', t('Enter a valid phone number.'), value => isRecoveryPhone(value, country))
      : Yup.string().notRequired(),
    email: method === 'email'
      ? Yup.string().required(t('Please provide an email address')).email(t('Please enter a valid email address'))
      : Yup.string().notRequired(),
  });
}

/** Never advance to OTP entry when the provider rejected the OTP request. */
export function recoveryOtpRequestSucceeded(response) {
  if (!response || typeof response !== 'object') return false;
  if (response.success === false || response.status === false) return false;
  if (response.errors != null) {
    return Array.isArray(response.errors) && response.errors.length === 0;
  }
  return true;
}

/** Enables only actual configured recovery channels; string "0" is disabled. */
export function availableRecoveryMethods(config) {
  if (!config?.centralize_login) return [];
  const enabled = value => value === true || value === 1 || value === '1';
  return [
    ...(enabled(config.is_sms_active) ? ['phone'] : []),
    ...(enabled(config.is_mail_active) ? ['email'] : []),
  ];
}

export function selectRecoveryMethod(methods, preferred) {
  return methods.includes(preferred) ? preferred : (methods[0] ?? '');
}
