# Ghost TV — Windows Web App

A personal media hub for Windows browsers. Publish these files to GitHub Pages and open the site in Microsoft Edge or Chrome. You can also install it as a browser app from Edge's **Apps → Install this site as an app** menu.

## Included
- Home dashboard and counts
- Live TV playlist importer for local `.m3u` / `.m3u8` files
- Channel search and group filtering
- HLS playback support through hls.js, with native browser playback fallback
- Streaming modes: Auto, Data saver (up to 480p), Balanced (up to 720p), High quality (up to 1080p)
- Adaptive HLS bitrate selection and short playback buffers; service worker does not cache stream segments
- Personal Movies and Series libraries
- Persistent local video storage in IndexedDB (subject to browser/device storage limits)
- Poster URLs, descriptions, favourites and library search
- JSON backup of playlist and library metadata
- Basic PWA shell and offline caching for the app interface

## Publish with GitHub Pages
1. Extract this ZIP.
2. Create or open your GitHub repository.
3. Upload **the contents** of this folder to the repository root (so `index.html` is at the root).
4. Open **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
6. Open the Pages URL GitHub provides.

## Use
- Go to **Sources & Settings** and import an M3U playlist file from a provider you are authorised to use.
- Or enter a playlist URL. Some providers block browser requests with CORS; if so, download the playlist file from the provider and import it locally.
- Add personal video files under Movies or Series. They are stored in this browser on this device.
- Edge can install the published site as an app window.

## Important limits
- Ghost TV does **not** include TV channels, movies, subscription credentials, or copyrighted streams.
- Use only streams and media you are legally authorised to access. It cannot bypass subscriptions, DRM, or provider restrictions.
- Browser playback depends on the stream format and codec. Data saver and resolution caps work only when the provider supplies multiple HLS quality renditions; a single-bitrate stream cannot be transcoded by this browser app. Not every IPTV stream will play in every browser.
- HLS.js is loaded from a CDN for HLS playback; the first HLS playback needs internet access.
- A playlist URL can fail because of CORS. This app does not proxy or circumvent provider restrictions.
- Local videos are stored in IndexedDB; browser storage quotas vary. Clearing site data removes these files. The JSON backup exports metadata and playlist URLs, not the video file contents.
- The app shell can be cached after first visit, but streaming requires a working connection.
- The programme guide (EPG/XMLTV) is not yet implemented in this version.

## Project files
- `index.html` — app layout
- `styles.css` — responsive design
- `app.js` — app logic, playlist parser, IndexedDB media library
- `manifest.webmanifest`, `sw.js`, `icon.svg` — installable web app support


## Free starter content
This build starts with a curated set of real free-to-watch destinations:
- Official broadcaster/player pages for DW, France 24, Al Jazeera English, Sky News, Bloomberg, NHK World, NASA+ and eNCA.
- Plex Free Live TV (its catalogue is regional and may vary).
- Real classic film and television titles linked to free public-domain/classic-TV catalogues (Archive Watch, Starlite TV and PastTimeTV).

These are source links, not copied or re-hosted streams. Some providers may restrict playback by country, and some catalogue pages may require selecting a title or episode. The starter catalogue is not a promise that every item is playable in every country.


## Zambia local channels
The Live TV list also includes Zambia-based broadcasters and public-service channels:
Diamond TV, ZNBC TV 1 and 2, Parliament TV Zambia, ZANIS TV, Prime TV Zambia, Muvi TV, KBN TV and Power TV.
The cards open broadcaster/regulator websites rather than pretending that an unverified direct stream exists.
The IBA directory identifies licensed Zambian broadcasters; Prime TV's current web page says its live broadcast is coming soon.


## Built-in live player update
The Live TV player now plays supported HLS streams inside the app using hls.js, and can display an official YouTube live embed in the same player area.
Built-in direct/embedded entries:
- DW English — HLS
- Al Jazeera English — HLS
- CGTN English — HLS
- NBC News NOW — HLS distribution
- ZNBC TV 1 — official ZNBC YouTube live channel embed (only displays a live broadcast when ZNBC is actually live)

Other broadcasters without a confirmed embeddable feed remain labelled as official website links, rather than being presented as working in-app channels. Stream availability, geographic access, and broadcaster embed permissions can change.


## Kids channels
Cartoon Network and Cartoonito are listed in the Kids category as subscription channels.
DStv Zambia lists Cartoon Network as channel 301. These cards link to the official DStv Zambia channel directory; they are not represented as free or directly playable live streams.


## Kids & cartoon channels update
- CV Kids Zone (Zambia): official 24/7 free channel, CH 103. Ghost TV opens its official live player in the in-app frame; if the broadcaster blocks embedding, open the channel's website from its card.
- Pluto TV Kids (US): official free ad-supported kids lineup; region restrictions may apply in Zambia.
- Plex Kids & Family: official free live-TV destination; channel lineup varies by region.
- Cartoon Network remains listed as a subscription channel; no authorised free live feed was found.

Website-only providers open their own official player pages. Ghost TV does not bypass regional restrictions or paid subscriptions.
