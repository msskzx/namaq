import { AppState, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as adhan from 'adhan';
import { anyAlert, planAlerts, planKey } from '@shared/adhanAlerts';
import { prayerDay, type Adhan } from '@shared/prayer';
import { adhanAlerts, prayerPlace, prayerSettings } from './settings';

const lib = adhan as unknown as Adhan;
/** Android groups notifications by channel; this one rings with the phone's own notification sound. */
const CHANNEL = 'adhan';
export const ALERTS_SUPPORTED = true;

// Show the alert even while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

/** Ask for notifications, the first time a prayer is switched on. false when refused. */
export async function allowAlerts(): Promise<boolean> {
  try {
    const now = await Notifications.getPermissionsAsync();
    if (now.granted) return true;
    if (!now.canAskAgain) return false;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/** Are notifications allowed now, without asking? */
export async function alertsAllowed(): Promise<boolean> {
  try { return (await Notifications.getPermissionsAsync()).granted; } catch { return false; }
}

export const openPhoneSettings = () => { Linking.openSettings().catch(() => {}); };

let lastKey = '';
let running: Promise<void> = Promise.resolve();

/**
 * Bring the phone's waiting notifications in line with the switches, the place and the method.
 * Cheap to call often: it does nothing unless something, or the day, changed.
 */
export function syncAlerts(force = false): Promise<void> {
  running = running.then(async () => {
    const alerts = adhanAlerts.get();
    const place = prayerPlace.get();
    const settings = prayerSettings.get();
    const now = new Date();
    const key = planKey(alerts, place, settings, now);
    if (!force && key === lastKey) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      lastKey = key;
      if (!place || !anyAlert(alerts)) return;
      if (!(await Notifications.getPermissionsAsync()).granted) return;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL, {
          name: 'الأذان', importance: Notifications.AndroidImportance.HIGH, sound: 'default', vibrationPattern: [0, 250, 250, 250],
        });
      }
      const plan = planAlerts(alerts, place, now, day => prayerDay(lib, place, day, settings));
      for (const alert of plan) {
        await Notifications.scheduleNotificationAsync({
          content: { title: alert.title, body: alert.body, sound: 'default', data: { prayer: alert.prayer } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: alert.at, channelId: CHANNEL },
        });
      }
    } catch {
      lastKey = ''; // try again next time the app opens
    }
  });
  return running;
}

let started = false;
/** Keep the alerts in step: on launch, whenever a switch, the place or the method changes, and each time the app comes back. */
export function startAlerts() {
  if (started) return;
  started = true;
  syncAlerts();
  const again = () => { syncAlerts(); };
  adhanAlerts.subscribe(again);
  prayerPlace.subscribe(again);
  prayerSettings.subscribe(again);
  AppState.addEventListener('change', state => { if (state === 'active') syncAlerts(); });
}
