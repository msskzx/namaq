# Prayer times and qibla: data check (2026-11-13)

Library: adhan (adhan-js) 4.4.6, computed offline.

## Against the Egyptian General Authority for Survey (official Egypt times, as printed by Sada El Balad / Egypt Telegraph)

| Date | City | Official F/S/D/A/M/I | adhan (Egyptian, Dhuhr +0) |
|---|---|---|---|
| 2025-11-22 | Cairo | 4:55 6:26 11:41 2:36 4:56 6:17 | 4:55 6:26 11:41 2:36 4:56 6:17 |
| 2026-01-11 | Cairo | 5:20 6:52 12:03 2:55 5:14 6:36 | 5:20 6:52 12:03 2:55 5:14 6:36 |
| 2026-01-11 | Alexandria | 5:27 7:00 12:08 2:57 5:17 6:40 | 5:27 7:00 12:08 2:58 5:17 6:40 |
| 2026-01-24 | Cairo | 5:19 6:49 12:07 3:05 5:25 6:45 | 5:19 6:49 12:07 3:05 5:25 6:46 |
| 2026-01-24 | Alexandria | 5:25 6:57 12:12 3:08 5:28 6:50 | 5:26 6:57 12:12 3:08 5:28 6:50 |
| 2026-01-24 | Aswan | 5:07 6:32 12:00 3:07 5:29 6:45 | 5:07 6:32 12:00 3:07 5:29 6:45 |

Result: within 1 minute everywhere (seconds of rounding and city coordinates).
Finding: adhan's Egyptian preset adds +1 min to Dhuhr; the official tables don't. With it, Dhuhr was 1 minute late every day. **We set the Dhuhr adjustment to 0 for the Egyptian method.**

## Against Aladhan (independent implementation), 9 cities x 5 months of 2026 (every day)
Cairo, Alexandria, Aswan (Egyptian), Berlin, London (MWL), Makkah (Umm al-Qura), Jakarta (Singapore), New York (ISNA), Karachi (Karachi, Hanafi Asr).
- All prayers within 1-3 minutes on every day, once the same high-latitude rule is used.
- Asr differs up to 3 min in Berlin/London winter (Asr changes slowly there). An independent NOAA solar check for Berlin 2026-01-17 gives 14:05:40; adhan 14:07, Aladhan 14:04. Within normal spread.
- **High latitudes (Berlin, London in summer):** adhan's default rule ("middle of the night") gives Fajr and Isha both at ~01:07 in June, which is wrong in practice. **We use adhan's recommended rule (one seventh of the night above 48°)**: Berlin 16 June Fajr 03:41, Isha 22:33, identical to Aladhan with the same rule. Real practice in Germany/UK varies by mosque; the user can change the method.
- **Umm al-Qura in Ramadan:** Isha is 120 min after Maghrib instead of 90 (Aladhan does this; adhan doesn't). **We add the 30 minutes in Ramadan.**

## Qibla
adhan's bearing equals a great-circle bearing computed separately: Cairo 136.14°, Berlin 136.68°, London 118.99°, Jakarta 295.15°, New York 58.48°.

## Hijri date
From the phone's Intl Umm al-Qura calendar (same as the home widget, shared/hijri.ts). Egypt's Dar al-Ifta starts months by sighting, so it can differ by a day from Umm al-Qura.
