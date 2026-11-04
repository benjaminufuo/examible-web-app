// Applies the Google Fonts stylesheet that index.html preloads, without
// waiting for the app's main bundle. A separate file because the Content
// Security Policy blocks inline scripts and handlers. Removed in F8 (fonts
// self-hosted).
var fonts = document.getElementById("google-fonts");
if (fonts) fonts.rel = "stylesheet";
