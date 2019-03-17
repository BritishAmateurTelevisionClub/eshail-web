//WebSDR HTML5 client side - Copyright 2013-2014, pa3fwm@websdr.org - all rights reserved
//Since the intended use of this code involves sending a copy to the client computer, I (PA3FWM) hereby allow making it available unmodified, via my original WebSDR server software, to original WebSDR clients. Other use, including distribution in part or entirety or as part of other software, or reverse engineering, is not allowed without my explicit prior permission.

//var wf_stats = new Uint32Array(256);
//for(var i=0; i<256; i++)
//{
//	wf_stats[i] = 0;
//}

// Waterfall dynamic range adjustment - Phil Crump
const adjustWfRange_addition = -5;
const adjustWfRange_threshold = 60;
const adjustWfRange_scale = 1.6;

function adjustWfRange(d)
{
  d = d + adjustWfRange_addition;
  if (d >= (adjustWfRange_threshold + ((255 - adjustWfRange_threshold) / adjustWfRange_scale)))
  {
    d = 255;
  }
  else if (d > adjustWfRange_threshold)
  {
    d = adjustWfRange_threshold + (((d - adjustWfRange_threshold) * adjustWfRange_scale) | 0);
  }
  //	wf_stats[d] = wf_stats[d] + 1;
  return d;
}

