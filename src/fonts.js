// Self-hosted fonts, only the weights the app uses. Each weight comes in
// character sets, and a browser downloads a set only when text on screen
// needs it:
// - latin: English text. Precached by the service worker (vite.config.js),
//   so it's there offline.
// - latin-ext: the naira sign (₦) and letters such as ṣ and ń.
// - vietnamese: dotted letters in Yoruba and Igbo names (Ọ, ẹ, ị). Sora has
//   no such letters, so they show in Montserrat or the system font there.
// The last two are fetched on first use and then cached for offline use.

import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-ext-400.css";
import "@fontsource/inter/latin-ext-500.css";
import "@fontsource/inter/latin-ext-600.css";
import "@fontsource/inter/latin-ext-700.css";
import "@fontsource/inter/vietnamese-400.css";
import "@fontsource/inter/vietnamese-500.css";
import "@fontsource/inter/vietnamese-600.css";
import "@fontsource/inter/vietnamese-700.css";

import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-400-italic.css";
import "@fontsource/montserrat/latin-500-italic.css";
import "@fontsource/montserrat/latin-ext-400.css";
import "@fontsource/montserrat/latin-ext-500.css";
import "@fontsource/montserrat/latin-ext-600.css";
import "@fontsource/montserrat/latin-ext-700.css";
import "@fontsource/montserrat/latin-ext-400-italic.css";
import "@fontsource/montserrat/latin-ext-500-italic.css";
import "@fontsource/montserrat/vietnamese-400.css";
import "@fontsource/montserrat/vietnamese-500.css";
import "@fontsource/montserrat/vietnamese-600.css";
import "@fontsource/montserrat/vietnamese-700.css";
import "@fontsource/montserrat/vietnamese-400-italic.css";
import "@fontsource/montserrat/vietnamese-500-italic.css";

import "@fontsource/sora/latin-400.css";
import "@fontsource/sora/latin-500.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/sora/latin-800.css";
import "@fontsource/sora/latin-ext-400.css";
import "@fontsource/sora/latin-ext-500.css";
import "@fontsource/sora/latin-ext-600.css";
import "@fontsource/sora/latin-ext-700.css";
import "@fontsource/sora/latin-ext-800.css";
