import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { fetchToken } from '../../firebase';
import { useStoreFcm } from '../../api-manage/hooks/react-query/push-notifications/usePushNotification';

export default function NotificationOptIn() {
  const { t } = useTranslation();
  const [permission, setPermission] = useState(null);
  const [pending, setPending] = useState(false);
  const { mutateAsync: storeToken } = useStoreFcm();
  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission);
  }, []);
  if (permission !== 'default') return null;

  const enable = async () => {
    setPending(true);
    try {
      // Permission must originate from a deliberate user action.
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        const token = await fetchToken(() => {}, () => {});
        if (token && localStorage.getItem('token')) await storeToken(token);
      }
    } catch {
      toast.error(t('Unable to enable notifications. Please try again.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Button onClick={enable} disabled={pending} startIcon={<NotificationsActiveOutlinedIcon />}
      sx={{ mt: 2, minHeight: 44, alignSelf: 'flex-start', textAlign: 'start', whiteSpace: 'normal' }}>
      {t('Enable order notifications')}
    </Button>
  );
}