(function()
{
  var t = !0
    , u = !1
    , v = 0
    , x = 0
    , B = 1
    , H = 0;
  if (!window.requestAnimationFrame)
    for (var K;;)
    {
      if (K = window.mozRequestAnimationFrame)
      {
        window.requestAnimationFrame = K;
        break
      }
      if (K = window.webkitRequestAnimationFrame)
      {
        window.requestAnimationFrame = K;
        break
      }
      B = 0;
      break
    }

  function V()
  {
    function I(c)
    {
      var a = c.layerX || c.offsetX
        , b = c.wheelDelta || -c.detail;
      0 < b ? L(-2, a) : 0 > b && L(-1, a);
      return cancelEvent(c)
    }
    var b = waterfallapplet[i];

    function N(c)
    {
      var g = a.width << a.maxzoom - a.b;
      c = dragorigval - (c - dragorigX << a.maxzoom - a.b);
      H ? (0 > c && (c = 0), g = (1024 << a.maxzoom) - (1024 << a.maxzoom - a.b)) : (c < -g / 2 && (c = -g / 2), g = (1024 << a.maxzoom) - g / 2);
      c > g && (c = g);
      B ? (a.z = c, b.q = 1) : (g = a.c, a.c = c, a.e("GET /~~waterparam?start=" + c), A(g, a.c, a.b, u), J())
    }

    function W(c)
    {
      var a = getMouseXY(c);
      N(a.x);
      return cancelEvent(c)
    }

    function O(c)
    {
      c.preventDefault();
      a.k = t;
      a.j = 10
    }

    function P(c)
    {
      c.preventDefault();
      setTimeout(X, 300)
    }

    function X()
    {
      a.k = u
    }

    function Q(c)
    {
      c.preventDefault();
      var b = 0;
      c = Math.floor(10 * c.scale);
      c > a.j + 1 && (b = -1);
      c < a.j - 1 && (b = 1);
      0 != b && (w(b, (a.p + a.w) / 2), a.j = c)
    }

    function R(c)
    {
      c.preventDefault();
      1 == c.targetTouches.length && (a.C = dragorigX, dragorigX = c.targetTouches[0].pageX, a.k == u && (dragging = t, dragorigval = a.c, a.t = a.i, a.i = (new Date).getTime(), clearTimeout(a.B)))
    }

    function S(c)
    {
      c.preventDefault();
      for (var b = 0; b < c.touches.length; b++)
      {
        var d = c.touches[b];
        a.w =
          a.p;
        a.p = d.pageX;
        a.k == u && (N(d.pageX), a.t = 0, a.i = 0)
      }
    }

    function Y()
    {
      w(1, dragorigX)
    }

    function T(c)
    {
      c.preventDefault();
      dragging = u;
      (c = a.i - a.t) && 300 > c ? w(-1, dragorigX) : a.i && 300 > (new Date).getTime() - a.i && (a.B = setTimeout(Y, 300))
    }

    function U()
    {
      if (b.q)
      {
        b.q = 0;
        var c = a.c;
        a.c = a.z;
        a.e("GET /~~waterparam?start=" + a.z);
        A(c, a.c, a.b, u);
        J()
      }
      b.r && (c = d.o, b.r = 0, d.a.drawImage(d, 0, 1, d.width, d.height - 1, 0, 0, d.width, d.height - 1), d.a.putImageData(c, 0, d.height - 1), (a.g != a.b || a.f != a.c) && A(a.f, a.c, a.g, t));
      requestAnimationFrame(U)
    }

    function J()
    {
      zoomchange(a.v
        , a.b, a.c)
    }

    function A(c, g, n, e)
    {
      var f = b.width
        , h = 0
        , k = d.height - h;
      if (e)
        if (x)
        {
          if (h = q - 1, k = 1, 0 > h) return
        }
      else h = d.height - 1, k = 1;
      if (n == a.b) try
      {
        if (g < c)
        {
          var l = c - g >> a.maxzoom - a.b;
          d.a.drawImage(d, 0, h, f - l, k, l, h, f - l, k);
          d.a.fillStyle = "#000000";
          d.a.fillRect(0, h, l, k);
          e || (j.a.drawImage(j, 0, h, f - l, k, l, h, f - l, k), j.a.fillStyle = "#000000", j.a.fillRect(0, h, l, k))
        }
        else if (g > c)
        {
          var m = g - c >> a.maxzoom - a.b;
          d.a.drawImage(d, m, h, f - m, k, 0, h, f - m, k);
          d.a.fillStyle = "#000000";
          d.a.fillRect(f - m, h, m, k);
          e || (j.a.drawImage(j, m, h, f - m, k, 0, h, f - m, k), j.a.fillStyle =
            "#000000", j.a.fillRect(f - m, h, m, k))
        }
      }
      catch (s)
      {}
      else if (a.l = t, n > a.b) m = 1 << n - a.b, l = 0.5 + 1024 * (-g + c) / (1024 << a.maxzoom - a.b), d.a.drawImage(d, 0, h, f, k, l, h, f / m, k), d.a.fillStyle = "#000000", d.a.fillRect(0, h, l, k), d.a.fillRect(l + f / m, h, f, k), !e && x && (j.a.drawImage(j, 0, h, 1024, k, l, h, 1024 / m, k), j.a.fillStyle = "#000000", j.a.fillRect(0, h, l, k), j.a.fillRect(l + f / m, h, f, k));
      else
      {
        m = 1 << a.b - n;
        l = 0.5 + (g - c >> a.maxzoom - n);
        try
        {
          d.a.drawImage(d, l, h, f / m, k, 0, h, f, k), !e && x && j.a.drawImage(j, l, h, f / m, k, 0, h, f, k)
        }
        catch (r)
        {
          d.a.fillStyle = "#000000"
            , d.a.fillRect(0, h, f, k), !e && x && j.a.fillRect(0, h, f, k)
        }
      }
    }

    function w(c, b)
    {
      if (0 != a.maxzoom)
      {
        var d = a.b
          , e = a.c
          , f = a.c + (b << a.maxzoom - a.b);
        a.b -= c;
        0 > a.b && (a.b = 0);
        a.b > a.maxzoom && (a.b = a.maxzoom);
        var h = a.width << a.maxzoom - a.b
          , f = f - (b << a.maxzoom - a.b);
        H ? (0 > f && (f = 0), h = (1024 << a.maxzoom) - h) : (f < -h / 2 && (f = -h / 2), h = (1024 << a.maxzoom) - h / 2);
        f > h && (f = h);
        a.c = f;
        A(e, a.c, d, u);
        a.e("GET /~~waterparam?zoom=" + a.b + "&start=" + a.c);
        J()
      }
    }

    function L(c, d)
    {
      if (-1 == c) w(1, d);
      else if (-2 == c) w(-1, d);
      else
      {
        var e = this.b
          , j = this.c
          , f = c
          , h = b.width;
        0 > f && (f = 0);
        f > this.maxzoom && (f = this.maxzoom);
        H && (0 > d && (d = 0), h = (1024 << this.maxzoom) - (h << this.maxzoom - f), d > h && (d = h));
        this.e("GET /~~waterparam?zoom=" + f + "&start=" + d);
        this.b = f;
        this.c = d;
        A(j, a.c, e, u);
        J()
      }
    }
    b.width || (b.width = 1024);
    b.height || (b.height = 100);
    document.getElementById(b.div).innerHTML = '<div id="wfcdiv' + v + '" style="height:100px;overflow:hidden;position:relative;"><canvas class="html5waterfall" id="wf1canvas' + v + '" width="' + b.width + '" height="' + b.height + '" style="position:absolute">test</canvas><canvas class="html5waterfall" id="wf2canvas' +
      v + '" width="' + b.width + '" height="' + b.height + '" style="position:absolute">test</canvas></div>';
    b.h = document.getElementById("wfcdiv" + v);
    var s = 0 <= v ? "on" : "off";
    b.h.v = b.id;
    b.h.band = b.band;
    b.h.width = b.width;
    b.h.height = b.height;
    b.h.maxzoom = b.maxzoom;
    b = b.h;
    b.r = 0;
    b.q = 0;
    b.destroy = function()
    {
      try
      {
        b.d.close()
      }
      catch (c)
      {}
      b.parentNode.removeChild(b)
    };
    var C = document.getElementById("wf1canvas" + v)
      , D = document.getElementById("wf2canvas" + v)
      , d = C
      , j = D;
    x || (j.height = 0);
    v++;
    C.a = C.getContext("2d");
    D.a = D.getContext("2d");
    d.a.fillStyle =
      "#000000";
    d.a.fillRect(0, 0, d.width, d.height);
    C.o = C.a.createImageData(1024, 1);
    D.o = D.a.createImageData(1024, 1);
    var a = b; - 1 < v && (s += "mes");
    b.mode = 1;
    var E = new Uint8Array(256)
      , F = new Uint8Array(256)
      , G = new Uint8Array(256)
      , e;
    for (e = 0; 64 > e; e++) E[e] = 0, F[e] = 0, G[e] = 2 * e;
    for (; 128 > e; e++) E[e] = 3 * e - 192, F[e] = 0, G[e] = 2 * e;
    for (; 192 > e; e++) E[e] = e + 64, F[e] = 256 * Math.sqrt((e - 128) / 64), G[e] = 511 - 2 * e;
    for (; 256 > e; e++) E[e] = 255, F[e] = 255, G[e] = 512 + 2 * e;
    b.b = 0;
    b.c = 0; - 2 < v && (s += "sa");
    b.g = 0;
    b.f = 0;
    b.m = b.width;
    b.l = t;
    b.s = [];
    b.k = u;
    b.j = 10;
    b.p = 0;
    b.w =
      0;
    b.t = 0;
    b.i = 0;
    b.B = 0; - 3 < v && (s += "ge");
    var y = new Uint8Array(1024)
      , q = 0
      , M = 0;
    onmessage = function(c)
    {
      c = new Uint8Array(c.data);
      if (255 == c[0])
      {
        if (255 != c[1])
        {
          var g = c;
          c = y;
          1 == g[1] && (a.f = g[3] + (g[4] << 8) + (g[5] << 16) + (g[6] << 24), 128 > g[2] && (a.g = g[2]), g = g.subarray(8));
          if (2 == g[1])
          {
            a.m = g[2] + (g[3] << 8);
            for (g = 0; g < a.m; g++) c[g] = 0
          }
          return
        }
        c = c.subarray(1)
      }
      for (g = 0; 1 > g; g++)
      {
        if (1 == a.n)
        {
          var n = c
            , p = y;
          for (e = 0; e < n.length; e++) z = 16 * (n[e] & 15) + 2, p[2 * e] = z, z = n[e] & 242, p[2 * e + 1] = z
        }
        if (9 == a.n)
          for (var n = c, p = y, f = 0, h = 0, k = 0, l = 0, m = 0, s = 0; k < b.m;)
          {
            var l =
              n[h] << 8 + f | n[h + 1] << f
              , r = 0
              , w = 1;
            l & 32768 && (l = 128 * m + ((l & 32512) >> 8), r = Z[l], w = $[l]);
            f += w;
            8 <= f && (f -= 8, h++);
            if (1 == r || -1 == r) m = 1;
            if (1 < r || -1 > r) m = 2;
            0 == r && (m = 0);
            s += r << 4;
            r = p[k] + s;
            0 > r && (r = 8);
            255 < r && (r = 248);
            p[k] = r;
            k++
          }
      }
      g = d.o;
      if (0 != a.mode)
      {
        for (c = 0; 1024 > c; c++) n = y[c], g.data[4 * c] = E[adjustWfRange(n)], g.data[4 * c + 1] = F[adjustWfRange(n)], g.data[4 * c + 2] = G[adjustWfRange(n)], g.data[4 * c + 3] = 255;
        M++;
        300 == M && (M = 0);
        x ? (d.a.putImageData(g, 0, q), d.style.top = d.height - q + "px", j.style.top = -q + "px", q++, q >= d.height && (q = 0, c = j, j = d, d = c)) : B ? b.r = 1 : (d.a.drawImage(d, 0, 1, d.width, d.height - 1, 0, 0
          , d.width, d.height - 1), d.a.putImageData(g, 0, d.height - 1));
        !B && (a.g != a.b || a.f != a.c) && A(a.f, a.c, a.g, t)
      }
      else
      {
        d.a.fillStyle = "#000000";
        d.a.fillRect(0, 0, d.width, d.height);
        d.a.fillStyle = "#00ffff";
        if (a.l)
        {
          for (c = 0; 1024 > c; c++) a.s[c] = y[c];
          a.l = u
        }
        for (c = 0; c < b.width; c++) n = 0.5 * (y[c] + a.s[c]), a.s[c] = n, n *= d.height / 255, d.a.fillRect(c, d.height - n, 1, n)
      }
    };
    d.addEventListener("mousewheel", I);
    d.addEventListener("DOMMouseScroll", I);
    j.addEventListener("mousewheel", I);
    j.addEventListener("DOMMouseScroll", I);
    b.onmousedown = function(c)
    {
      var a =
        getMouseXY(c);
      dragging = t;
      document.onmousemove = W;
      dragorigX = a.x;
      dragorigval = this.c;
      return cancelEvent(c)
    };
    B && requestAnimationFrame(U);
    window.isTouchDev && (d.addEventListener("gesturestart", O), d.addEventListener("gesturechange", Q), d.addEventListener("gestureend", P), j.addEventListener("gesturestart", O), j.addEventListener("gesturechange", Q), j.addEventListener("gestureend", P), d.addEventListener("touchstart", R), d.addEventListener("touchmove", S), d.addEventListener("touchend", T), j.addEventListener("touchstart"
      , R), j.addEventListener("touchmove", S), j.addEventListener("touchend", T));
    b.setSize = function(a, g)
    {
      var e = document.createElement("canvas")
        , p = Math.min(d.height, g)
        , f = Math.min(d.width, a);
      e.width = f;
      e.height = p;
      x ? (e.height = p, 0 < q && e.getContext("2d").drawImage(d, 0, 0, f, q, 0, p - q, f, q), 0 < p - q && e.getContext("2d").drawImage(j, 0, j.height - (p - q), f, p - q, 0, 0, f, p - q), d.height = g, d.width = a, j.height = g, j.width = a, this.style.height = g + "px", j.a.drawImage(e, 0, g - e.height), q = 0) : (e.height = p, e.getContext("2d").drawImage(d, 0, d.height - p, f
        , p, 0, 0, f, p), d.height = g, d.width = a, d.a.drawImage(e, 0, g - e.height));
      this.style.height = g + "px";
      this.style.width = a + "px";
      b.width = a;
      this.e("GET /~~waterparam?width=" + a)
    };
    b.setheight = function() {};
    b.setzoom = L;
    b.A = 4;
    b.setslow = function(a)
    {
      b.A = a;
      this.e("GET /~~waterparam?slow=" + a)
    };
    b.setmode = function(a)
    {
      if ((2 <= this.mode || 2 <= a) && this.mode != a)
      {
        var b = a;
        0 == b && (b = 1);
        this.e("GET /~~waterparam?scale=" + b)
      }
      0 == a && 0 != this.mode && (q = d.height - 1, j.style.top = d.height + "px", d.style.top = "0px", smoothbinvalid = t);
      this.mode = a
    };
    b.setband =
      function(a, b, d, e)
      {
        this.g = this.b = d;
        this.f = this.c = e;
        this.maxzoom = b;
        this.e("GET /~~waterparam?band=" + a + "&zoom=" + this.b + "&start=" + this.c)
      };
    var aa = b.width;
    b.n = 9;
    b.d = null;
    b.u = 1;
    b.startstop = function(a)
    {
      if (a && !b.d) b.d = new WebSocket("wss://" + window.location.host + "/~~waterstream" + b.band + "?format=" + b.n + "&width=" + aa + "&zoom=" + this.b + "&start=" + this.c), b.d.binaryType = "arraybuffer", b.d[s] = onmessage, b.l = t, y = new Uint8Array(1024), b.d.onopen = !b.u ? function()
        {
          b.e("GET /~~waterparam?zoom=" + b.b + "&start=" + b.c + "&slow=" + b.A)
        } :
        function()
        {
          waterfallappletstarted(this.v)
        }, b.u = 0;
      else if (!a && b.d)
      {
        try
        {
          b.d.close()
        }
        catch (d)
        {}
        b.d = null
      }
    };
    b.e = function(a)
    {
      this.d && this.d.send(a)
    };
    b.startstop(1);
    var Z = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, 5, 5, 7, 7, 9, 11, 13, 15, -5, -5, -7, -7, -9, -11, -13, -15, 1, 1, 1, 1, 1, 1, 1, 1, 1
        , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
        , 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, 7, 7, 9, 9, 11, 11, 13, 15, -7, -7, -9, -9, -11, -11, -13, -15
      ]
      , $ = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 8, 8, 8, 8, 7, 7, 7, 7, 8, 8, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
        , 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 8, 8, 7, 7, 7, 7, 7, 7, 8, 8
      ];
    return b
  }
  window.prep_html5waterfalls = function()
  {
    for (i = 0; i < nwaterfalls; i++) waterfallapplet[i] = V()
  };
  prep_html5waterfalls();
})();