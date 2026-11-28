import { useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as adhan from 'adhan';
import { adhkarOf, anyAlert, planAll, plannedHere, planKey } from '@shared/adhanAlerts';
import { prayerDay, type Adhan } from '@shared/prayer';
import { adhanAlerts, adhkarAlerts, prayerPlace, prayerSettings } from './settings';
import { openAdhkar } from './adhkar';
import { reportError } from '@shared/errors';

const lib = adhan as unknown as Adhan;
/** Android groups notifications by channel; this one rings with the phone's own notification sound. */
const CHANNEL = 'adhan';
/** The adhkar reminders ring on their own channel, so the phone's settings can quiet one without the other. */
const ADHKAR_CHANNEL = 'adhkar';
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
  } catch (error) {
    reportError('adhan: ask permission', error);
    return false;
  }
}

/** Are notifications allowed now, without asking? */
export async function alertsAllowed(): Promise<boolean> {
  try { return (await Notifications.getPermissionsAsync()).granted; } catch { return false; }
}

export const openPhoneSettings = () => { Linking.openSettings().catch(error => reportError('adhan: open settings', error)); };

let lastKey = '';
let running: Promise<void> = Promise.resolve();

/**
 * Bring the phone's waiting notifications in line with the switches, the place and the method.
 * The adhan alerts and the adhkar reminders share one budget (shared/adhanAlerts planAll), so they are planned together.
 * Cheap to call often: it does nothing unless something, or the day, changed.
 */
export function syncAlerts(force = false): Promise<void> {
  running = running.then(async () => {
    const alerts = adhanAlerts.get();
    const adhkar = adhkarAlerts.get();
    const place = prayerPlace.get();
    const settings = prayerSettings.get();
    const now = new Date();
    const key = planKey(alerts, adhkar, place, settings, now);
    if (!force && key === lastKey) return;
    try {
      const waiting = await Notifications.getAllScheduledNotificationsAsync();
      await Promise.all(waiting.filter(item => plannedHere(item.content.data)).map(item => Notifications.cancelScheduledNotificationAsync(item.identifier)));
      lastKey = key;
      if (!place || (!anyAlert(alerts) && !adhkar.morning && !adhkar.evening)) return;
      // Blocked now, maybe allowed in the phone's settings later today: check again next time.
      if (!(await Notifications.getPermissionsAsync()).granted) { lastKey = ''; return; }
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL, {
          name: 'الأذان', importance: Notifications.AndroidImportance.HIGH, sound: 'default', vibrationPattern: [0, 250, 250, 250],
        });
        await Notifications.setNotificationChannelAsync(ADHKAR_CHANNEL, {
          name: 'الأذكار', importance: Notifications.AndroidImportance.DEFAULT, sound: 'default',
        });
      }
      const plan = planAll(alerts, adhkar, place, now, day => prayerDay(lib, place, day, settings));
      for (const alert of plan.prayers) {
        await Notifications.scheduleNotificationAsync({
          content: { title: alert.title, body: alert.body, sound: 'default', data: { prayer: alert.prayer } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: alert.at, channelId: CHANNEL },
        });
      }
      for (const alert of plan.adhkar) {
        await Notifications.scheduleNotificationAsync({
          content: { title: alert.title, body: alert.body, sound: 'default', data: { adhkar: alert.adhkar } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: alert.at, channelId: ADHKAR_CHANNEL },
        });
      }
    } catch (error) {
      reportError('adhan: schedule alerts', error);
      lastKey = '';
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
  adhkarAlerts.subscribe(again);
  prayerPlace.subscribe(again);
  prayerSettings.subscribe(again);
  AppState.addEventListener('change', state => { if (state === 'active') syncAlerts(); });
  // A tap on an adhkar reminder opens that time's adhkar.
  const opened = (response: Notifications.NotificationResponse | null) => {
    const time = adhkarOf(response?.notification.request.content.data);
    if (!time) return;
    // Cleared once handled, or the next launch would open it again.
    Notifications.clearLastNotificationResponseAsync().catch(error => reportError('adhan: clear opened alert', error));
    openAdhkar(time);
  };
  Notifications.addNotificationResponseReceivedListener(opened);
  Notifications.getLastNotificationResponseAsync().then(opened).catch(error => reportError('adhan: read opened alert', error));
}

/** Counts each return to the app, so a screen can check the permission again after the phone's settings. */
export function useForeground() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state === 'active') setCount(n => n + 1); });
    return () => listener.remove();
  }, []);
  return count;
}
