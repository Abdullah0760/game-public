/* الحفظ في الجوال: يحفظ كل الألعاب عند أول فتح، فتعمل بلا إنترنت. ويجلب الجديد بهدوء متى وُجد الإنترنت.
   مكتوب آلياً من tools/public_copy.py في مستودع game — لا يُعدَّل باليد. */
var CACHE = "games-7f70d0860837";
var FILES = ["./"].concat(["./bubbles.html", "./dodge.html", "./flags.html", "./games.json", "./guess.html", "./icon-180.png", "./icon-512.png", "./index.html", "./kalima.html", "./ludo.html", "./manifest.json", "./math.html", "./maze.html", "./memory.html", "./quiz.html", "./rps.html", "./simon.html", "./snake.html", "./tap.html", "./typing.html", "./words.html", "./xo.html"]);
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("games-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || u.pathname.indexOf(new URL("./", location).pathname) !== 0) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(r, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(r).then(function (res) { if (res && res.ok) c.put(r, res.clone()); return res; });
      if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
      return net.catch(function () { return r.mode === "navigate" ? c.match("./index.html") : Response.error(); });
    });
  }));
});
