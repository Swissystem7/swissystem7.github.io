// בדיקת קישורים לדף הפורטפוליו. אין תלויות, אין CI — מריצים ידנית:
//
//   node --test                      בדיקות מבנה בלבד (לא נוגע ברשת, רץ גם אופליין)
//   CHECK_LINKS_NETWORK=1 node --test  בנוסף: כל קישור חיצוני חייב להחזיר סטטוס < 400
//
// הבדיקה הרשתית היא בכוונה לא ברירת־מחדל: בלי רשת היא הייתה מאדימה מסיבה
// שאינה קשורה לקוד. אין כאן GitHub Action — ההרצה היא של הבעלים בלבד.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = readFileSync(join(ROOT, 'index.html'), 'utf8');
const README = readFileSync(join(ROOT, 'PROFILE_README.md'), 'utf8');

const SITE = 'https://swissystem7.github.io/';
const OWNER = 'Swissystem7';
const SELF_REPO = 'swissystem7.github.io';
const NETWORK = process.env.CHECK_LINKS_NETWORK === '1';

/** כל ערכי href בדף, לפי סדר הופעתם. */
function hrefs(html) {
  return [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
}

/** כל ה־id בדף — היעדים האפשריים לעוגן פנימי. */
function ids(html) {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}

/** כרטיסי הפרויקטים, כל אחד עם השם שבכותרת וכל הקישורים שבתוכו. */
function cards(html) {
  return html
    .split('<article class="card">')
    .slice(1)
    .map((chunk) => {
      const body = chunk.split('</article>')[0];
      const title = (body.match(/<h3>([^<]+)</) || [, ''])[1].trim();
      return { title, links: hrefs(body) };
    });
}

/** קישורים חיצוניים ייחודיים מהדף ומ־PROFILE_README, בסדר יציב. */
function externalLinks() {
  const fromHtml = hrefs(HTML).filter((h) => /^https?:/i.test(h));
  const fromMd = [...README.matchAll(/\]\((https?:[^)\s]+)\)/g)].map((m) => m[1]);
  return [...new Set([...fromHtml, ...fromMd])];
}

test('כל עוגן פנימי (#) מצביע ל־id שקיים בדף', () => {
  const targets = ids(HTML);
  const anchors = hrefs(HTML).filter((h) => h.startsWith('#'));
  assert.ok(anchors.length > 0, 'לא נמצא אף עוגן פנימי — כנראה הפרסור נשבר');
  for (const a of anchors) {
    assert.ok(targets.has(a.slice(1)), 'עוגן שבור: ' + a);
  }
});

test('כל קישור יחסי מצביע לקובץ שקיים בריפו', () => {
  const local = hrefs(HTML).filter(
    (h) => h && !/^(https?:|mailto:|#)/i.test(h)
  );
  assert.ok(local.length > 0, 'לא נמצא אף קישור יחסי — כנראה הפרסור נשבר');
  for (const rel of local) {
    const path = join(ROOT, rel.replace(/^\.\//, '').split(/[?#]/)[0]);
    assert.ok(existsSync(path), 'קובץ חסר: ' + rel);
  }
});

test('אין http לא מוצפן ואין href ריק', () => {
  for (const h of hrefs(HTML)) {
    assert.notEqual(h.trim(), '', 'href ריק בדף');
    assert.ok(!/^http:\/\//i.test(h), 'קישור לא מוצפן: ' + h);
  }
});

test('כתובת הדוא״ל תקינה', () => {
  const mails = hrefs(HTML).filter((h) => h.startsWith('mailto:'));
  assert.equal(mails.length, 1);
  assert.match(mails[0], /^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
});

test('canonical ו־og:url מצביעים לשורש האתר', () => {
  const canonical = HTML.match(/<link rel="canonical" href="([^"]+)"/);
  const og = HTML.match(/property="og:url" content="([^"]+)"/);
  assert.ok(canonical, 'אין canonical');
  assert.ok(og, 'אין og:url');
  assert.equal(canonical[1], SITE);
  assert.equal(og[1], SITE);
});

test('בכל כרטיס: דמו וקוד עם אותו שם ריפו, ושם הריפו הוא שם הכרטיס', () => {
  const list = cards(HTML);
  assert.equal(list.length, 7, 'מספר הכרטיסים בדף השתנה');
  for (const card of list) {
    const demo = card.links.filter((h) => h.startsWith(SITE));
    const code = card.links.filter((h) =>
      h.startsWith('https://github.com/' + OWNER + '/')
    );
    assert.equal(demo.length, 1, 'כרטיס ' + card.title + ': אין בדיוק קישור דמו אחד');
    assert.equal(code.length, 1, 'כרטיס ' + card.title + ': אין בדיוק קישור קוד אחד');
    const demoSlug = demo[0].slice(SITE.length).replace(/\/$/, '');
    const codeSlug = code[0].split('/').pop();
    assert.equal(demoSlug, codeSlug, 'כרטיס ' + card.title + ': הדמו והקוד מצביעים לריפואים שונים');
    assert.equal(demoSlug, card.title, 'כרטיס ' + card.title + ': הקישורים לא תואמים לכותרת');
  }
});

test('כל קישור ריפו שייך ל־Swissystem7 ולריפו שמוכר לדף', () => {
  const known = new Set([...cards(HTML).map((c) => c.title), SELF_REPO]);
  for (const url of externalLinks()) {
    const u = new URL(url);
    assert.ok(
      u.hostname === 'github.com' || u.hostname === 'swissystem7.github.io',
      'מארח לא צפוי: ' + url
    );
    const parts = u.pathname.split('/').filter(Boolean);
    if (u.hostname === 'github.com') {
      assert.equal(parts[0], OWNER, 'קישור GitHub לבעלים אחר: ' + url);
      if (parts.length > 1) {
        assert.ok(known.has(parts[1]), 'ריפו לא מוכר לדף: ' + url);
      }
    } else if (parts.length > 0) {
      assert.ok(known.has(parts[0]), 'תת־אתר לא מוכר לדף: ' + url);
    }
  }
});

test('קיים תאריך בדיקה בכותרת התחתונה, בפורמט תקין', () => {
  const m = HTML.match(/נבדק לאחרונה:\s*<time datetime="(\d{4}-\d{2}-\d{2})">([^<]+)<\/time>/);
  assert.ok(m, 'אין שורת «נבדק לאחרונה» עם <time datetime> בכותרת התחתונה');
  const iso = m[1];
  assert.equal(new Date(iso + 'T00:00:00Z').toISOString().slice(0, 10), iso, 'תאריך לא חוקי: ' + iso);
  const [y, mo, d] = iso.split('-').map(Number);
  assert.equal(m[2].trim(), d + '.' + mo + '.' + y, 'התאריך המוצג לא תואם ל־datetime');
});

test(
  'כל קישור חיצוני מחזיר סטטוס < 400',
  { skip: NETWORK ? false : 'בדיקת רשת כבויה — הריצו עם CHECK_LINKS_NETWORK=1' },
  async () => {
    const failures = [];
    for (const url of externalLinks()) {
      try {
        const res = await fetch(url, {
          redirect: 'follow',
          signal: AbortSignal.timeout(20000),
          headers: { 'user-agent': 'portfolio-link-check' },
        });
        if (res.status >= 400) failures.push(res.status + ' ' + url);
      } catch (err) {
        failures.push('ERR ' + url + ' — ' + err.message);
      }
    }
    assert.deepEqual(failures, [], 'קישורים שבורים:\n' + failures.join('\n'));
  }
);
