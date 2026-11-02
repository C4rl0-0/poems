Mga Liham, by Carlo

REQUIRES NODE.JS 20 OR NEWER
This version includes a server. Static-only hosting and uploading index.html alone will not enable owner login.

DEPLOY
1. Extract the ZIP and upload the project to a Node.js host.
2. Set OWNER_PASSWORD to your own long, unique password in the host's private environment settings. Do not place the password in index.html.
3. Set DATA_DIR to a persistent storage directory on your host. Poems are stored there in poems.json. Back up this directory.
4. Run: node server.cjs
5. Enable HTTPS. Secure cookies are enabled by default.
6. Open Owner login, enter your password, then use Write a poem.

LOCAL PREVIEW
Set OWNER_PASSWORD in your environment. Set COOKIE_SECURE=false only for local HTTP testing. Run node server.cjs and open http://localhost:3000.

Visitors read and search poems and save personal favorites. Only authenticated owner sessions can create, update, delete, or import poems. Published poems are shared across visitors. Sessions expire after eight hours and reset when the server restarts.

Existing browser-only poems are not uploaded automatically. Export them from the previous site, then import the backup after signing in as owner.

The hosted ChatGPT preview shows the visitor layout. Full owner login runs from this ZIP on a Node.js host.

OWNER TEXT EDITING
Sign in and choose Edit website text. Save to apply changes for all visitors. The collection starts empty. Write a poem automatically adds a formatted card. Text settings are saved in DATA_DIR/copy.json. Back up this file alongside poems.json.
