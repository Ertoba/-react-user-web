import * as Yup from 'yup';

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
