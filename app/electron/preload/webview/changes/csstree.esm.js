var rs = Object.create;
var tr = Object.defineProperty;
var ns = Object.getOwnPropertyDescriptor;
var os = Object.getOwnPropertyNames;
var is = Object.getPrototypeOf,
    as = Object.prototype.hasOwnProperty;
var Oe = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
    b = (e, t) => {
        for (var r in t) tr(e, r, { get: t[r], enumerable: !0 });
    },
    ss = (e, t, r, n) => {
        if ((t && typeof t == 'object') || typeof t == 'function')
            for (let o of os(t))
                !as.call(e, o) &&
                    o !== r &&
                    tr(e, o, {
                        get: () => t[o],
                        enumerable: !(n = ns(t, o)) || n.enumerable,
                    });
        return e;
    };
var ls = (e, t, r) => (
    (r = e != null ? rs(is(e)) : {}),
    ss(t || !e || !e.__esModule ? tr(r, 'default', { value: e, enumerable: !0 }) : r, e)
);
var Jo = Oe((ur) => {
    var Zo = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    ur.encode = function (e) {
        if (0 <= e && e < Zo.length) return Zo[e];
        throw new TypeError('Must be between 0 and 63: ' + e);
    };
    ur.decode = function (e) {
        var t = 65,
            r = 90,
            n = 97,
            o = 122,
            i = 48,
            s = 57,
            u = 43,
            c = 47,
            a = 26,
            l = 52;
        return t <= e && e <= r
            ? e - t
            : n <= e && e <= o
              ? e - n + a
              : i <= e && e <= s
                ? e - i + l
                : e == u
                  ? 62
                  : e == c
                    ? 63
                    : -1;
    };
});
var oi = Oe((hr) => {
    var ei = Jo(),
        pr = 5,
        ti = 1 << pr,
        ri = ti - 1,
        ni = ti;
    function ks(e) {
        return e < 0 ? (-e << 1) + 1 : (e << 1) + 0;
    }
    function ws(e) {
        var t = (e & 1) === 1,
            r = e >> 1;
        return t ? -r : r;
    }
    hr.encode = function (t) {
        var r = '',
            n,
            o = ks(t);
        do (n = o & ri), (o >>>= pr), o > 0 && (n |= ni), (r += ei.encode(n));
        while (o > 0);
        return r;
    };
    hr.decode = function (t, r, n) {
        var o = t.length,
            i = 0,
            s = 0,
            u,
            c;
        do {
            if (r >= o) throw new Error('Expected more digits in base 64 VLQ value.');
            if (((c = ei.decode(t.charCodeAt(r++))), c === -1))
                throw new Error('Invalid base64 digit: ' + t.charAt(r - 1));
            (u = !!(c & ni)), (c &= ri), (i = i + (c << s)), (s += pr);
        } while (u);
        (n.value = ws(i)), (n.rest = r);
    };
});
var Et = Oe((K) => {
    function vs(e, t, r) {
        if (t in e) return e[t];
        if (arguments.length === 3) return r;
        throw new Error('"' + t + '" is a required argument.');
    }
    K.getArg = vs;
    var ii = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,
        Ss = /^data:.+\,.+$/;
    function nt(e) {
        var t = e.match(ii);
        return t ? { scheme: t[1], auth: t[2], host: t[3], port: t[4], path: t[5] } : null;
    }
    K.urlParse = nt;
    function qe(e) {
        var t = '';
        return (
            e.scheme && (t += e.scheme + ':'),
            (t += '//'),
            e.auth && (t += e.auth + '@'),
            e.host && (t += e.host),
            e.port && (t += ':' + e.port),
            e.path && (t += e.path),
            t
        );
    }
    K.urlGenerate = qe;
    var Cs = 32;
    function As(e) {
        var t = [];
        return function (r) {
            for (var n = 0; n < t.length; n++)
                if (t[n].input === r) {
                    var o = t[0];
                    return (t[0] = t[n]), (t[n] = o), t[0].result;
                }
            var i = e(r);
            return t.unshift({ input: r, result: i }), t.length > Cs && t.pop(), i;
        };
    }
    var mr = As(function (t) {
        var r = t,
            n = nt(t);
        if (n) {
            if (!n.path) return t;
            r = n.path;
        }
        for (var o = K.isAbsolute(r), i = [], s = 0, u = 0; ; )
            if (((s = u), (u = r.indexOf('/', s)), u === -1)) {
                i.push(r.slice(s));
                break;
            } else for (i.push(r.slice(s, u)); u < r.length && r[u] === '/'; ) u++;
        for (var c, a = 0, u = i.length - 1; u >= 0; u--)
            (c = i[u]),
                c === '.'
                    ? i.splice(u, 1)
                    : c === '..'
                      ? a++
                      : a > 0 && (c === '' ? (i.splice(u + 1, a), (a = 0)) : (i.splice(u, 2), a--));
        return (r = i.join('/')), r === '' && (r = o ? '/' : '.'), n ? ((n.path = r), qe(n)) : r;
    });
    K.normalize = mr;
    function ai(e, t) {
        e === '' && (e = '.'), t === '' && (t = '.');
        var r = nt(t),
            n = nt(e);
        if ((n && (e = n.path || '/'), r && !r.scheme)) return n && (r.scheme = n.scheme), qe(r);
        if (r || t.match(Ss)) return t;
        if (n && !n.host && !n.path) return (n.host = t), qe(n);
        var o = t.charAt(0) === '/' ? t : mr(e.replace(/\/+$/, '') + '/' + t);
        return n ? ((n.path = o), qe(n)) : o;
    }
    K.join = ai;
    K.isAbsolute = function (e) {
        return e.charAt(0) === '/' || ii.test(e);
    };
    function Ts(e, t) {
        e === '' && (e = '.'), (e = e.replace(/\/$/, ''));
        for (var r = 0; t.indexOf(e + '/') !== 0; ) {
            var n = e.lastIndexOf('/');
            if (n < 0 || ((e = e.slice(0, n)), e.match(/^([^\/]+:\/)?\/*$/))) return t;
            ++r;
        }
        return Array(r + 1).join('../') + t.substr(e.length + 1);
    }
    K.relative = Ts;
    var si = (function () {
        var e = Object.create(null);
        return !('__proto__' in e);
    })();
    function li(e) {
        return e;
    }
    function Es(e) {
        return ci(e) ? '$' + e : e;
    }
    K.toSetString = si ? li : Es;
    function Ls(e) {
        return ci(e) ? e.slice(1) : e;
    }
    K.fromSetString = si ? li : Ls;
    function ci(e) {
        if (!e) return !1;
        var t = e.length;
        if (
            t < 9 ||
            e.charCodeAt(t - 1) !== 95 ||
            e.charCodeAt(t - 2) !== 95 ||
            e.charCodeAt(t - 3) !== 111 ||
            e.charCodeAt(t - 4) !== 116 ||
            e.charCodeAt(t - 5) !== 111 ||
            e.charCodeAt(t - 6) !== 114 ||
            e.charCodeAt(t - 7) !== 112 ||
            e.charCodeAt(t - 8) !== 95 ||
            e.charCodeAt(t - 9) !== 95
        )
            return !1;
        for (var r = t - 10; r >= 0; r--) if (e.charCodeAt(r) !== 36) return !1;
        return !0;
    }
    function Ps(e, t, r) {
        var n = be(e.source, t.source);
        return n !== 0 ||
            ((n = e.originalLine - t.originalLine), n !== 0) ||
            ((n = e.originalColumn - t.originalColumn), n !== 0 || r) ||
            ((n = e.generatedColumn - t.generatedColumn), n !== 0) ||
            ((n = e.generatedLine - t.generatedLine), n !== 0)
            ? n
            : be(e.name, t.name);
    }
    K.compareByOriginalPositions = Ps;
    function Is(e, t, r) {
        var n;
        return (
            (n = e.originalLine - t.originalLine),
            n !== 0 ||
            ((n = e.originalColumn - t.originalColumn), n !== 0 || r) ||
            ((n = e.generatedColumn - t.generatedColumn), n !== 0) ||
            ((n = e.generatedLine - t.generatedLine), n !== 0)
                ? n
                : be(e.name, t.name)
        );
    }
    K.compareByOriginalPositionsNoSource = Is;
    function Ds(e, t, r) {
        var n = e.generatedLine - t.generatedLine;
        return n !== 0 ||
            ((n = e.generatedColumn - t.generatedColumn), n !== 0 || r) ||
            ((n = be(e.source, t.source)), n !== 0) ||
            ((n = e.originalLine - t.originalLine), n !== 0) ||
            ((n = e.originalColumn - t.originalColumn), n !== 0)
            ? n
            : be(e.name, t.name);
    }
    K.compareByGeneratedPositionsDeflated = Ds;
    function Os(e, t, r) {
        var n = e.generatedColumn - t.generatedColumn;
        return n !== 0 ||
            r ||
            ((n = be(e.source, t.source)), n !== 0) ||
            ((n = e.originalLine - t.originalLine), n !== 0) ||
            ((n = e.originalColumn - t.originalColumn), n !== 0)
            ? n
            : be(e.name, t.name);
    }
    K.compareByGeneratedPositionsDeflatedNoLine = Os;
    function be(e, t) {
        return e === t ? 0 : e === null ? 1 : t === null ? -1 : e > t ? 1 : -1;
    }
    function Ns(e, t) {
        var r = e.generatedLine - t.generatedLine;
        return r !== 0 ||
            ((r = e.generatedColumn - t.generatedColumn), r !== 0) ||
            ((r = be(e.source, t.source)), r !== 0) ||
            ((r = e.originalLine - t.originalLine), r !== 0) ||
            ((r = e.originalColumn - t.originalColumn), r !== 0)
            ? r
            : be(e.name, t.name);
    }
    K.compareByGeneratedPositionsInflated = Ns;
    function zs(e) {
        return JSON.parse(e.replace(/^\)]}'[^\n]*\n/, ''));
    }
    K.parseSourceMapInput = zs;
    function Ms(e, t, r) {
        if (
            ((t = t || ''),
            e && (e[e.length - 1] !== '/' && t[0] !== '/' && (e += '/'), (t = e + t)),
            r)
        ) {
            var n = nt(r);
            if (!n) throw new Error('sourceMapURL could not be parsed');
            if (n.path) {
                var o = n.path.lastIndexOf('/');
                o >= 0 && (n.path = n.path.substring(0, o + 1));
            }
            t = ai(qe(n), t);
        }
        return mr(t);
    }
    K.computeSourceURL = Ms;
});
var pi = Oe((ui) => {
    var fr = Et(),
        dr = Object.prototype.hasOwnProperty,
        Le = typeof Map < 'u';
    function xe() {
        (this._array = []), (this._set = Le ? new Map() : Object.create(null));
    }
    xe.fromArray = function (t, r) {
        for (var n = new xe(), o = 0, i = t.length; o < i; o++) n.add(t[o], r);
        return n;
    };
    xe.prototype.size = function () {
        return Le ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    };
    xe.prototype.add = function (t, r) {
        var n = Le ? t : fr.toSetString(t),
            o = Le ? this.has(t) : dr.call(this._set, n),
            i = this._array.length;
        (!o || r) && this._array.push(t), o || (Le ? this._set.set(t, i) : (this._set[n] = i));
    };
    xe.prototype.has = function (t) {
        if (Le) return this._set.has(t);
        var r = fr.toSetString(t);
        return dr.call(this._set, r);
    };
    xe.prototype.indexOf = function (t) {
        if (Le) {
            var r = this._set.get(t);
            if (r >= 0) return r;
        } else {
            var n = fr.toSetString(t);
            if (dr.call(this._set, n)) return this._set[n];
        }
        throw new Error('"' + t + '" is not in the set.');
    };
    xe.prototype.at = function (t) {
        if (t >= 0 && t < this._array.length) return this._array[t];
        throw new Error('No element indexed by ' + t);
    };
    xe.prototype.toArray = function () {
        return this._array.slice();
    };
    ui.ArraySet = xe;
});
var fi = Oe((mi) => {
    var hi = Et();
    function Rs(e, t) {
        var r = e.generatedLine,
            n = t.generatedLine,
            o = e.generatedColumn,
            i = t.generatedColumn;
        return n > r || (n == r && i >= o) || hi.compareByGeneratedPositionsInflated(e, t) <= 0;
    }
    function Lt() {
        (this._array = []),
            (this._sorted = !0),
            (this._last = { generatedLine: -1, generatedColumn: 0 });
    }
    Lt.prototype.unsortedForEach = function (t, r) {
        this._array.forEach(t, r);
    };
    Lt.prototype.add = function (t) {
        Rs(this._last, t)
            ? ((this._last = t), this._array.push(t))
            : ((this._sorted = !1), this._array.push(t));
    };
    Lt.prototype.toArray = function () {
        return (
            this._sorted ||
                (this._array.sort(hi.compareByGeneratedPositionsInflated), (this._sorted = !0)),
            this._array
        );
    };
    mi.MappingList = Lt;
});
var gi = Oe((di) => {
    var ot = oi(),
        j = Et(),
        Pt = pi().ArraySet,
        Fs = fi().MappingList;
    function oe(e) {
        e || (e = {}),
            (this._file = j.getArg(e, 'file', null)),
            (this._sourceRoot = j.getArg(e, 'sourceRoot', null)),
            (this._skipValidation = j.getArg(e, 'skipValidation', !1)),
            (this._sources = new Pt()),
            (this._names = new Pt()),
            (this._mappings = new Fs()),
            (this._sourcesContents = null);
    }
    oe.prototype._version = 3;
    oe.fromSourceMap = function (t) {
        var r = t.sourceRoot,
            n = new oe({ file: t.file, sourceRoot: r });
        return (
            t.eachMapping(function (o) {
                var i = {
                    generated: {
                        line: o.generatedLine,
                        column: o.generatedColumn,
                    },
                };
                o.source != null &&
                    ((i.source = o.source),
                    r != null && (i.source = j.relative(r, i.source)),
                    (i.original = {
                        line: o.originalLine,
                        column: o.originalColumn,
                    }),
                    o.name != null && (i.name = o.name)),
                    n.addMapping(i);
            }),
            t.sources.forEach(function (o) {
                var i = o;
                r !== null && (i = j.relative(r, o)), n._sources.has(i) || n._sources.add(i);
                var s = t.sourceContentFor(o);
                s != null && n.setSourceContent(o, s);
            }),
            n
        );
    };
    oe.prototype.addMapping = function (t) {
        var r = j.getArg(t, 'generated'),
            n = j.getArg(t, 'original', null),
            o = j.getArg(t, 'source', null),
            i = j.getArg(t, 'name', null);
        this._skipValidation || this._validateMapping(r, n, o, i),
            o != null && ((o = String(o)), this._sources.has(o) || this._sources.add(o)),
            i != null && ((i = String(i)), this._names.has(i) || this._names.add(i)),
            this._mappings.add({
                generatedLine: r.line,
                generatedColumn: r.column,
                originalLine: n != null && n.line,
                originalColumn: n != null && n.column,
                source: o,
                name: i,
            });
    };
    oe.prototype.setSourceContent = function (t, r) {
        var n = t;
        this._sourceRoot != null && (n = j.relative(this._sourceRoot, n)),
            r != null
                ? (this._sourcesContents || (this._sourcesContents = Object.create(null)),
                  (this._sourcesContents[j.toSetString(n)] = r))
                : this._sourcesContents &&
                  (delete this._sourcesContents[j.toSetString(n)],
                  Object.keys(this._sourcesContents).length === 0 &&
                      (this._sourcesContents = null));
    };
    oe.prototype.applySourceMap = function (t, r, n) {
        var o = r;
        if (r == null) {
            if (t.file == null)
                throw new Error(
                    `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`,
                );
            o = t.file;
        }
        var i = this._sourceRoot;
        i != null && (o = j.relative(i, o));
        var s = new Pt(),
            u = new Pt();
        this._mappings.unsortedForEach(function (c) {
            if (c.source === o && c.originalLine != null) {
                var a = t.originalPositionFor({
                    line: c.originalLine,
                    column: c.originalColumn,
                });
                a.source != null &&
                    ((c.source = a.source),
                    n != null && (c.source = j.join(n, c.source)),
                    i != null && (c.source = j.relative(i, c.source)),
                    (c.originalLine = a.line),
                    (c.originalColumn = a.column),
                    a.name != null && (c.name = a.name));
            }
            var l = c.source;
            l != null && !s.has(l) && s.add(l);
            var p = c.name;
            p != null && !u.has(p) && u.add(p);
        }, this),
            (this._sources = s),
            (this._names = u),
            t.sources.forEach(function (c) {
                var a = t.sourceContentFor(c);
                a != null &&
                    (n != null && (c = j.join(n, c)),
                    i != null && (c = j.relative(i, c)),
                    this.setSourceContent(c, a));
            }, this);
    };
    oe.prototype._validateMapping = function (t, r, n, o) {
        if (r && typeof r.line != 'number' && typeof r.column != 'number')
            throw new Error(
                'original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.',
            );
        if (!(t && 'line' in t && 'column' in t && t.line > 0 && t.column >= 0 && !r && !n && !o)) {
            if (
                t &&
                'line' in t &&
                'column' in t &&
                r &&
                'line' in r &&
                'column' in r &&
                t.line > 0 &&
                t.column >= 0 &&
                r.line > 0 &&
                r.column >= 0 &&
                n
            )
                return;
            throw new Error(
                'Invalid mapping: ' +
                    JSON.stringify({
                        generated: t,
                        source: n,
                        original: r,
                        name: o,
                    }),
            );
        }
    };
    oe.prototype._serializeMappings = function () {
        for (
            var t = 0,
                r = 1,
                n = 0,
                o = 0,
                i = 0,
                s = 0,
                u = '',
                c,
                a,
                l,
                p,
                m = this._mappings.toArray(),
                f = 0,
                P = m.length;
            f < P;
            f++
        ) {
            if (((a = m[f]), (c = ''), a.generatedLine !== r))
                for (t = 0; a.generatedLine !== r; ) (c += ';'), r++;
            else if (f > 0) {
                if (!j.compareByGeneratedPositionsInflated(a, m[f - 1])) continue;
                c += ',';
            }
            (c += ot.encode(a.generatedColumn - t)),
                (t = a.generatedColumn),
                a.source != null &&
                    ((p = this._sources.indexOf(a.source)),
                    (c += ot.encode(p - s)),
                    (s = p),
                    (c += ot.encode(a.originalLine - 1 - o)),
                    (o = a.originalLine - 1),
                    (c += ot.encode(a.originalColumn - n)),
                    (n = a.originalColumn),
                    a.name != null &&
                        ((l = this._names.indexOf(a.name)), (c += ot.encode(l - i)), (i = l))),
                (u += c);
        }
        return u;
    };
    oe.prototype._generateSourcesContent = function (t, r) {
        return t.map(function (n) {
            if (!this._sourcesContents) return null;
            r != null && (n = j.relative(r, n));
            var o = j.toSetString(n);
            return Object.prototype.hasOwnProperty.call(this._sourcesContents, o)
                ? this._sourcesContents[o]
                : null;
        }, this);
    };
    oe.prototype.toJSON = function () {
        var t = {
            version: this._version,
            sources: this._sources.toArray(),
            names: this._names.toArray(),
            mappings: this._serializeMappings(),
        };
        return (
            this._file != null && (t.file = this._file),
            this._sourceRoot != null && (t.sourceRoot = this._sourceRoot),
            this._sourcesContents &&
                (t.sourcesContent = this._generateSourcesContent(t.sources, t.sourceRoot)),
            t
        );
    };
    oe.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    di.SourceMapGenerator = oe;
});
var $e = {};
b($e, {
    AtKeyword: () => I,
    BadString: () => Ae,
    BadUrl: () => Y,
    CDC: () => U,
    CDO: () => ue,
    Colon: () => O,
    Comma: () => G,
    Comment: () => E,
    Delim: () => g,
    Dimension: () => y,
    EOF: () => Xe,
    Function: () => x,
    Hash: () => v,
    Ident: () => h,
    LeftCurlyBracket: () => M,
    LeftParenthesis: () => T,
    LeftSquareBracket: () => q,
    Number: () => d,
    Percentage: () => A,
    RightCurlyBracket: () => H,
    RightParenthesis: () => w,
    RightSquareBracket: () => V,
    Semicolon: () => _,
    String: () => W,
    Url: () => F,
    WhiteSpace: () => k,
});
var Xe = 0,
    h = 1,
    x = 2,
    I = 3,
    v = 4,
    W = 5,
    Ae = 6,
    F = 7,
    Y = 8,
    g = 9,
    d = 10,
    A = 11,
    y = 12,
    k = 13,
    ue = 14,
    U = 15,
    O = 16,
    _ = 17,
    G = 18,
    q = 19,
    V = 20,
    T = 21,
    w = 22,
    M = 23,
    H = 24,
    E = 25;
function B(e) {
    return e >= 48 && e <= 57;
}
function ee(e) {
    return B(e) || (e >= 65 && e <= 70) || (e >= 97 && e <= 102);
}
function yt(e) {
    return e >= 65 && e <= 90;
}
function cs(e) {
    return e >= 97 && e <= 122;
}
function us(e) {
    return yt(e) || cs(e);
}
function ps(e) {
    return e >= 128;
}
function xt(e) {
    return us(e) || ps(e) || e === 95;
}
function Ne(e) {
    return xt(e) || B(e) || e === 45;
}
function hs(e) {
    return (e >= 0 && e <= 8) || e === 11 || (e >= 14 && e <= 31) || e === 127;
}
function Ze(e) {
    return e === 10 || e === 13 || e === 12;
}
function pe(e) {
    return Ze(e) || e === 32 || e === 9;
}
function $(e, t) {
    return !(e !== 92 || Ze(t) || t === 0);
}
function ze(e, t, r) {
    return e === 45 ? xt(t) || t === 45 || $(t, r) : xt(e) ? !0 : e === 92 ? $(e, t) : !1;
}
function kt(e, t, r) {
    return e === 43 || e === 45
        ? B(t)
            ? 2
            : t === 46 && B(r)
              ? 3
              : 0
        : e === 46
          ? B(t)
              ? 2
              : 0
          : B(e)
            ? 1
            : 0;
}
function wt(e) {
    return e === 65279 || e === 65534 ? 1 : 0;
}
var rr = new Array(128),
    ms = 128,
    Je = 130,
    nr = 131,
    vt = 132,
    or = 133;
for (let e = 0; e < rr.length; e++)
    rr[e] = (pe(e) && Je) || (B(e) && nr) || (xt(e) && vt) || (hs(e) && or) || e || ms;
function St(e) {
    return e < 128 ? rr[e] : vt;
}
function Me(e, t) {
    return t < e.length ? e.charCodeAt(t) : 0;
}
function Ct(e, t, r) {
    return r === 13 && Me(e, t + 1) === 10 ? 2 : 1;
}
function de(e, t, r) {
    let n = e.charCodeAt(t);
    return yt(n) && (n = n | 32), n === r;
}
function ge(e, t, r, n) {
    if (r - t !== n.length || t < 0 || r > e.length) return !1;
    for (let o = t; o < r; o++) {
        let i = n.charCodeAt(o - t),
            s = e.charCodeAt(o);
        if ((yt(s) && (s = s | 32), s !== i)) return !1;
    }
    return !0;
}
function qo(e, t) {
    for (; t >= 0 && pe(e.charCodeAt(t)); t--);
    return t + 1;
}
function et(e, t) {
    for (; t < e.length && pe(e.charCodeAt(t)); t++);
    return t;
}
function ir(e, t) {
    for (; t < e.length && B(e.charCodeAt(t)); t++);
    return t;
}
function se(e, t) {
    if (((t += 2), ee(Me(e, t - 1)))) {
        for (let n = Math.min(e.length, t + 5); t < n && ee(Me(e, t)); t++);
        let r = Me(e, t);
        pe(r) && (t += Ct(e, t, r));
    }
    return t;
}
function tt(e, t) {
    for (; t < e.length; t++) {
        let r = e.charCodeAt(t);
        if (!Ne(r)) {
            if ($(r, Me(e, t + 1))) {
                t = se(e, t) - 1;
                continue;
            }
            break;
        }
    }
    return t;
}
function Te(e, t) {
    let r = e.charCodeAt(t);
    if (
        ((r === 43 || r === 45) && (r = e.charCodeAt((t += 1))),
        B(r) && ((t = ir(e, t + 1)), (r = e.charCodeAt(t))),
        r === 46 && B(e.charCodeAt(t + 1)) && ((t += 2), (t = ir(e, t))),
        de(e, t, 101))
    ) {
        let n = 0;
        (r = e.charCodeAt(t + 1)),
            (r === 45 || r === 43) && ((n = 1), (r = e.charCodeAt(t + 2))),
            B(r) && (t = ir(e, t + 1 + n + 1));
    }
    return t;
}
function At(e, t) {
    for (; t < e.length; t++) {
        let r = e.charCodeAt(t);
        if (r === 41) {
            t++;
            break;
        }
        $(r, Me(e, t + 1)) && (t = se(e, t));
    }
    return t;
}
function Re(e) {
    if (e.length === 1 && !ee(e.charCodeAt(0))) return e[0];
    let t = parseInt(e, 16);
    return (
        (t === 0 || (t >= 55296 && t <= 57343) || t > 1114111) && (t = 65533),
        String.fromCodePoint(t)
    );
}
var Fe = [
    'EOF-token',
    'ident-token',
    'function-token',
    'at-keyword-token',
    'hash-token',
    'string-token',
    'bad-string-token',
    'url-token',
    'bad-url-token',
    'delim-token',
    'number-token',
    'percentage-token',
    'dimension-token',
    'whitespace-token',
    'CDO-token',
    'CDC-token',
    'colon-token',
    'semicolon-token',
    'comma-token',
    '[-token',
    ']-token',
    '(-token',
    ')-token',
    '{-token',
    '}-token',
];
function Be(e = null, t) {
    return e === null || e.length < t ? new Uint32Array(Math.max(t + 1024, 16384)) : e;
}
var Uo = 10,
    fs = 12,
    jo = 13;
function Wo(e) {
    let t = e.source,
        r = t.length,
        n = t.length > 0 ? wt(t.charCodeAt(0)) : 0,
        o = Be(e.lines, r),
        i = Be(e.columns, r),
        s = e.startLine,
        u = e.startColumn;
    for (let c = n; c < r; c++) {
        let a = t.charCodeAt(c);
        (o[c] = s),
            (i[c] = u++),
            (a === Uo || a === jo || a === fs) &&
                (a === jo &&
                    c + 1 < r &&
                    t.charCodeAt(c + 1) === Uo &&
                    (c++, (o[c] = s), (i[c] = u)),
                s++,
                (u = 1));
    }
    (o[r] = s), (i[r] = u), (e.lines = o), (e.columns = i), (e.computed = !0);
}
var Tt = class {
    constructor() {
        (this.lines = null), (this.columns = null), (this.computed = !1);
    }
    setSource(t, r = 0, n = 1, o = 1) {
        (this.source = t),
            (this.startOffset = r),
            (this.startLine = n),
            (this.startColumn = o),
            (this.computed = !1);
    }
    getLocation(t, r) {
        return (
            this.computed || Wo(this),
            {
                source: r,
                offset: this.startOffset + t,
                line: this.lines[t],
                column: this.columns[t],
            }
        );
    }
    getLocationRange(t, r, n) {
        return (
            this.computed || Wo(this),
            {
                source: n,
                start: {
                    offset: this.startOffset + t,
                    line: this.lines[t],
                    column: this.columns[t],
                },
                end: {
                    offset: this.startOffset + r,
                    line: this.lines[r],
                    column: this.columns[r],
                },
            }
        );
    }
};
var ne = 16777215,
    we = 24,
    ds = new Map([
        [2, 22],
        [21, 22],
        [19, 20],
        [23, 24],
    ]),
    rt = class {
        constructor(t, r) {
            this.setSource(t, r);
        }
        reset() {
            (this.eof = !1),
                (this.tokenIndex = -1),
                (this.tokenType = 0),
                (this.tokenStart = this.firstCharOffset),
                (this.tokenEnd = this.firstCharOffset);
        }
        setSource(t = '', r = () => {}) {
            t = String(t || '');
            let n = t.length,
                o = Be(this.offsetAndType, t.length + 1),
                i = Be(this.balance, t.length + 1),
                s = 0,
                u = 0,
                c = 0,
                a = -1;
            for (
                this.offsetAndType = null,
                    this.balance = null,
                    r(t, (l, p, m) => {
                        switch (l) {
                            default:
                                i[s] = n;
                                break;
                            case u: {
                                let f = c & ne;
                                for (c = i[f], u = c >> we, i[s] = f, i[f++] = s; f < s; f++)
                                    i[f] === n && (i[f] = s);
                                break;
                            }
                            case 21:
                            case 2:
                            case 19:
                            case 23:
                                (i[s] = c), (u = ds.get(l)), (c = (u << we) | s);
                                break;
                        }
                        (o[s++] = (l << we) | m), a === -1 && (a = p);
                    }),
                    o[s] = (0 << we) | n,
                    i[s] = n,
                    i[n] = n;
                c !== 0;

            ) {
                let l = c & ne;
                (c = i[l]), (i[l] = n);
            }
            (this.source = t),
                (this.firstCharOffset = a === -1 ? 0 : a),
                (this.tokenCount = s),
                (this.offsetAndType = o),
                (this.balance = i),
                this.reset(),
                this.next();
        }
        lookupType(t) {
            return (t += this.tokenIndex), t < this.tokenCount ? this.offsetAndType[t] >> we : 0;
        }
        lookupOffset(t) {
            return (
                (t += this.tokenIndex),
                t < this.tokenCount ? this.offsetAndType[t - 1] & ne : this.source.length
            );
        }
        lookupValue(t, r) {
            return (
                (t += this.tokenIndex),
                t < this.tokenCount
                    ? ge(this.source, this.offsetAndType[t - 1] & ne, this.offsetAndType[t] & ne, r)
                    : !1
            );
        }
        getTokenStart(t) {
            return t === this.tokenIndex
                ? this.tokenStart
                : t > 0
                  ? t < this.tokenCount
                      ? this.offsetAndType[t - 1] & ne
                      : this.offsetAndType[this.tokenCount] & ne
                  : this.firstCharOffset;
        }
        substrToCursor(t) {
            return this.source.substring(t, this.tokenStart);
        }
        isBalanceEdge(t) {
            return this.balance[this.tokenIndex] < t;
        }
        isDelim(t, r) {
            return r
                ? this.lookupType(r) === 9 && this.source.charCodeAt(this.lookupOffset(r)) === t
                : this.tokenType === 9 && this.source.charCodeAt(this.tokenStart) === t;
        }
        skip(t) {
            let r = this.tokenIndex + t;
            r < this.tokenCount
                ? ((this.tokenIndex = r),
                  (this.tokenStart = this.offsetAndType[r - 1] & ne),
                  (r = this.offsetAndType[r]),
                  (this.tokenType = r >> we),
                  (this.tokenEnd = r & ne))
                : ((this.tokenIndex = this.tokenCount), this.next());
        }
        next() {
            let t = this.tokenIndex + 1;
            t < this.tokenCount
                ? ((this.tokenIndex = t),
                  (this.tokenStart = this.tokenEnd),
                  (t = this.offsetAndType[t]),
                  (this.tokenType = t >> we),
                  (this.tokenEnd = t & ne))
                : ((this.eof = !0),
                  (this.tokenIndex = this.tokenCount),
                  (this.tokenType = 0),
                  (this.tokenStart = this.tokenEnd = this.source.length));
        }
        skipSC() {
            for (; this.tokenType === 13 || this.tokenType === 25; ) this.next();
        }
        skipUntilBalanced(t, r) {
            let n = t,
                o,
                i;
            e: for (; n < this.tokenCount; n++) {
                if (((o = this.balance[n]), o < t)) break e;
                switch (
                    ((i = n > 0 ? this.offsetAndType[n - 1] & ne : this.firstCharOffset),
                    r(this.source.charCodeAt(i)))
                ) {
                    case 1:
                        break e;
                    case 2:
                        n++;
                        break e;
                    default:
                        this.balance[o] === n && (n = o);
                }
            }
            this.skip(n - this.tokenIndex);
        }
        forEachToken(t) {
            for (let r = 0, n = this.firstCharOffset; r < this.tokenCount; r++) {
                let o = n,
                    i = this.offsetAndType[r],
                    s = i & ne,
                    u = i >> we;
                (n = s), t(u, o, s, r);
            }
        }
        dump() {
            let t = new Array(this.tokenCount);
            return (
                this.forEachToken((r, n, o, i) => {
                    t[i] = {
                        idx: i,
                        type: Fe[r],
                        chunk: this.source.substring(n, o),
                        balance: this.balance[i],
                    };
                }),
                t
            );
        }
    };
function ve(e, t) {
    function r(p) {
        return p < u ? e.charCodeAt(p) : 0;
    }
    function n() {
        if (((a = Te(e, a)), ze(r(a), r(a + 1), r(a + 2)))) {
            (l = 12), (a = tt(e, a));
            return;
        }
        if (r(a) === 37) {
            (l = 11), a++;
            return;
        }
        l = 10;
    }
    function o() {
        let p = a;
        if (((a = tt(e, a)), ge(e, p, a, 'url') && r(a) === 40)) {
            if (((a = et(e, a + 1)), r(a) === 34 || r(a) === 39)) {
                (l = 2), (a = p + 4);
                return;
            }
            s();
            return;
        }
        if (r(a) === 40) {
            (l = 2), a++;
            return;
        }
        l = 1;
    }
    function i(p) {
        for (p || (p = r(a++)), l = 5; a < e.length; a++) {
            let m = e.charCodeAt(a);
            switch (St(m)) {
                case p:
                    a++;
                    return;
                case Je:
                    if (Ze(m)) {
                        (a += Ct(e, a, m)), (l = 6);
                        return;
                    }
                    break;
                case 92:
                    if (a === e.length - 1) break;
                    let f = r(a + 1);
                    Ze(f) ? (a += Ct(e, a + 1, f)) : $(m, f) && (a = se(e, a) - 1);
                    break;
            }
        }
    }
    function s() {
        for (l = 7, a = et(e, a); a < e.length; a++) {
            let p = e.charCodeAt(a);
            switch (St(p)) {
                case 41:
                    a++;
                    return;
                case Je:
                    if (((a = et(e, a)), r(a) === 41 || a >= e.length)) {
                        a < e.length && a++;
                        return;
                    }
                    (a = At(e, a)), (l = 8);
                    return;
                case 34:
                case 39:
                case 40:
                case or:
                    (a = At(e, a)), (l = 8);
                    return;
                case 92:
                    if ($(p, r(a + 1))) {
                        a = se(e, a) - 1;
                        break;
                    }
                    (a = At(e, a)), (l = 8);
                    return;
            }
        }
    }
    e = String(e || '');
    let u = e.length,
        c = wt(r(0)),
        a = c,
        l;
    for (; a < u; ) {
        let p = e.charCodeAt(a);
        switch (St(p)) {
            case Je:
                (l = 13), (a = et(e, a + 1));
                break;
            case 34:
                i();
                break;
            case 35:
                Ne(r(a + 1)) || $(r(a + 1), r(a + 2))
                    ? ((l = 4), (a = tt(e, a + 1)))
                    : ((l = 9), a++);
                break;
            case 39:
                i();
                break;
            case 40:
                (l = 21), a++;
                break;
            case 41:
                (l = 22), a++;
                break;
            case 43:
                kt(p, r(a + 1), r(a + 2)) ? n() : ((l = 9), a++);
                break;
            case 44:
                (l = 18), a++;
                break;
            case 45:
                kt(p, r(a + 1), r(a + 2))
                    ? n()
                    : r(a + 1) === 45 && r(a + 2) === 62
                      ? ((l = 15), (a = a + 3))
                      : ze(p, r(a + 1), r(a + 2))
                        ? o()
                        : ((l = 9), a++);
                break;
            case 46:
                kt(p, r(a + 1), r(a + 2)) ? n() : ((l = 9), a++);
                break;
            case 47:
                r(a + 1) === 42
                    ? ((l = 25), (a = e.indexOf('*/', a + 2)), (a = a === -1 ? e.length : a + 2))
                    : ((l = 9), a++);
                break;
            case 58:
                (l = 16), a++;
                break;
            case 59:
                (l = 17), a++;
                break;
            case 60:
                r(a + 1) === 33 && r(a + 2) === 45 && r(a + 3) === 45
                    ? ((l = 14), (a = a + 4))
                    : ((l = 9), a++);
                break;
            case 64:
                ze(r(a + 1), r(a + 2), r(a + 3)) ? ((l = 3), (a = tt(e, a + 1))) : ((l = 9), a++);
                break;
            case 91:
                (l = 19), a++;
                break;
            case 92:
                $(p, r(a + 1)) ? o() : ((l = 9), a++);
                break;
            case 93:
                (l = 20), a++;
                break;
            case 123:
                (l = 23), a++;
                break;
            case 125:
                (l = 24), a++;
                break;
            case nr:
                n();
                break;
            case vt:
                o();
                break;
            default:
                (l = 9), a++;
        }
        t(l, c, (c = a));
    }
}
var _e = null,
    D = class {
        static createItem(t) {
            return { prev: null, next: null, data: t };
        }
        constructor() {
            (this.head = null), (this.tail = null), (this.cursor = null);
        }
        createItem(t) {
            return D.createItem(t);
        }
        allocateCursor(t, r) {
            let n;
            return (
                _e !== null
                    ? ((n = _e),
                      (_e = _e.cursor),
                      (n.prev = t),
                      (n.next = r),
                      (n.cursor = this.cursor))
                    : (n = { prev: t, next: r, cursor: this.cursor }),
                (this.cursor = n),
                n
            );
        }
        releaseCursor() {
            let { cursor: t } = this;
            (this.cursor = t.cursor), (t.prev = null), (t.next = null), (t.cursor = _e), (_e = t);
        }
        updateCursors(t, r, n, o) {
            let { cursor: i } = this;
            for (; i !== null; )
                i.prev === t && (i.prev = r), i.next === n && (i.next = o), (i = i.cursor);
        }
        *[Symbol.iterator]() {
            for (let t = this.head; t !== null; t = t.next) yield t.data;
        }
        get size() {
            let t = 0;
            for (let r = this.head; r !== null; r = r.next) t++;
            return t;
        }
        get isEmpty() {
            return this.head === null;
        }
        get first() {
            return this.head && this.head.data;
        }
        get last() {
            return this.tail && this.tail.data;
        }
        fromArray(t) {
            let r = null;
            this.head = null;
            for (let n of t) {
                let o = D.createItem(n);
                r !== null ? (r.next = o) : (this.head = o), (o.prev = r), (r = o);
            }
            return (this.tail = r), this;
        }
        toArray() {
            return [...this];
        }
        toJSON() {
            return [...this];
        }
        forEach(t, r = this) {
            let n = this.allocateCursor(null, this.head);
            for (; n.next !== null; ) {
                let o = n.next;
                (n.next = o.next), t.call(r, o.data, o, this);
            }
            this.releaseCursor();
        }
        forEachRight(t, r = this) {
            let n = this.allocateCursor(this.tail, null);
            for (; n.prev !== null; ) {
                let o = n.prev;
                (n.prev = o.prev), t.call(r, o.data, o, this);
            }
            this.releaseCursor();
        }
        reduce(t, r, n = this) {
            let o = this.allocateCursor(null, this.head),
                i = r,
                s;
            for (; o.next !== null; )
                (s = o.next), (o.next = s.next), (i = t.call(n, i, s.data, s, this));
            return this.releaseCursor(), i;
        }
        reduceRight(t, r, n = this) {
            let o = this.allocateCursor(this.tail, null),
                i = r,
                s;
            for (; o.prev !== null; )
                (s = o.prev), (o.prev = s.prev), (i = t.call(n, i, s.data, s, this));
            return this.releaseCursor(), i;
        }
        some(t, r = this) {
            for (let n = this.head; n !== null; n = n.next)
                if (t.call(r, n.data, n, this)) return !0;
            return !1;
        }
        map(t, r = this) {
            let n = new D();
            for (let o = this.head; o !== null; o = o.next)
                n.appendData(t.call(r, o.data, o, this));
            return n;
        }
        filter(t, r = this) {
            let n = new D();
            for (let o = this.head; o !== null; o = o.next)
                t.call(r, o.data, o, this) && n.appendData(o.data);
            return n;
        }
        nextUntil(t, r, n = this) {
            if (t === null) return;
            let o = this.allocateCursor(null, t);
            for (; o.next !== null; ) {
                let i = o.next;
                if (((o.next = i.next), r.call(n, i.data, i, this))) break;
            }
            this.releaseCursor();
        }
        prevUntil(t, r, n = this) {
            if (t === null) return;
            let o = this.allocateCursor(t, null);
            for (; o.prev !== null; ) {
                let i = o.prev;
                if (((o.prev = i.prev), r.call(n, i.data, i, this))) break;
            }
            this.releaseCursor();
        }
        clear() {
            (this.head = null), (this.tail = null);
        }
        copy() {
            let t = new D();
            for (let r of this) t.appendData(r);
            return t;
        }
        prepend(t) {
            return (
                this.updateCursors(null, t, this.head, t),
                this.head !== null ? ((this.head.prev = t), (t.next = this.head)) : (this.tail = t),
                (this.head = t),
                this
            );
        }
        prependData(t) {
            return this.prepend(D.createItem(t));
        }
        append(t) {
            return this.insert(t);
        }
        appendData(t) {
            return this.insert(D.createItem(t));
        }
        insert(t, r = null) {
            if (r !== null)
                if ((this.updateCursors(r.prev, t, r, t), r.prev === null)) {
                    if (this.head !== r) throw new Error("before doesn't belong to list");
                    (this.head = t), (r.prev = t), (t.next = r), this.updateCursors(null, t);
                } else (r.prev.next = t), (t.prev = r.prev), (r.prev = t), (t.next = r);
            else
                this.updateCursors(this.tail, t, null, t),
                    this.tail !== null
                        ? ((this.tail.next = t), (t.prev = this.tail))
                        : (this.head = t),
                    (this.tail = t);
            return this;
        }
        insertData(t, r) {
            return this.insert(D.createItem(t), r);
        }
        remove(t) {
            if ((this.updateCursors(t, t.prev, t, t.next), t.prev !== null)) t.prev.next = t.next;
            else {
                if (this.head !== t) throw new Error("item doesn't belong to list");
                this.head = t.next;
            }
            if (t.next !== null) t.next.prev = t.prev;
            else {
                if (this.tail !== t) throw new Error("item doesn't belong to list");
                this.tail = t.prev;
            }
            return (t.prev = null), (t.next = null), t;
        }
        push(t) {
            this.insert(D.createItem(t));
        }
        pop() {
            return this.tail !== null ? this.remove(this.tail) : null;
        }
        unshift(t) {
            this.prepend(D.createItem(t));
        }
        shift() {
            return this.head !== null ? this.remove(this.head) : null;
        }
        prependList(t) {
            return this.insertList(t, this.head);
        }
        appendList(t) {
            return this.insertList(t);
        }
        insertList(t, r) {
            return t.head === null
                ? this
                : (r != null
                      ? (this.updateCursors(r.prev, t.tail, r, t.head),
                        r.prev !== null
                            ? ((r.prev.next = t.head), (t.head.prev = r.prev))
                            : (this.head = t.head),
                        (r.prev = t.tail),
                        (t.tail.next = r))
                      : (this.updateCursors(this.tail, t.tail, null, t.head),
                        this.tail !== null
                            ? ((this.tail.next = t.head), (t.head.prev = this.tail))
                            : (this.head = t.head),
                        (this.tail = t.tail)),
                  (t.head = null),
                  (t.tail = null),
                  this);
        }
        replace(t, r) {
            'head' in r ? this.insertList(r, t) : this.insert(r, t), this.remove(t);
        }
    };
function Ee(e, t) {
    let r = Object.create(SyntaxError.prototype),
        n = new Error();
    return Object.assign(r, {
        name: e,
        message: t,
        get stack() {
            return (n.stack || '').replace(
                /^(.+\n){1,3}/,
                `${e}: ${t}
`,
            );
        },
    });
}
var ar = 100,
    Ho = 60,
    Yo = '    ';
function Go({ source: e, line: t, column: r }, n) {
    function o(l, p) {
        return i.slice(l, p).map((m, f) => String(l + f + 1).padStart(c) + ' |' + m).join(`
`);
    }
    let i = e.split(/\r\n?|\n|\f/),
        s = Math.max(1, t - n) - 1,
        u = Math.min(t + n, i.length + 1),
        c = Math.max(4, String(u).length) + 1,
        a = 0;
    (r += (Yo.length - 1) * (i[t - 1].substr(0, r - 1).match(/\t/g) || []).length),
        r > ar && ((a = r - Ho + 3), (r = Ho - 2));
    for (let l = s; l <= u; l++)
        l >= 0 &&
            l < i.length &&
            ((i[l] = i[l].replace(/\t/g, Yo)),
            (i[l] =
                (a > 0 && i[l].length > a ? '\u2026' : '') +
                i[l].substr(a, ar - 2) +
                (i[l].length > a + ar - 1 ? '\u2026' : '')));
    return [o(s, t), new Array(r + c + 2).join('-') + '^', o(t, u)].filter(Boolean).join(`
`);
}
function sr(e, t, r, n, o) {
    return Object.assign(Ee('SyntaxError', e), {
        source: t,
        offset: r,
        line: n,
        column: o,
        sourceFragment(s) {
            return Go({ source: t, line: n, column: o }, isNaN(s) ? 0 : s);
        },
        get formattedMessage() {
            return (
                `Parse error: ${e}
` + Go({ source: t, line: n, column: o }, 2)
            );
        },
    });
}
function Vo(e) {
    let t = this.createList(),
        r = !1,
        n = { recognizer: e };
    for (; !this.eof; ) {
        switch (this.tokenType) {
            case 25:
                this.next();
                continue;
            case 13:
                (r = !0), this.next();
                continue;
        }
        let o = e.getNode.call(this, n);
        if (o === void 0) break;
        r && (e.onWhiteSpace && e.onWhiteSpace.call(this, o, t, n), (r = !1)), t.push(o);
    }
    return r && e.onWhiteSpace && e.onWhiteSpace.call(this, null, t, n), t;
}
var Ko = () => {},
    gs = 33,
    bs = 35,
    lr = 59,
    Qo = 123,
    Xo = 0;
function xs(e) {
    return function () {
        return this[e]();
    };
}
function cr(e) {
    let t = Object.create(null);
    for (let r in e) {
        let n = e[r],
            o = n.parse || n;
        o && (t[r] = o);
    }
    return t;
}
function ys(e) {
    let t = {
        context: Object.create(null),
        scope: Object.assign(Object.create(null), e.scope),
        atrule: cr(e.atrule),
        pseudo: cr(e.pseudo),
        node: cr(e.node),
    };
    for (let r in e.parseContext)
        switch (typeof e.parseContext[r]) {
            case 'function':
                t.context[r] = e.parseContext[r];
                break;
            case 'string':
                t.context[r] = xs(e.parseContext[r]);
                break;
        }
    return { config: t, ...t, ...t.node };
}
function $o(e) {
    let t = '',
        r = '<unknown>',
        n = !1,
        o = Ko,
        i = !1,
        s = new Tt(),
        u = Object.assign(new rt(), ys(e || {}), {
            parseAtrulePrelude: !0,
            parseRulePrelude: !0,
            parseValue: !0,
            parseCustomProperty: !1,
            readSequence: Vo,
            consumeUntilBalanceEnd: () => 0,
            consumeUntilLeftCurlyBracket(a) {
                return a === Qo ? 1 : 0;
            },
            consumeUntilLeftCurlyBracketOrSemicolon(a) {
                return a === Qo || a === lr ? 1 : 0;
            },
            consumeUntilExclamationMarkOrSemicolon(a) {
                return a === gs || a === lr ? 1 : 0;
            },
            consumeUntilSemicolonIncluded(a) {
                return a === lr ? 2 : 0;
            },
            createList() {
                return new D();
            },
            createSingleNodeList(a) {
                return new D().appendData(a);
            },
            getFirstListNode(a) {
                return a && a.first;
            },
            getLastListNode(a) {
                return a && a.last;
            },
            parseWithFallback(a, l) {
                let p = this.tokenIndex;
                try {
                    return a.call(this);
                } catch (m) {
                    if (i) throw m;
                    let f = l.call(this, p);
                    return (i = !0), o(m, f), (i = !1), f;
                }
            },
            lookupNonWSType(a) {
                let l;
                do if (((l = this.lookupType(a++)), l !== 13)) return l;
                while (l !== Xo);
                return Xo;
            },
            charCodeAt(a) {
                return a >= 0 && a < t.length ? t.charCodeAt(a) : 0;
            },
            substring(a, l) {
                return t.substring(a, l);
            },
            substrToCursor(a) {
                return this.source.substring(a, this.tokenStart);
            },
            cmpChar(a, l) {
                return de(t, a, l);
            },
            cmpStr(a, l, p) {
                return ge(t, a, l, p);
            },
            consume(a) {
                let l = this.tokenStart;
                return this.eat(a), this.substrToCursor(l);
            },
            consumeFunctionName() {
                let a = t.substring(this.tokenStart, this.tokenEnd - 1);
                return this.eat(2), a;
            },
            consumeNumber(a) {
                let l = t.substring(this.tokenStart, Te(t, this.tokenStart));
                return this.eat(a), l;
            },
            eat(a) {
                if (this.tokenType !== a) {
                    let l = Fe[a]
                            .slice(0, -6)
                            .replace(/-/g, ' ')
                            .replace(/^./, (f) => f.toUpperCase()),
                        p = `${/[[\](){}]/.test(l) ? `"${l}"` : l} is expected`,
                        m = this.tokenStart;
                    switch (a) {
                        case 1:
                            this.tokenType === 2 || this.tokenType === 7
                                ? ((m = this.tokenEnd - 1),
                                  (p = 'Identifier is expected but function found'))
                                : (p = 'Identifier is expected');
                            break;
                        case 4:
                            this.isDelim(bs) && (this.next(), m++, (p = 'Name is expected'));
                            break;
                        case 11:
                            this.tokenType === 10 &&
                                ((m = this.tokenEnd), (p = 'Percent sign is expected'));
                            break;
                    }
                    this.error(p, m);
                }
                this.next();
            },
            eatIdent(a) {
                (this.tokenType !== 1 || this.lookupValue(0, a) === !1) &&
                    this.error(`Identifier "${a}" is expected`),
                    this.next();
            },
            eatDelim(a) {
                this.isDelim(a) || this.error(`Delim "${String.fromCharCode(a)}" is expected`),
                    this.next();
            },
            getLocation(a, l) {
                return n ? s.getLocationRange(a, l, r) : null;
            },
            getLocationFromList(a) {
                if (n) {
                    let l = this.getFirstListNode(a),
                        p = this.getLastListNode(a);
                    return s.getLocationRange(
                        l !== null ? l.loc.start.offset - s.startOffset : this.tokenStart,
                        p !== null ? p.loc.end.offset - s.startOffset : this.tokenStart,
                        r,
                    );
                }
                return null;
            },
            error(a, l) {
                let p =
                    typeof l < 'u' && l < t.length
                        ? s.getLocation(l)
                        : this.eof
                          ? s.getLocation(qo(t, t.length - 1))
                          : s.getLocation(this.tokenStart);
                throw new sr(a || 'Unexpected input', t, p.offset, p.line, p.column);
            },
        });
    return Object.assign(
        function (a, l) {
            (t = a),
                (l = l || {}),
                u.setSource(t, ve),
                s.setSource(t, l.offset, l.line, l.column),
                (r = l.filename || '<unknown>'),
                (n = Boolean(l.positions)),
                (o = typeof l.onParseError == 'function' ? l.onParseError : Ko),
                (i = !1),
                (u.parseAtrulePrelude =
                    'parseAtrulePrelude' in l ? Boolean(l.parseAtrulePrelude) : !0),
                (u.parseRulePrelude = 'parseRulePrelude' in l ? Boolean(l.parseRulePrelude) : !0),
                (u.parseValue = 'parseValue' in l ? Boolean(l.parseValue) : !0),
                (u.parseCustomProperty =
                    'parseCustomProperty' in l ? Boolean(l.parseCustomProperty) : !1);
            let { context: p = 'default', onComment: m } = l;
            if (!(p in u.context)) throw new Error('Unknown context `' + p + '`');
            typeof m == 'function' &&
                u.forEachToken((P, te, X) => {
                    if (P === 25) {
                        let S = u.getLocation(te, X),
                            R = ge(t, X - 2, X, '*/') ? t.slice(te + 2, X - 2) : t.slice(te + 2, X);
                        m(R, S);
                    }
                });
            let f = u.context[p].call(u, l);
            return u.eof || u.error(), f;
        },
        { SyntaxError: sr, config: u.config },
    );
}
var xi = ls(gi(), 1),
    bi = new Set(['Atrule', 'Selector', 'Declaration']);
function yi(e) {
    let t = new xi.SourceMapGenerator(),
        r = { line: 1, column: 0 },
        n = { line: 0, column: 0 },
        o = { line: 1, column: 0 },
        i = { generated: o },
        s = 1,
        u = 0,
        c = !1,
        a = e.node;
    e.node = function (m) {
        if (m.loc && m.loc.start && bi.has(m.type)) {
            let f = m.loc.start.line,
                P = m.loc.start.column - 1;
            (n.line !== f || n.column !== P) &&
                ((n.line = f),
                (n.column = P),
                (r.line = s),
                (r.column = u),
                c && ((c = !1), (r.line !== o.line || r.column !== o.column) && t.addMapping(i)),
                (c = !0),
                t.addMapping({
                    source: m.loc.source,
                    original: n,
                    generated: r,
                }));
        }
        a.call(this, m), c && bi.has(m.type) && ((o.line = s), (o.column = u));
    };
    let l = e.emit;
    e.emit = function (m, f, P) {
        for (let te = 0; te < m.length; te++) m.charCodeAt(te) === 10 ? (s++, (u = 0)) : u++;
        l(m, f, P);
    };
    let p = e.result;
    return (
        (e.result = function () {
            return c && t.addMapping(i), { css: p(), map: t };
        }),
        e
    );
}
var It = {};
b(It, { safe: () => br, spec: () => Us });
var Bs = 43,
    _s = 45,
    gr = (e, t) => {
        if ((e === 9 && (e = t), typeof e == 'string')) {
            let r = e.charCodeAt(0);
            return r > 127 ? 32768 : r << 8;
        }
        return e;
    },
    ki = [
        [1, 1],
        [1, 2],
        [1, 7],
        [1, 8],
        [1, '-'],
        [1, 10],
        [1, 11],
        [1, 12],
        [1, 15],
        [1, 21],
        [3, 1],
        [3, 2],
        [3, 7],
        [3, 8],
        [3, '-'],
        [3, 10],
        [3, 11],
        [3, 12],
        [3, 15],
        [4, 1],
        [4, 2],
        [4, 7],
        [4, 8],
        [4, '-'],
        [4, 10],
        [4, 11],
        [4, 12],
        [4, 15],
        [12, 1],
        [12, 2],
        [12, 7],
        [12, 8],
        [12, '-'],
        [12, 10],
        [12, 11],
        [12, 12],
        [12, 15],
        ['#', 1],
        ['#', 2],
        ['#', 7],
        ['#', 8],
        ['#', '-'],
        ['#', 10],
        ['#', 11],
        ['#', 12],
        ['#', 15],
        ['-', 1],
        ['-', 2],
        ['-', 7],
        ['-', 8],
        ['-', '-'],
        ['-', 10],
        ['-', 11],
        ['-', 12],
        ['-', 15],
        [10, 1],
        [10, 2],
        [10, 7],
        [10, 8],
        [10, 10],
        [10, 11],
        [10, 12],
        [10, '%'],
        [10, 15],
        ['@', 1],
        ['@', 2],
        ['@', 7],
        ['@', 8],
        ['@', '-'],
        ['@', 15],
        ['.', 10],
        ['.', 11],
        ['.', 12],
        ['+', 10],
        ['+', 11],
        ['+', 12],
        ['/', '*'],
    ],
    qs = ki.concat([
        [1, 4],
        [12, 4],
        [4, 4],
        [3, 21],
        [3, 5],
        [3, 16],
        [11, 11],
        [11, 12],
        [11, 2],
        [11, '-'],
        [22, 1],
        [22, 2],
        [22, 11],
        [22, 12],
        [22, 4],
        [22, '-'],
    ]);
function wi(e) {
    let t = new Set(e.map(([r, n]) => (gr(r) << 16) | gr(n)));
    return function (r, n, o) {
        let i = gr(n, o),
            s = o.charCodeAt(0);
        return (
            ((s === _s && n !== 1 && n !== 2 && n !== 15) || s === Bs
                ? t.has((r << 16) | (s << 8))
                : t.has((r << 16) | i)) && this.emit(' ', 13, !0),
            i
        );
    };
}
var Us = wi(ki),
    br = wi(qs);
var js = 92;
function Ws(e, t) {
    if (typeof t == 'function') {
        let r = null;
        e.children.forEach((n) => {
            r !== null && t.call(this, r), this.node(n), (r = n);
        });
        return;
    }
    e.children.forEach(this.node, this);
}
function Hs(e) {
    ve(e, (t, r, n) => {
        this.token(t, e.slice(r, n));
    });
}
function vi(e) {
    let t = new Map();
    for (let r in e.node) {
        let n = e.node[r];
        typeof (n.generate || n) == 'function' && t.set(r, n.generate || n);
    }
    return function (r, n) {
        let o = '',
            i = 0,
            s = {
                node(c) {
                    if (t.has(c.type)) t.get(c.type).call(u, c);
                    else throw new Error('Unknown node type: ' + c.type);
                },
                tokenBefore: br,
                token(c, a) {
                    (i = this.tokenBefore(i, c, a)),
                        this.emit(a, c, !1),
                        c === 9 &&
                            a.charCodeAt(0) === js &&
                            this.emit(
                                `
`,
                                13,
                                !0,
                            );
                },
                emit(c) {
                    o += c;
                },
                result() {
                    return o;
                },
            };
        n &&
            (typeof n.decorator == 'function' && (s = n.decorator(s)),
            n.sourceMap && (s = yi(s)),
            n.mode in It && (s.tokenBefore = It[n.mode]));
        let u = {
            node: (c) => s.node(c),
            children: Ws,
            token: (c, a) => s.token(c, a),
            tokenize: Hs,
        };
        return s.node(r), s.result();
    };
}
function Si(e) {
    return {
        fromPlainObject(t) {
            return (
                e(t, {
                    enter(r) {
                        r.children &&
                            !(r.children instanceof D) &&
                            (r.children = new D().fromArray(r.children));
                    },
                }),
                t
            );
        },
        toPlainObject(t) {
            return (
                e(t, {
                    leave(r) {
                        r.children &&
                            r.children instanceof D &&
                            (r.children = r.children.toArray());
                    },
                }),
                t
            );
        },
    };
}
var { hasOwnProperty: xr } = Object.prototype,
    it = function () {};
function Ci(e) {
    return typeof e == 'function' ? e : it;
}
function Ai(e, t) {
    return function (r, n, o) {
        r.type === t && e.call(this, r, n, o);
    };
}
function Ys(e, t) {
    let r = t.structure,
        n = [];
    for (let o in r) {
        if (xr.call(r, o) === !1) continue;
        let i = r[o],
            s = { name: o, type: !1, nullable: !1 };
        Array.isArray(i) || (i = [i]);
        for (let u of i)
            u === null
                ? (s.nullable = !0)
                : typeof u == 'string'
                  ? (s.type = 'node')
                  : Array.isArray(u) && (s.type = 'list');
        s.type && n.push(s);
    }
    return n.length ? { context: t.walkContext, fields: n } : null;
}
function Gs(e) {
    let t = {};
    for (let r in e.node)
        if (xr.call(e.node, r)) {
            let n = e.node[r];
            if (!n.structure)
                throw new Error('Missed `structure` field in `' + r + '` node type definition');
            t[r] = Ys(r, n);
        }
    return t;
}
function Ti(e, t) {
    let r = e.fields.slice(),
        n = e.context,
        o = typeof n == 'string';
    return (
        t && r.reverse(),
        function (i, s, u, c) {
            let a;
            o && ((a = s[n]), (s[n] = i));
            for (let l of r) {
                let p = i[l.name];
                if (!l.nullable || p) {
                    if (l.type === 'list') {
                        if (t ? p.reduceRight(c, !1) : p.reduce(c, !1)) return !0;
                    } else if (u(p)) return !0;
                }
            }
            o && (s[n] = a);
        }
    );
}
function Ei({ StyleSheet: e, Atrule: t, Rule: r, Block: n, DeclarationList: o }) {
    return {
        Atrule: { StyleSheet: e, Atrule: t, Rule: r, Block: n },
        Rule: { StyleSheet: e, Atrule: t, Rule: r, Block: n },
        Declaration: {
            StyleSheet: e,
            Atrule: t,
            Rule: r,
            Block: n,
            DeclarationList: o,
        },
    };
}
function Li(e) {
    let t = Gs(e),
        r = {},
        n = {},
        o = Symbol('break-walk'),
        i = Symbol('skip-node');
    for (let a in t)
        xr.call(t, a) && t[a] !== null && ((r[a] = Ti(t[a], !1)), (n[a] = Ti(t[a], !0)));
    let s = Ei(r),
        u = Ei(n),
        c = function (a, l) {
            function p(S, R, ke) {
                let z = m.call(X, S, R, ke);
                return z === o
                    ? !0
                    : z === i
                      ? !1
                      : !!(
                            (P.hasOwnProperty(S.type) && P[S.type](S, X, p, te)) ||
                            f.call(X, S, R, ke) === o
                        );
            }
            let m = it,
                f = it,
                P = r,
                te = (S, R, ke, z) => S || p(R, ke, z),
                X = {
                    break: o,
                    skip: i,
                    root: a,
                    stylesheet: null,
                    atrule: null,
                    atrulePrelude: null,
                    rule: null,
                    selector: null,
                    block: null,
                    declaration: null,
                    function: null,
                };
            if (typeof l == 'function') m = l;
            else if (l && ((m = Ci(l.enter)), (f = Ci(l.leave)), l.reverse && (P = n), l.visit)) {
                if (s.hasOwnProperty(l.visit)) P = l.reverse ? u[l.visit] : s[l.visit];
                else if (!t.hasOwnProperty(l.visit))
                    throw new Error(
                        'Bad value `' +
                            l.visit +
                            '` for `visit` option (should be: ' +
                            Object.keys(t).sort().join(', ') +
                            ')',
                    );
                (m = Ai(m, l.visit)), (f = Ai(f, l.visit));
            }
            if (m === it && f === it)
                throw new Error(
                    "Neither `enter` nor `leave` walker handler is set or both aren't a function",
                );
            p(a);
        };
    return (
        (c.break = o),
        (c.skip = i),
        (c.find = function (a, l) {
            let p = null;
            return (
                c(a, function (m, f, P) {
                    if (l.call(this, m, f, P)) return (p = m), o;
                }),
                p
            );
        }),
        (c.findLast = function (a, l) {
            let p = null;
            return (
                c(a, {
                    reverse: !0,
                    enter(m, f, P) {
                        if (l.call(this, m, f, P)) return (p = m), o;
                    },
                }),
                p
            );
        }),
        (c.findAll = function (a, l) {
            let p = [];
            return (
                c(a, function (m, f, P) {
                    l.call(this, m, f, P) && p.push(m);
                }),
                p
            );
        }),
        c
    );
}
function Vs(e) {
    return e;
}
function Ks(e) {
    let { min: t, max: r, comma: n } = e;
    return t === 0 && r === 0
        ? n
            ? '#?'
            : '*'
        : t === 0 && r === 1
          ? '?'
          : t === 1 && r === 0
            ? n
                ? '#'
                : '+'
            : t === 1 && r === 1
              ? ''
              : (n ? '#' : '') +
                (t === r ? '{' + t + '}' : '{' + t + ',' + (r !== 0 ? r : '') + '}');
}
function Qs(e) {
    switch (e.type) {
        case 'Range':
            return (
                ' [' +
                (e.min === null ? '-\u221E' : e.min) +
                ',' +
                (e.max === null ? '\u221E' : e.max) +
                ']'
            );
        default:
            throw new Error('Unknown node type `' + e.type + '`');
    }
}
function Xs(e, t, r, n) {
    let o = e.combinator === ' ' || n ? e.combinator : ' ' + e.combinator + ' ',
        i = e.terms.map((s) => yr(s, t, r, n)).join(o);
    return e.explicit || r ? (n || i[0] === ',' ? '[' : '[ ') + i + (n ? ']' : ' ]') : i;
}
function yr(e, t, r, n) {
    let o;
    switch (e.type) {
        case 'Group':
            o = Xs(e, t, r, n) + (e.disallowEmpty ? '!' : '');
            break;
        case 'Multiplier':
            return yr(e.term, t, r, n) + t(Ks(e), e);
        case 'Type':
            o = '<' + e.name + (e.opts ? t(Qs(e.opts), e.opts) : '') + '>';
            break;
        case 'Property':
            o = "<'" + e.name + "'>";
            break;
        case 'Keyword':
            o = e.name;
            break;
        case 'AtKeyword':
            o = '@' + e.name;
            break;
        case 'Function':
            o = e.name + '(';
            break;
        case 'String':
        case 'Token':
            o = e.value;
            break;
        case 'Comma':
            o = ',';
            break;
        default:
            throw new Error('Unknown node type `' + e.type + '`');
    }
    return t(o, e);
}
function Pe(e, t) {
    let r = Vs,
        n = !1,
        o = !1;
    return (
        typeof t == 'function'
            ? (r = t)
            : t &&
              ((n = Boolean(t.forceBraces)),
              (o = Boolean(t.compact)),
              typeof t.decorate == 'function' && (r = t.decorate)),
        yr(e, r, n, o)
    );
}
var Pi = { offset: 0, line: 1, column: 1 };
function $s(e, t) {
    let r = e.tokens,
        n = e.longestMatch,
        o = (n < r.length && r[n].node) || null,
        i = o !== t ? o : null,
        s = 0,
        u = 0,
        c = 0,
        a = '',
        l,
        p;
    for (let m = 0; m < r.length; m++) {
        let f = r[m].value;
        m === n && ((u = f.length), (s = a.length)),
            i !== null && r[m].node === i && (m <= n ? c++ : (c = 0)),
            (a += f);
    }
    return (
        n === r.length || c > 1
            ? ((l = Dt(i || t, 'end') || at(Pi, a)), (p = at(l)))
            : ((l = Dt(i, 'start') || at(Dt(t, 'start') || Pi, a.slice(0, s))),
              (p = Dt(i, 'end') || at(l, a.substr(s, u)))),
        { css: a, mismatchOffset: s, mismatchLength: u, start: l, end: p }
    );
}
function Dt(e, t) {
    let r = e && e.loc && e.loc[t];
    return r ? ('line' in r ? at(r) : r) : null;
}
function at({ offset: e, line: t, column: r }, n) {
    let o = { offset: e, line: t, column: r };
    if (n) {
        let i = n.split(/\n|\r\n?|\f/);
        (o.offset += n.length),
            (o.line += i.length - 1),
            (o.column = i.length === 1 ? o.column + n.length : i.pop().length + 1);
    }
    return o;
}
var Ue = function (e, t) {
        let r = Ee('SyntaxReferenceError', e + (t ? ' `' + t + '`' : ''));
        return (r.reference = t), r;
    },
    Ii = function (e, t, r, n) {
        let o = Ee('SyntaxMatchError', e),
            { css: i, mismatchOffset: s, mismatchLength: u, start: c, end: a } = $s(n, r);
        return (
            (o.rawMessage = e),
            (o.syntax = t ? Pe(t) : '<generic>'),
            (o.css = i),
            (o.mismatchOffset = s),
            (o.mismatchLength = u),
            (o.message =
                e +
                `
  syntax: ` +
                o.syntax +
                `
   value: ` +
                (i || '<empty string>') +
                `
  --------` +
                new Array(o.mismatchOffset + 1).join('-') +
                '^'),
            Object.assign(o, c),
            (o.loc = {
                source: (r && r.loc && r.loc.source) || '<unknown>',
                start: c,
                end: a,
            }),
            o
        );
    };
var Ot = new Map(),
    je = new Map(),
    Nt = 45,
    zt = Zs,
    kr = Js,
    Ym = wr;
function Mt(e, t) {
    return (t = t || 0), e.length - t >= 2 && e.charCodeAt(t) === Nt && e.charCodeAt(t + 1) === Nt;
}
function wr(e, t) {
    if (((t = t || 0), e.length - t >= 3 && e.charCodeAt(t) === Nt && e.charCodeAt(t + 1) !== Nt)) {
        let r = e.indexOf('-', t + 2);
        if (r !== -1) return e.substring(t, r + 1);
    }
    return '';
}
function Zs(e) {
    if (Ot.has(e)) return Ot.get(e);
    let t = e.toLowerCase(),
        r = Ot.get(t);
    if (r === void 0) {
        let n = Mt(t, 0),
            o = n ? '' : wr(t, 0);
        r = Object.freeze({
            basename: t.substr(o.length),
            name: t,
            prefix: o,
            vendor: o,
            custom: n,
        });
    }
    return Ot.set(e, r), r;
}
function Js(e) {
    if (je.has(e)) return je.get(e);
    let t = e,
        r = e[0];
    r === '/'
        ? (r = e[1] === '/' ? '//' : '/')
        : r !== '_' && r !== '*' && r !== '$' && r !== '#' && r !== '+' && r !== '&' && (r = '');
    let n = Mt(t, r.length);
    if (!n && ((t = t.toLowerCase()), je.has(t))) {
        let u = je.get(t);
        return je.set(e, u), u;
    }
    let o = n ? '' : wr(t, r.length),
        i = t.substr(0, r.length + o.length),
        s = Object.freeze({
            basename: t.substr(i.length),
            name: t.substr(r.length),
            hack: r,
            vendor: o,
            prefix: i,
            custom: n,
        });
    return je.set(e, s), s;
}
var Rt = ['initial', 'inherit', 'unset', 'revert', 'revert-layer'];
var lt = 43,
    he = 45,
    vr = 110,
    We = !0,
    tl = !1;
function Cr(e, t) {
    return e !== null && e.type === 9 && e.value.charCodeAt(0) === t;
}
function st(e, t, r) {
    for (; e !== null && (e.type === 13 || e.type === 25); ) e = r(++t);
    return t;
}
function Se(e, t, r, n) {
    if (!e) return 0;
    let o = e.value.charCodeAt(t);
    if (o === lt || o === he) {
        if (r) return 0;
        t++;
    }
    for (; t < e.value.length; t++) if (!B(e.value.charCodeAt(t))) return 0;
    return n + 1;
}
function Sr(e, t, r) {
    let n = !1,
        o = st(e, t, r);
    if (((e = r(o)), e === null)) return t;
    if (e.type !== 10)
        if (Cr(e, lt) || Cr(e, he)) {
            if (((n = !0), (o = st(r(++o), o, r)), (e = r(o)), e === null || e.type !== 10))
                return 0;
        } else return t;
    if (!n) {
        let i = e.value.charCodeAt(0);
        if (i !== lt && i !== he) return 0;
    }
    return Se(e, n ? 0 : 1, n, o);
}
function Ar(e, t) {
    let r = 0;
    if (!e) return 0;
    if (e.type === 10) return Se(e, 0, tl, r);
    if (e.type === 1 && e.value.charCodeAt(0) === he) {
        if (!de(e.value, 1, vr)) return 0;
        switch (e.value.length) {
            case 2:
                return Sr(t(++r), r, t);
            case 3:
                return e.value.charCodeAt(2) !== he
                    ? 0
                    : ((r = st(t(++r), r, t)), (e = t(r)), Se(e, 0, We, r));
            default:
                return e.value.charCodeAt(2) !== he ? 0 : Se(e, 3, We, r);
        }
    } else if (e.type === 1 || (Cr(e, lt) && t(r + 1).type === 1)) {
        if ((e.type !== 1 && (e = t(++r)), e === null || !de(e.value, 0, vr))) return 0;
        switch (e.value.length) {
            case 1:
                return Sr(t(++r), r, t);
            case 2:
                return e.value.charCodeAt(1) !== he
                    ? 0
                    : ((r = st(t(++r), r, t)), (e = t(r)), Se(e, 0, We, r));
            default:
                return e.value.charCodeAt(1) !== he ? 0 : Se(e, 2, We, r);
        }
    } else if (e.type === 12) {
        let n = e.value.charCodeAt(0),
            o = n === lt || n === he ? 1 : 0,
            i = o;
        for (; i < e.value.length && B(e.value.charCodeAt(i)); i++);
        return i === o || !de(e.value, i, vr)
            ? 0
            : i + 1 === e.value.length
              ? Sr(t(++r), r, t)
              : e.value.charCodeAt(i + 1) !== he
                ? 0
                : i + 2 === e.value.length
                  ? ((r = st(t(++r), r, t)), (e = t(r)), Se(e, 0, We, r))
                  : Se(e, i + 2, We, r);
    }
    return 0;
}
var rl = 43,
    Di = 45,
    Oi = 63,
    nl = 117;
function Tr(e, t) {
    return e !== null && e.type === 9 && e.value.charCodeAt(0) === t;
}
function ol(e, t) {
    return e.value.charCodeAt(0) === t;
}
function ct(e, t, r) {
    let n = 0;
    for (let o = t; o < e.value.length; o++) {
        let i = e.value.charCodeAt(o);
        if (i === Di && r && n !== 0) return ct(e, t + n + 1, !1), 6;
        if (!ee(i) || ++n > 6) return 0;
    }
    return n;
}
function Ft(e, t, r) {
    if (!e) return 0;
    for (; Tr(r(t), Oi); ) {
        if (++e > 6) return 0;
        t++;
    }
    return t;
}
function Er(e, t) {
    let r = 0;
    if (e === null || e.type !== 1 || !de(e.value, 0, nl) || ((e = t(++r)), e === null)) return 0;
    if (Tr(e, rl))
        return (
            (e = t(++r)),
            e === null ? 0 : e.type === 1 ? Ft(ct(e, 0, !0), ++r, t) : Tr(e, Oi) ? Ft(1, ++r, t) : 0
        );
    if (e.type === 10) {
        let n = ct(e, 1, !0);
        return n === 0
            ? 0
            : ((e = t(++r)),
              e === null
                  ? r
                  : e.type === 12 || e.type === 10
                    ? !ol(e, Di) || !ct(e, 1, !1)
                        ? 0
                        : r + 1
                    : Ft(n, r, t));
    }
    return e.type === 12 ? Ft(ct(e, 1, !0), ++r, t) : 0;
}
var il = ['calc(', '-moz-calc(', '-webkit-calc('],
    Lr = new Map([
        [2, 22],
        [21, 22],
        [19, 20],
        [23, 24],
    ]);
function le(e, t) {
    return t < e.length ? e.charCodeAt(t) : 0;
}
function Ni(e, t) {
    return ge(e, 0, e.length, t);
}
function zi(e, t) {
    for (let r = 0; r < t.length; r++) if (Ni(e, t[r])) return !0;
    return !1;
}
function Mi(e, t) {
    return t !== e.length - 2 ? !1 : le(e, t) === 92 && B(le(e, t + 1));
}
function Bt(e, t, r) {
    if (e && e.type === 'Range') {
        let n = Number(r !== void 0 && r !== t.length ? t.substr(0, r) : t);
        if (
            isNaN(n) ||
            (e.min !== null && n < e.min && typeof e.min != 'string') ||
            (e.max !== null && n > e.max && typeof e.max != 'string')
        )
            return !0;
    }
    return !1;
}
function al(e, t) {
    let r = 0,
        n = [],
        o = 0;
    e: do {
        switch (e.type) {
            case 24:
            case 22:
            case 20:
                if (e.type !== r) break e;
                if (((r = n.pop()), n.length === 0)) {
                    o++;
                    break e;
                }
                break;
            case 2:
            case 21:
            case 19:
            case 23:
                n.push(r), (r = Lr.get(e.type));
                break;
        }
        o++;
    } while ((e = t(o)));
    return o;
}
function ie(e) {
    return function (t, r, n) {
        return t === null ? 0 : t.type === 2 && zi(t.value, il) ? al(t, r) : e(t, r, n);
    };
}
function N(e) {
    return function (t) {
        return t === null || t.type !== e ? 0 : 1;
    };
}
function sl(e) {
    if (e === null || e.type !== 1) return 0;
    let t = e.value.toLowerCase();
    return zi(t, Rt) || Ni(t, 'default') ? 0 : 1;
}
function ll(e) {
    return e === null || e.type !== 1 || le(e.value, 0) !== 45 || le(e.value, 1) !== 45 ? 0 : 1;
}
function cl(e) {
    if (e === null || e.type !== 4) return 0;
    let t = e.value.length;
    if (t !== 4 && t !== 5 && t !== 7 && t !== 9) return 0;
    for (let r = 1; r < t; r++) if (!ee(le(e.value, r))) return 0;
    return 1;
}
function ul(e) {
    return e === null || e.type !== 4 || !ze(le(e.value, 1), le(e.value, 2), le(e.value, 3))
        ? 0
        : 1;
}
function pl(e, t) {
    if (!e) return 0;
    let r = 0,
        n = [],
        o = 0;
    e: do {
        switch (e.type) {
            case 6:
            case 8:
                break e;
            case 24:
            case 22:
            case 20:
                if (e.type !== r) break e;
                r = n.pop();
                break;
            case 17:
                if (r === 0) break e;
                break;
            case 9:
                if (r === 0 && e.value === '!') break e;
                break;
            case 2:
            case 21:
            case 19:
            case 23:
                n.push(r), (r = Lr.get(e.type));
                break;
        }
        o++;
    } while ((e = t(o)));
    return o;
}
function hl(e, t) {
    if (!e) return 0;
    let r = 0,
        n = [],
        o = 0;
    e: do {
        switch (e.type) {
            case 6:
            case 8:
                break e;
            case 24:
            case 22:
            case 20:
                if (e.type !== r) break e;
                r = n.pop();
                break;
            case 2:
            case 21:
            case 19:
            case 23:
                n.push(r), (r = Lr.get(e.type));
                break;
        }
        o++;
    } while ((e = t(o)));
    return o;
}
function ye(e) {
    return (
        e && (e = new Set(e)),
        function (t, r, n) {
            if (t === null || t.type !== 12) return 0;
            let o = Te(t.value, 0);
            if (e !== null) {
                let i = t.value.indexOf('\\', o),
                    s = i === -1 || !Mi(t.value, i) ? t.value.substr(o) : t.value.substring(o, i);
                if (e.has(s.toLowerCase()) === !1) return 0;
            }
            return Bt(n, t.value, o) ? 0 : 1;
        }
    );
}
function ml(e, t, r) {
    return e === null || e.type !== 11 || Bt(r, e.value, e.value.length - 1) ? 0 : 1;
}
function Ri(e) {
    return (
        typeof e != 'function' &&
            (e = function () {
                return 0;
            }),
        function (t, r, n) {
            return t !== null && t.type === 10 && Number(t.value) === 0 ? 1 : e(t, r, n);
        }
    );
}
function fl(e, t, r) {
    if (e === null) return 0;
    let n = Te(e.value, 0);
    return (!(n === e.value.length) && !Mi(e.value, n)) || Bt(r, e.value, n) ? 0 : 1;
}
function dl(e, t, r) {
    if (e === null || e.type !== 10) return 0;
    let n = le(e.value, 0) === 43 || le(e.value, 0) === 45 ? 1 : 0;
    for (; n < e.value.length; n++) if (!B(le(e.value, n))) return 0;
    return Bt(r, e.value, n) ? 0 : 1;
}
var gl = {
        'ident-token': N(1),
        'function-token': N(2),
        'at-keyword-token': N(3),
        'hash-token': N(4),
        'string-token': N(5),
        'bad-string-token': N(6),
        'url-token': N(7),
        'bad-url-token': N(8),
        'delim-token': N(9),
        'number-token': N(10),
        'percentage-token': N(11),
        'dimension-token': N(12),
        'whitespace-token': N(13),
        'CDO-token': N(14),
        'CDC-token': N(15),
        'colon-token': N(16),
        'semicolon-token': N(17),
        'comma-token': N(18),
        '[-token': N(19),
        ']-token': N(20),
        '(-token': N(21),
        ')-token': N(22),
        '{-token': N(23),
        '}-token': N(24),
    },
    bl = {
        string: N(5),
        ident: N(1),
        percentage: ie(ml),
        zero: Ri(),
        number: ie(fl),
        integer: ie(dl),
        'custom-ident': sl,
        'custom-property-name': ll,
        'hex-color': cl,
        'id-selector': ul,
        'an-plus-b': Ar,
        urange: Er,
        'declaration-value': pl,
        'any-value': hl,
    };
function xl(e) {
    let {
        angle: t,
        decibel: r,
        frequency: n,
        flex: o,
        length: i,
        resolution: s,
        semitones: u,
        time: c,
    } = e || {};
    return {
        dimension: ie(ye(null)),
        angle: ie(ye(t)),
        decibel: ie(ye(r)),
        frequency: ie(ye(n)),
        flex: ie(ye(o)),
        length: ie(Ri(ye(i))),
        resolution: ie(ye(s)),
        semitones: ie(ye(u)),
        time: ie(ye(c)),
    };
}
function Fi(e) {
    return { ...gl, ...bl, ...xl(e) };
}
var _t = {};
b(_t, {
    angle: () => kl,
    decibel: () => Al,
    flex: () => Cl,
    frequency: () => vl,
    length: () => yl,
    resolution: () => Sl,
    semitones: () => Tl,
    time: () => wl,
});
var yl = [
        'cm',
        'mm',
        'q',
        'in',
        'pt',
        'pc',
        'px',
        'em',
        'rem',
        'ex',
        'rex',
        'cap',
        'rcap',
        'ch',
        'rch',
        'ic',
        'ric',
        'lh',
        'rlh',
        'vw',
        'svw',
        'lvw',
        'dvw',
        'vh',
        'svh',
        'lvh',
        'dvh',
        'vi',
        'svi',
        'lvi',
        'dvi',
        'vb',
        'svb',
        'lvb',
        'dvb',
        'vmin',
        'svmin',
        'lvmin',
        'dvmin',
        'vmax',
        'svmax',
        'lvmax',
        'dvmax',
        'cqw',
        'cqh',
        'cqi',
        'cqb',
        'cqmin',
        'cqmax',
    ],
    kl = ['deg', 'grad', 'rad', 'turn'],
    wl = ['s', 'ms'],
    vl = ['hz', 'khz'],
    Sl = ['dpi', 'dpcm', 'dppx', 'x'],
    Cl = ['fr'],
    Al = ['db'],
    Tl = ['st'];
var $i = {};
b($i, {
    SyntaxError: () => qt,
    generate: () => Pe,
    parse: () => Ge,
    walk: () => Vt,
});
function qt(e, t, r) {
    return Object.assign(Ee('SyntaxError', e), {
        input: t,
        offset: r,
        rawMessage: e,
        message:
            e +
            `
  ` +
            t +
            `
--` +
            new Array((r || t.length) + 1).join('-') +
            '^',
    });
}
var El = 9,
    Ll = 10,
    Pl = 12,
    Il = 13,
    Dl = 32,
    Ut = class {
        constructor(t) {
            (this.str = t), (this.pos = 0);
        }
        charCodeAt(t) {
            return t < this.str.length ? this.str.charCodeAt(t) : 0;
        }
        charCode() {
            return this.charCodeAt(this.pos);
        }
        nextCharCode() {
            return this.charCodeAt(this.pos + 1);
        }
        nextNonWsCode(t) {
            return this.charCodeAt(this.findWsEnd(t));
        }
        findWsEnd(t) {
            for (; t < this.str.length; t++) {
                let r = this.str.charCodeAt(t);
                if (r !== Il && r !== Ll && r !== Pl && r !== Dl && r !== El) break;
            }
            return t;
        }
        substringToPos(t) {
            return this.str.substring(this.pos, (this.pos = t));
        }
        eat(t) {
            this.charCode() !== t && this.error('Expect `' + String.fromCharCode(t) + '`'),
                this.pos++;
        }
        peek() {
            return this.pos < this.str.length ? this.str.charAt(this.pos++) : '';
        }
        error(t) {
            throw new qt(t, this.str, this.pos);
        }
    };
var Ol = 9,
    Nl = 10,
    zl = 12,
    Ml = 13,
    Rl = 32,
    Yi = 33,
    Dr = 35,
    Bi = 38,
    jt = 39,
    Gi = 40,
    Fl = 41,
    Vi = 42,
    Or = 43,
    Nr = 44,
    _i = 45,
    zr = 60,
    Ki = 62,
    Ir = 63,
    Bl = 64,
    Gt = 91,
    Mr = 93,
    Wt = 123,
    qi = 124,
    Ui = 125,
    ji = 8734,
    ut = new Uint8Array(128).map((e, t) => (/[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0)),
    Wi = { ' ': 1, '&&': 2, '||': 3, '|': 4 };
function Ht(e) {
    return e.substringToPos(e.findWsEnd(e.pos));
}
function He(e) {
    let t = e.pos;
    for (; t < e.str.length; t++) {
        let r = e.str.charCodeAt(t);
        if (r >= 128 || ut[r] === 0) break;
    }
    return e.pos === t && e.error('Expect a keyword'), e.substringToPos(t);
}
function Yt(e) {
    let t = e.pos;
    for (; t < e.str.length; t++) {
        let r = e.str.charCodeAt(t);
        if (r < 48 || r > 57) break;
    }
    return e.pos === t && e.error('Expect a number'), e.substringToPos(t);
}
function _l(e) {
    let t = e.str.indexOf("'", e.pos + 1);
    return (
        t === -1 && ((e.pos = e.str.length), e.error('Expect an apostrophe')),
        e.substringToPos(t + 1)
    );
}
function Hi(e) {
    let t = null,
        r = null;
    return (
        e.eat(Wt),
        (t = Yt(e)),
        e.charCode() === Nr ? (e.pos++, e.charCode() !== Ui && (r = Yt(e))) : (r = t),
        e.eat(Ui),
        { min: Number(t), max: r ? Number(r) : 0 }
    );
}
function ql(e) {
    let t = null,
        r = !1;
    switch (e.charCode()) {
        case Vi:
            e.pos++, (t = { min: 0, max: 0 });
            break;
        case Or:
            e.pos++, (t = { min: 1, max: 0 });
            break;
        case Ir:
            e.pos++, (t = { min: 0, max: 1 });
            break;
        case Dr:
            e.pos++,
                (r = !0),
                e.charCode() === Wt
                    ? (t = Hi(e))
                    : e.charCode() === Ir
                      ? (e.pos++, (t = { min: 0, max: 0 }))
                      : (t = { min: 1, max: 0 });
            break;
        case Wt:
            t = Hi(e);
            break;
        default:
            return null;
    }
    return { type: 'Multiplier', comma: r, min: t.min, max: t.max, term: null };
}
function Ye(e, t) {
    let r = ql(e);
    return r !== null
        ? ((r.term = t), e.charCode() === Dr && e.charCodeAt(e.pos - 1) === Or ? Ye(e, r) : r)
        : t;
}
function Pr(e) {
    let t = e.peek();
    return t === '' ? null : { type: 'Token', value: t };
}
function Ul(e) {
    let t;
    return (
        e.eat(zr),
        e.eat(jt),
        (t = He(e)),
        e.eat(jt),
        e.eat(Ki),
        Ye(e, { type: 'Property', name: t })
    );
}
function jl(e) {
    let t = null,
        r = null,
        n = 1;
    return (
        e.eat(Gt),
        e.charCode() === _i && (e.peek(), (n = -1)),
        n == -1 && e.charCode() === ji
            ? e.peek()
            : ((t = n * Number(Yt(e))), ut[e.charCode()] !== 0 && (t += He(e))),
        Ht(e),
        e.eat(Nr),
        Ht(e),
        e.charCode() === ji
            ? e.peek()
            : ((n = 1),
              e.charCode() === _i && (e.peek(), (n = -1)),
              (r = n * Number(Yt(e))),
              ut[e.charCode()] !== 0 && (r += He(e))),
        e.eat(Mr),
        { type: 'Range', min: t, max: r }
    );
}
function Wl(e) {
    let t,
        r = null;
    return (
        e.eat(zr),
        (t = He(e)),
        e.charCode() === Gi && e.nextCharCode() === Fl && ((e.pos += 2), (t += '()')),
        e.charCodeAt(e.findWsEnd(e.pos)) === Gt && (Ht(e), (r = jl(e))),
        e.eat(Ki),
        Ye(e, { type: 'Type', name: t, opts: r })
    );
}
function Hl(e) {
    let t = He(e);
    return e.charCode() === Gi
        ? (e.pos++, { type: 'Function', name: t })
        : Ye(e, { type: 'Keyword', name: t });
}
function Yl(e, t) {
    function r(o, i) {
        return {
            type: 'Group',
            terms: o,
            combinator: i,
            disallowEmpty: !1,
            explicit: !1,
        };
    }
    let n;
    for (t = Object.keys(t).sort((o, i) => Wi[o] - Wi[i]); t.length > 0; ) {
        n = t.shift();
        let o = 0,
            i = 0;
        for (; o < e.length; o++) {
            let s = e[o];
            s.type === 'Combinator' &&
                (s.value === n
                    ? (i === -1 && (i = o - 1), e.splice(o, 1), o--)
                    : (i !== -1 &&
                          o - i > 1 &&
                          (e.splice(i, o - i, r(e.slice(i, o), n)), (o = i + 1)),
                      (i = -1)));
        }
        i !== -1 && t.length && e.splice(i, o - i, r(e.slice(i, o), n));
    }
    return n;
}
function Qi(e) {
    let t = [],
        r = {},
        n,
        o = null,
        i = e.pos;
    for (; (n = Vl(e)); )
        n.type !== 'Spaces' &&
            (n.type === 'Combinator'
                ? ((o === null || o.type === 'Combinator') &&
                      ((e.pos = i), e.error('Unexpected combinator')),
                  (r[n.value] = !0))
                : o !== null &&
                  o.type !== 'Combinator' &&
                  ((r[' '] = !0), t.push({ type: 'Combinator', value: ' ' })),
            t.push(n),
            (o = n),
            (i = e.pos));
    return (
        o !== null && o.type === 'Combinator' && ((e.pos -= i), e.error('Unexpected combinator')),
        {
            type: 'Group',
            terms: t,
            combinator: Yl(t, r) || ' ',
            disallowEmpty: !1,
            explicit: !1,
        }
    );
}
function Gl(e) {
    let t;
    return (
        e.eat(Gt),
        (t = Qi(e)),
        e.eat(Mr),
        (t.explicit = !0),
        e.charCode() === Yi && (e.pos++, (t.disallowEmpty = !0)),
        t
    );
}
function Vl(e) {
    let t = e.charCode();
    if (t < 128 && ut[t] === 1) return Hl(e);
    switch (t) {
        case Mr:
            break;
        case Gt:
            return Ye(e, Gl(e));
        case zr:
            return e.nextCharCode() === jt ? Ul(e) : Wl(e);
        case qi:
            return {
                type: 'Combinator',
                value: e.substringToPos(e.pos + (e.nextCharCode() === qi ? 2 : 1)),
            };
        case Bi:
            return e.pos++, e.eat(Bi), { type: 'Combinator', value: '&&' };
        case Nr:
            return e.pos++, { type: 'Comma' };
        case jt:
            return Ye(e, { type: 'String', value: _l(e) });
        case Rl:
        case Ol:
        case Nl:
        case Ml:
        case zl:
            return { type: 'Spaces', value: Ht(e) };
        case Bl:
            return (
                (t = e.nextCharCode()),
                t < 128 && ut[t] === 1 ? (e.pos++, { type: 'AtKeyword', name: He(e) }) : Pr(e)
            );
        case Vi:
        case Or:
        case Ir:
        case Dr:
        case Yi:
            break;
        case Wt:
            if (((t = e.nextCharCode()), t < 48 || t > 57)) return Pr(e);
            break;
        default:
            return Pr(e);
    }
}
function Ge(e) {
    let t = new Ut(e),
        r = Qi(t);
    return (
        t.pos !== e.length && t.error('Unexpected input'),
        r.terms.length === 1 && r.terms[0].type === 'Group' ? r.terms[0] : r
    );
}
var pt = function () {};
function Xi(e) {
    return typeof e == 'function' ? e : pt;
}
function Vt(e, t, r) {
    function n(s) {
        switch ((o.call(r, s), s.type)) {
            case 'Group':
                s.terms.forEach(n);
                break;
            case 'Multiplier':
                n(s.term);
                break;
            case 'Type':
            case 'Property':
            case 'Keyword':
            case 'AtKeyword':
            case 'Function':
            case 'String':
            case 'Token':
            case 'Comma':
                break;
            default:
                throw new Error('Unknown type: ' + s.type);
        }
        i.call(r, s);
    }
    let o = pt,
        i = pt;
    if (
        (typeof t == 'function' ? (o = t) : t && ((o = Xi(t.enter)), (i = Xi(t.leave))),
        o === pt && i === pt)
    )
        throw new Error(
            "Neither `enter` nor `leave` walker handler is set or both aren't a function",
        );
    n(e, r);
}
var Kl = {
    decorator(e) {
        let t = [],
            r = null;
        return {
            ...e,
            node(n) {
                let o = r;
                (r = n), e.node.call(this, n), (r = o);
            },
            emit(n, o, i) {
                t.push({ type: o, value: n, node: i ? null : r });
            },
            result() {
                return t;
            },
        };
    },
};
function Ql(e) {
    let t = [];
    return ve(e, (r, n, o) => t.push({ type: r, value: e.slice(n, o), node: null })), t;
}
function Zi(e, t) {
    return typeof e == 'string' ? Ql(e) : t.generate(e, Kl);
}
var C = { type: 'Match' },
    L = { type: 'Mismatch' },
    Kt = { type: 'DisallowEmpty' },
    Xl = 40,
    $l = 41;
function Z(e, t, r) {
    return (t === C && r === L) || (e === C && t === C && r === C)
        ? e
        : (e.type === 'If' && e.else === L && t === C && ((t = e.then), (e = e.match)),
          { type: 'If', match: e, then: t, else: r });
}
function ea(e) {
    return e.length > 2 && e.charCodeAt(e.length - 2) === Xl && e.charCodeAt(e.length - 1) === $l;
}
function Ji(e) {
    return (
        e.type === 'Keyword' ||
        e.type === 'AtKeyword' ||
        e.type === 'Function' ||
        (e.type === 'Type' && ea(e.name))
    );
}
function Rr(e, t, r) {
    switch (e) {
        case ' ': {
            let n = C;
            for (let o = t.length - 1; o >= 0; o--) {
                let i = t[o];
                n = Z(i, n, L);
            }
            return n;
        }
        case '|': {
            let n = L,
                o = null;
            for (let i = t.length - 1; i >= 0; i--) {
                let s = t[i];
                if (
                    Ji(s) &&
                    (o === null &&
                        i > 0 &&
                        Ji(t[i - 1]) &&
                        ((o = Object.create(null)), (n = Z({ type: 'Enum', map: o }, C, n))),
                    o !== null)
                ) {
                    let u = (ea(s.name) ? s.name.slice(0, -1) : s.name).toLowerCase();
                    if (!(u in o)) {
                        o[u] = s;
                        continue;
                    }
                }
                (o = null), (n = Z(s, C, n));
            }
            return n;
        }
        case '&&': {
            if (t.length > 5) return { type: 'MatchOnce', terms: t, all: !0 };
            let n = L;
            for (let o = t.length - 1; o >= 0; o--) {
                let i = t[o],
                    s;
                t.length > 1
                    ? (s = Rr(
                          e,
                          t.filter(function (u) {
                              return u !== i;
                          }),
                          !1,
                      ))
                    : (s = C),
                    (n = Z(i, s, n));
            }
            return n;
        }
        case '||': {
            if (t.length > 5) return { type: 'MatchOnce', terms: t, all: !1 };
            let n = r ? C : L;
            for (let o = t.length - 1; o >= 0; o--) {
                let i = t[o],
                    s;
                t.length > 1
                    ? (s = Rr(
                          e,
                          t.filter(function (u) {
                              return u !== i;
                          }),
                          !0,
                      ))
                    : (s = C),
                    (n = Z(i, s, n));
            }
            return n;
        }
    }
}
function Zl(e) {
    let t = C,
        r = Fr(e.term);
    if (e.max === 0)
        (r = Z(r, Kt, L)),
            (t = Z(r, null, L)),
            (t.then = Z(C, C, t)),
            e.comma && (t.then.else = Z({ type: 'Comma', syntax: e }, t, L));
    else
        for (let n = e.min || 1; n <= e.max; n++)
            e.comma && t !== C && (t = Z({ type: 'Comma', syntax: e }, t, L)),
                (t = Z(r, Z(C, C, t), L));
    if (e.min === 0) t = Z(C, C, t);
    else
        for (let n = 0; n < e.min - 1; n++)
            e.comma && t !== C && (t = Z({ type: 'Comma', syntax: e }, t, L)), (t = Z(r, t, L));
    return t;
}
function Fr(e) {
    if (typeof e == 'function') return { type: 'Generic', fn: e };
    switch (e.type) {
        case 'Group': {
            let t = Rr(e.combinator, e.terms.map(Fr), !1);
            return e.disallowEmpty && (t = Z(t, Kt, L)), t;
        }
        case 'Multiplier':
            return Zl(e);
        case 'Type':
        case 'Property':
            return { type: e.type, name: e.name, syntax: e };
        case 'Keyword':
            return { type: e.type, name: e.name.toLowerCase(), syntax: e };
        case 'AtKeyword':
            return {
                type: e.type,
                name: '@' + e.name.toLowerCase(),
                syntax: e,
            };
        case 'Function':
            return {
                type: e.type,
                name: e.name.toLowerCase() + '(',
                syntax: e,
            };
        case 'String':
            return e.value.length === 3
                ? { type: 'Token', value: e.value.charAt(1), syntax: e }
                : {
                      type: e.type,
                      value: e.value.substr(1, e.value.length - 2).replace(/\\'/g, "'"),
                      syntax: e,
                  };
        case 'Token':
            return { type: e.type, value: e.value, syntax: e };
        case 'Comma':
            return { type: e.type, syntax: e };
        default:
            throw new Error('Unknown node type:', e.type);
    }
}
function Qt(e, t) {
    return (
        typeof e == 'string' && (e = Ge(e)),
        { type: 'MatchGraph', match: Fr(e), syntax: t || null, source: e }
    );
}
var { hasOwnProperty: ta } = Object.prototype,
    Jl = 0,
    ec = 1,
    _r = 2,
    aa = 3,
    ra = 'Match',
    tc = 'Mismatch',
    rc =
        'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)',
    na = 15e3,
    nc = 0;
function oc(e) {
    let t = null,
        r = null,
        n = e;
    for (; n !== null; ) (r = n.prev), (n.prev = t), (t = n), (n = r);
    return t;
}
function Br(e, t) {
    if (e.length !== t.length) return !1;
    for (let r = 0; r < e.length; r++) {
        let n = t.charCodeAt(r),
            o = e.charCodeAt(r);
        if ((o >= 65 && o <= 90 && (o = o | 32), o !== n)) return !1;
    }
    return !0;
}
function ic(e) {
    return e.type !== 9 ? !1 : e.value !== '?';
}
function oa(e) {
    return e === null
        ? !0
        : e.type === 18 || e.type === 2 || e.type === 21 || e.type === 19 || e.type === 23 || ic(e);
}
function ia(e) {
    return e === null
        ? !0
        : e.type === 22 || e.type === 20 || e.type === 24 || (e.type === 9 && e.value === '/');
}
function ac(e, t, r) {
    function n() {
        do R++, (S = R < e.length ? e[R] : null);
        while (S !== null && (S.type === 13 || S.type === 25));
    }
    function o(ae) {
        let fe = R + ae;
        return fe < e.length ? e[fe] : null;
    }
    function i(ae, fe) {
        return {
            nextState: ae,
            matchStack: z,
            syntaxStack: p,
            thenStack: m,
            tokenIndex: R,
            prev: fe,
        };
    }
    function s(ae) {
        m = { nextState: ae, matchStack: z, syntaxStack: p, prev: m };
    }
    function u(ae) {
        f = i(ae, f);
    }
    function c() {
        (z = { type: ec, syntax: t.syntax, token: S, prev: z }),
            n(),
            (P = null),
            R > ke && (ke = R);
    }
    function a() {
        (p = {
            syntax: t.syntax,
            opts: t.syntax.opts || (p !== null && p.opts) || null,
            prev: p,
        }),
            (z = { type: _r, syntax: t.syntax, token: z.token, prev: z });
    }
    function l() {
        z.type === _r
            ? (z = z.prev)
            : (z = { type: aa, syntax: p.syntax, token: z.token, prev: z }),
            (p = p.prev);
    }
    let p = null,
        m = null,
        f = null,
        P = null,
        te = 0,
        X = null,
        S = null,
        R = -1,
        ke = 0,
        z = { type: Jl, syntax: null, token: null, prev: null };
    for (n(); X === null && ++te < na; )
        switch (t.type) {
            case 'Match':
                if (m === null) {
                    if (
                        S !== null &&
                        (R !== e.length - 1 || (S.value !== '\\0' && S.value !== '\\9'))
                    ) {
                        t = L;
                        break;
                    }
                    X = ra;
                    break;
                }
                if (((t = m.nextState), t === Kt))
                    if (m.matchStack === z) {
                        t = L;
                        break;
                    } else t = C;
                for (; m.syntaxStack !== p; ) l();
                m = m.prev;
                break;
            case 'Mismatch':
                if (P !== null && P !== !1) (f === null || R > f.tokenIndex) && ((f = P), (P = !1));
                else if (f === null) {
                    X = tc;
                    break;
                }
                (t = f.nextState),
                    (m = f.thenStack),
                    (p = f.syntaxStack),
                    (z = f.matchStack),
                    (R = f.tokenIndex),
                    (S = R < e.length ? e[R] : null),
                    (f = f.prev);
                break;
            case 'MatchGraph':
                t = t.match;
                break;
            case 'If':
                t.else !== L && u(t.else), t.then !== C && s(t.then), (t = t.match);
                break;
            case 'MatchOnce':
                t = { type: 'MatchOnceBuffer', syntax: t, index: 0, mask: 0 };
                break;
            case 'MatchOnceBuffer': {
                let Q = t.syntax.terms;
                if (t.index === Q.length) {
                    if (t.mask === 0 || t.syntax.all) {
                        t = L;
                        break;
                    }
                    t = C;
                    break;
                }
                if (t.mask === (1 << Q.length) - 1) {
                    t = C;
                    break;
                }
                for (; t.index < Q.length; t.index++) {
                    let J = 1 << t.index;
                    if ((t.mask & J) === 0) {
                        u(t),
                            s({
                                type: 'AddMatchOnce',
                                syntax: t.syntax,
                                mask: t.mask | J,
                            }),
                            (t = Q[t.index++]);
                        break;
                    }
                }
                break;
            }
            case 'AddMatchOnce':
                t = {
                    type: 'MatchOnceBuffer',
                    syntax: t.syntax,
                    index: 0,
                    mask: t.mask,
                };
                break;
            case 'Enum':
                if (S !== null) {
                    let Q = S.value.toLowerCase();
                    if (
                        (Q.indexOf('\\') !== -1 && (Q = Q.replace(/\\[09].*$/, '')),
                        ta.call(t.map, Q))
                    ) {
                        t = t.map[Q];
                        break;
                    }
                }
                t = L;
                break;
            case 'Generic': {
                let Q = p !== null ? p.opts : null,
                    J = R + Math.floor(t.fn(S, o, Q));
                if (!isNaN(J) && J > R) {
                    for (; R < J; ) c();
                    t = C;
                } else t = L;
                break;
            }
            case 'Type':
            case 'Property': {
                let Q = t.type === 'Type' ? 'types' : 'properties',
                    J = ta.call(r, Q) ? r[Q][t.name] : null;
                if (!J || !J.match)
                    throw new Error(
                        'Bad syntax reference: ' +
                            (t.type === 'Type' ? '<' + t.name + '>' : "<'" + t.name + "'>"),
                    );
                if (
                    P !== !1 &&
                    S !== null &&
                    t.type === 'Type' &&
                    ((t.name === 'custom-ident' && S.type === 1) ||
                        (t.name === 'length' && S.value === '0'))
                ) {
                    P === null && (P = i(t, f)), (t = L);
                    break;
                }
                a(), (t = J.match);
                break;
            }
            case 'Keyword': {
                let Q = t.name;
                if (S !== null) {
                    let J = S.value;
                    if ((J.indexOf('\\') !== -1 && (J = J.replace(/\\[09].*$/, '')), Br(J, Q))) {
                        c(), (t = C);
                        break;
                    }
                }
                t = L;
                break;
            }
            case 'AtKeyword':
            case 'Function':
                if (S !== null && Br(S.value, t.name)) {
                    c(), (t = C);
                    break;
                }
                t = L;
                break;
            case 'Token':
                if (S !== null && S.value === t.value) {
                    c(), (t = C);
                    break;
                }
                t = L;
                break;
            case 'Comma':
                S !== null && S.type === 18
                    ? oa(z.token)
                        ? (t = L)
                        : (c(), (t = ia(S) ? L : C))
                    : (t = oa(z.token) || ia(S) ? C : L);
                break;
            case 'String':
                let ae = '',
                    fe = R;
                for (; fe < e.length && ae.length < t.value.length; fe++) ae += e[fe].value;
                if (Br(ae, t.value)) {
                    for (; R < fe; ) c();
                    t = C;
                } else t = L;
                break;
            default:
                throw new Error('Unknown node type: ' + t.type);
        }
    switch (((nc += te), X)) {
        case null:
            console.warn('[csstree-match] BREAK after ' + na + ' iterations'), (X = rc), (z = null);
            break;
        case ra:
            for (; p !== null; ) l();
            break;
        default:
            z = null;
    }
    return { tokens: e, reason: X, iterations: te, match: z, longestMatch: ke };
}
function qr(e, t, r) {
    let n = ac(e, t, r || {});
    if (n.match === null) return n;
    let o = n.match,
        i = (n.match = { syntax: t.syntax || null, match: [] }),
        s = [i];
    for (o = oc(o).prev; o !== null; ) {
        switch (o.type) {
            case _r:
                i.match.push((i = { syntax: o.syntax, match: [] })), s.push(i);
                break;
            case aa:
                s.pop(), (i = s[s.length - 1]);
                break;
            default:
                i.match.push({
                    syntax: o.syntax || null,
                    token: o.token.value,
                    node: o.token.node,
                });
        }
        o = o.prev;
    }
    return n;
}
var jr = {};
b(jr, {
    getTrace: () => sa,
    isKeyword: () => cc,
    isProperty: () => lc,
    isType: () => sc,
});
function sa(e) {
    function t(o) {
        return o === null ? !1 : o.type === 'Type' || o.type === 'Property' || o.type === 'Keyword';
    }
    function r(o) {
        if (Array.isArray(o.match)) {
            for (let i = 0; i < o.match.length; i++)
                if (r(o.match[i])) return t(o.syntax) && n.unshift(o.syntax), !0;
        } else if (o.node === e) return (n = t(o.syntax) ? [o.syntax] : []), !0;
        return !1;
    }
    let n = null;
    return this.matched !== null && r(this.matched), n;
}
function sc(e, t) {
    return Ur(this, e, (r) => r.type === 'Type' && r.name === t);
}
function lc(e, t) {
    return Ur(this, e, (r) => r.type === 'Property' && r.name === t);
}
function cc(e) {
    return Ur(this, e, (t) => t.type === 'Keyword');
}
function Ur(e, t, r) {
    let n = sa.call(e, t);
    return n === null ? !1 : n.some(r);
}
function la(e) {
    return 'node' in e ? e.node : la(e.match[0]);
}
function ca(e) {
    return 'node' in e ? e.node : ca(e.match[e.match.length - 1]);
}
function Wr(e, t, r, n, o) {
    function i(u) {
        if (u.syntax !== null && u.syntax.type === n && u.syntax.name === o) {
            let c = la(u),
                a = ca(u);
            e.syntax.walk(t, function (l, p, m) {
                if (l === c) {
                    let f = new D();
                    do {
                        if ((f.appendData(p.data), p.data === a)) break;
                        p = p.next;
                    } while (p !== null);
                    s.push({ parent: m, nodes: f });
                }
            });
        }
        Array.isArray(u.match) && u.match.forEach(i);
    }
    let s = [];
    return r.matched !== null && i(r.matched), s;
}
var { hasOwnProperty: ht } = Object.prototype;
function Hr(e) {
    return typeof e == 'number' && isFinite(e) && Math.floor(e) === e && e >= 0;
}
function ua(e) {
    return Boolean(e) && Hr(e.offset) && Hr(e.line) && Hr(e.column);
}
function uc(e, t) {
    return function (n, o) {
        if (!n || n.constructor !== Object) return o(n, 'Type of node should be an Object');
        for (let i in n) {
            let s = !0;
            if (ht.call(n, i) !== !1) {
                if (i === 'type')
                    n.type !== e && o(n, 'Wrong node type `' + n.type + '`, expected `' + e + '`');
                else if (i === 'loc') {
                    if (n.loc === null) continue;
                    if (n.loc && n.loc.constructor === Object)
                        if (typeof n.loc.source != 'string') i += '.source';
                        else if (!ua(n.loc.start)) i += '.start';
                        else if (!ua(n.loc.end)) i += '.end';
                        else continue;
                    s = !1;
                } else if (t.hasOwnProperty(i)) {
                    s = !1;
                    for (let u = 0; !s && u < t[i].length; u++) {
                        let c = t[i][u];
                        switch (c) {
                            case String:
                                s = typeof n[i] == 'string';
                                break;
                            case Boolean:
                                s = typeof n[i] == 'boolean';
                                break;
                            case null:
                                s = n[i] === null;
                                break;
                            default:
                                typeof c == 'string'
                                    ? (s = n[i] && n[i].type === c)
                                    : Array.isArray(c) && (s = n[i] instanceof D);
                        }
                    }
                } else o(n, 'Unknown field `' + i + '` for ' + e + ' node type');
                s || o(n, 'Bad value for `' + e + '.' + i + '`');
            }
        }
        for (let i in t)
            ht.call(t, i) && ht.call(n, i) === !1 && o(n, 'Field `' + e + '.' + i + '` is missed');
    };
}
function pc(e, t) {
    let r = t.structure,
        n = { type: String, loc: !0 },
        o = { type: '"' + e + '"' };
    for (let i in r) {
        if (ht.call(r, i) === !1) continue;
        let s = [],
            u = (n[i] = Array.isArray(r[i]) ? r[i].slice() : [r[i]]);
        for (let c = 0; c < u.length; c++) {
            let a = u[c];
            if (a === String || a === Boolean) s.push(a.name);
            else if (a === null) s.push('null');
            else if (typeof a == 'string') s.push('<' + a + '>');
            else if (Array.isArray(a)) s.push('List');
            else
                throw new Error(
                    'Wrong value `' + a + '` in `' + e + '.' + i + '` structure definition',
                );
        }
        o[i] = s.join(' | ');
    }
    return { docs: o, check: uc(e, n) };
}
function pa(e) {
    let t = {};
    if (e.node) {
        for (let r in e.node)
            if (ht.call(e.node, r)) {
                let n = e.node[r];
                if (n.structure) t[r] = pc(r, n);
                else
                    throw new Error('Missed `structure` field in `' + r + '` node type definition');
            }
    }
    return t;
}
var hc = Qt(Rt.join(' | '));
function Yr(e, t, r) {
    let n = {};
    for (let o in e) e[o].syntax && (n[o] = r ? e[o].syntax : Pe(e[o].syntax, { compact: t }));
    return n;
}
function mc(e, t, r) {
    let n = {};
    for (let [o, i] of Object.entries(e))
        n[o] = {
            prelude: i.prelude && (r ? i.prelude.syntax : Pe(i.prelude.syntax, { compact: t })),
            descriptors: i.descriptors && Yr(i.descriptors, t, r),
        };
    return n;
}
function fc(e) {
    for (let t = 0; t < e.length; t++) if (e[t].value.toLowerCase() === 'var(') return !0;
    return !1;
}
function ce(e, t, r) {
    return { matched: e, iterations: r, error: t, ...jr };
}
function Ve(e, t, r, n) {
    let o = Zi(r, e.syntax),
        i;
    return fc(o)
        ? ce(null, new Error('Matching for a tree with var() is not supported'))
        : (n && (i = qr(o, e.cssWideKeywordsSyntax, e)),
          (!n || !i.match) && ((i = qr(o, t.match, e)), !i.match)
              ? ce(null, new Ii(i.reason, t.syntax, r, i), i.iterations)
              : ce(i.match, null, i.iterations));
}
var Ke = class {
    constructor(t, r, n) {
        if (
            ((this.cssWideKeywordsSyntax = hc),
            (this.syntax = r),
            (this.generic = !1),
            (this.units = { ..._t }),
            (this.atrules = Object.create(null)),
            (this.properties = Object.create(null)),
            (this.types = Object.create(null)),
            (this.structure = n || pa(t)),
            t)
        ) {
            if (t.units)
                for (let o of Object.keys(_t))
                    Array.isArray(t.units[o]) && (this.units[o] = t.units[o]);
            if (t.types) for (let o in t.types) this.addType_(o, t.types[o]);
            if (t.generic) {
                this.generic = !0;
                for (let [o, i] of Object.entries(Fi(this.units))) this.addType_(o, i);
            }
            if (t.atrules) for (let o in t.atrules) this.addAtrule_(o, t.atrules[o]);
            if (t.properties) for (let o in t.properties) this.addProperty_(o, t.properties[o]);
        }
    }
    checkStructure(t) {
        function r(i, s) {
            o.push({ node: i, message: s });
        }
        let n = this.structure,
            o = [];
        return (
            this.syntax.walk(t, function (i) {
                n.hasOwnProperty(i.type)
                    ? n[i.type].check(i, r)
                    : r(i, 'Unknown node type `' + i.type + '`');
            }),
            o.length ? o : !1
        );
    }
    createDescriptor(t, r, n, o = null) {
        let i = { type: r, name: n },
            s = {
                type: r,
                name: n,
                parent: o,
                serializable: typeof t == 'string' || (t && typeof t.type == 'string'),
                syntax: null,
                match: null,
            };
        return (
            typeof t == 'function'
                ? (s.match = Qt(t, i))
                : (typeof t == 'string'
                      ? Object.defineProperty(s, 'syntax', {
                            get() {
                                return (
                                    Object.defineProperty(s, 'syntax', {
                                        value: Ge(t),
                                    }),
                                    s.syntax
                                );
                            },
                        })
                      : (s.syntax = t),
                  Object.defineProperty(s, 'match', {
                      get() {
                          return (
                              Object.defineProperty(s, 'match', {
                                  value: Qt(s.syntax, i),
                              }),
                              s.match
                          );
                      },
                  })),
            s
        );
    }
    addAtrule_(t, r) {
        !r ||
            (this.atrules[t] = {
                type: 'Atrule',
                name: t,
                prelude: r.prelude ? this.createDescriptor(r.prelude, 'AtrulePrelude', t) : null,
                descriptors: r.descriptors
                    ? Object.keys(r.descriptors).reduce(
                          (n, o) => (
                              (n[o] = this.createDescriptor(
                                  r.descriptors[o],
                                  'AtruleDescriptor',
                                  o,
                                  t,
                              )),
                              n
                          ),
                          Object.create(null),
                      )
                    : null,
            });
    }
    addProperty_(t, r) {
        !r || (this.properties[t] = this.createDescriptor(r, 'Property', t));
    }
    addType_(t, r) {
        !r || (this.types[t] = this.createDescriptor(r, 'Type', t));
    }
    checkAtruleName(t) {
        if (!this.getAtrule(t)) return new Ue('Unknown at-rule', '@' + t);
    }
    checkAtrulePrelude(t, r) {
        let n = this.checkAtruleName(t);
        if (n) return n;
        let o = this.getAtrule(t);
        if (!o.prelude && r)
            return new SyntaxError('At-rule `@' + t + '` should not contain a prelude');
        if (o.prelude && !r && !Ve(this, o.prelude, '', !1).matched)
            return new SyntaxError('At-rule `@' + t + '` should contain a prelude');
    }
    checkAtruleDescriptorName(t, r) {
        let n = this.checkAtruleName(t);
        if (n) return n;
        let o = this.getAtrule(t),
            i = zt(r);
        if (!o.descriptors) return new SyntaxError('At-rule `@' + t + '` has no known descriptors');
        if (!o.descriptors[i.name] && !o.descriptors[i.basename])
            return new Ue('Unknown at-rule descriptor', r);
    }
    checkPropertyName(t) {
        if (!this.getProperty(t)) return new Ue('Unknown property', t);
    }
    matchAtrulePrelude(t, r) {
        let n = this.checkAtrulePrelude(t, r);
        if (n) return ce(null, n);
        let o = this.getAtrule(t);
        return o.prelude ? Ve(this, o.prelude, r || '', !1) : ce(null, null);
    }
    matchAtruleDescriptor(t, r, n) {
        let o = this.checkAtruleDescriptorName(t, r);
        if (o) return ce(null, o);
        let i = this.getAtrule(t),
            s = zt(r);
        return Ve(this, i.descriptors[s.name] || i.descriptors[s.basename], n, !1);
    }
    matchDeclaration(t) {
        return t.type !== 'Declaration'
            ? ce(null, new Error('Not a Declaration node'))
            : this.matchProperty(t.property, t.value);
    }
    matchProperty(t, r) {
        if (kr(t).custom)
            return ce(null, new Error("Lexer matching doesn't applicable for custom properties"));
        let n = this.checkPropertyName(t);
        return n ? ce(null, n) : Ve(this, this.getProperty(t), r, !0);
    }
    matchType(t, r) {
        let n = this.getType(t);
        return n ? Ve(this, n, r, !1) : ce(null, new Ue('Unknown type', t));
    }
    match(t, r) {
        return typeof t != 'string' && (!t || !t.type)
            ? ce(null, new Ue('Bad syntax'))
            : ((typeof t == 'string' || !t.match) &&
                  (t = this.createDescriptor(t, 'Type', 'anonymous')),
              Ve(this, t, r, !1));
    }
    findValueFragments(t, r, n, o) {
        return Wr(this, r, this.matchProperty(t, r), n, o);
    }
    findDeclarationValueFragments(t, r, n) {
        return Wr(this, t.value, this.matchDeclaration(t), r, n);
    }
    findAllFragments(t, r, n) {
        let o = [];
        return (
            this.syntax.walk(t, {
                visit: 'Declaration',
                enter: (i) => {
                    o.push.apply(o, this.findDeclarationValueFragments(i, r, n));
                },
            }),
            o
        );
    }
    getAtrule(t, r = !0) {
        let n = zt(t);
        return (
            (n.vendor && r
                ? this.atrules[n.name] || this.atrules[n.basename]
                : this.atrules[n.name]) || null
        );
    }
    getAtrulePrelude(t, r = !0) {
        let n = this.getAtrule(t, r);
        return (n && n.prelude) || null;
    }
    getAtruleDescriptor(t, r) {
        return (
            (this.atrules.hasOwnProperty(t) &&
                this.atrules.declarators &&
                this.atrules[t].declarators[r]) ||
            null
        );
    }
    getProperty(t, r = !0) {
        let n = kr(t);
        return (
            (n.vendor && r
                ? this.properties[n.name] || this.properties[n.basename]
                : this.properties[n.name]) || null
        );
    }
    getType(t) {
        return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
    }
    validate() {
        function t(o, i, s, u) {
            if (s.has(i)) return s.get(i);
            s.set(i, !1),
                u.syntax !== null &&
                    Vt(
                        u.syntax,
                        function (c) {
                            if (c.type !== 'Type' && c.type !== 'Property') return;
                            let a = c.type === 'Type' ? o.types : o.properties,
                                l = c.type === 'Type' ? r : n;
                            (!hasOwnProperty.call(a, c.name) || t(o, c.name, l, a[c.name])) &&
                                s.set(i, !0);
                        },
                        this,
                    );
        }
        let r = new Map(),
            n = new Map();
        for (let o in this.types) t(this, o, r, this.types[o]);
        for (let o in this.properties) t(this, o, n, this.properties[o]);
        return (
            (r = [...r.keys()].filter((o) => r.get(o))),
            (n = [...n.keys()].filter((o) => n.get(o))),
            r.length || n.length ? { types: r, properties: n } : null
        );
    }
    dump(t, r) {
        return {
            generic: this.generic,
            units: this.units,
            types: Yr(this.types, !r, t),
            properties: Yr(this.properties, !r, t),
            atrules: mc(this.atrules, !r, t),
        };
    }
    toString() {
        return JSON.stringify(this.dump());
    }
};
function Gr(e, t) {
    return typeof t == 'string' && /^\s*\|/.test(t)
        ? typeof e == 'string'
            ? e + t
            : t.replace(/^\s*\|\s*/, '')
        : t || null;
}
function ha(e, t) {
    let r = Object.create(null);
    for (let [n, o] of Object.entries(e))
        if (o) {
            r[n] = {};
            for (let i of Object.keys(o)) t.includes(i) && (r[n][i] = o[i]);
        }
    return r;
}
function mt(e, t) {
    let r = { ...e };
    for (let [n, o] of Object.entries(t))
        switch (n) {
            case 'generic':
                r[n] = Boolean(o);
                break;
            case 'units':
                r[n] = { ...e[n] };
                for (let [i, s] of Object.entries(o)) r[n][i] = Array.isArray(s) ? s : [];
                break;
            case 'atrules':
                r[n] = { ...e[n] };
                for (let [i, s] of Object.entries(o)) {
                    let u = r[n][i] || {},
                        c = (r[n][i] = {
                            prelude: u.prelude || null,
                            descriptors: { ...u.descriptors },
                        });
                    if (!!s) {
                        c.prelude = s.prelude ? Gr(c.prelude, s.prelude) : c.prelude || null;
                        for (let [a, l] of Object.entries(s.descriptors || {}))
                            c.descriptors[a] = l ? Gr(c.descriptors[a], l) : null;
                        Object.keys(c.descriptors).length || (c.descriptors = null);
                    }
                }
                break;
            case 'types':
            case 'properties':
                r[n] = { ...e[n] };
                for (let [i, s] of Object.entries(o)) r[n][i] = Gr(r[n][i], s);
                break;
            case 'scope':
                r[n] = { ...e[n] };
                for (let [i, s] of Object.entries(o)) r[n][i] = { ...r[n][i], ...s };
                break;
            case 'parseContext':
                r[n] = { ...e[n], ...o };
                break;
            case 'atrule':
            case 'pseudo':
                r[n] = { ...e[n], ...ha(o, ['parse']) };
                break;
            case 'node':
                r[n] = {
                    ...e[n],
                    ...ha(o, ['name', 'structure', 'parse', 'generate', 'walkContext']),
                };
                break;
        }
    return r;
}
function ma(e) {
    let t = $o(e),
        r = Li(e),
        n = vi(e),
        { fromPlainObject: o, toPlainObject: i } = Si(r),
        s = {
            lexer: null,
            createLexer: (u) => new Ke(u, s, s.lexer.structure),
            tokenize: ve,
            parse: t,
            generate: n,
            walk: r,
            find: r.find,
            findLast: r.findLast,
            findAll: r.findAll,
            fromPlainObject: o,
            toPlainObject: i,
            fork(u) {
                let c = mt({}, e);
                return ma(typeof u == 'function' ? u(c, Object.assign) : mt(c, u));
            },
        };
    return (
        (s.lexer = new Ke(
            {
                generic: !0,
                units: e.units,
                types: e.types,
                atrules: e.atrules,
                properties: e.properties,
                node: e.node,
            },
            s,
        )),
        s
    );
}
var Vr = (e) => ma(mt({}, e));
var fa = {
    generic: !0,
    units: {
        angle: ['deg', 'grad', 'rad', 'turn'],
        decibel: ['db'],
        flex: ['fr'],
        frequency: ['hz', 'khz'],
        length: [
            'cm',
            'mm',
            'q',
            'in',
            'pt',
            'pc',
            'px',
            'em',
            'rem',
            'ex',
            'rex',
            'cap',
            'rcap',
            'ch',
            'rch',
            'ic',
            'ric',
            'lh',
            'rlh',
            'vw',
            'svw',
            'lvw',
            'dvw',
            'vh',
            'svh',
            'lvh',
            'dvh',
            'vi',
            'svi',
            'lvi',
            'dvi',
            'vb',
            'svb',
            'lvb',
            'dvb',
            'vmin',
            'svmin',
            'lvmin',
            'dvmin',
            'vmax',
            'svmax',
            'lvmax',
            'dvmax',
            'cqw',
            'cqh',
            'cqi',
            'cqb',
            'cqmin',
            'cqmax',
        ],
        resolution: ['dpi', 'dpcm', 'dppx', 'x'],
        semitones: ['st'],
        time: ['s', 'ms'],
    },
    types: {
        'abs()': 'abs( <calc-sum> )',
        'absolute-size': 'xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large',
        'acos()': 'acos( <calc-sum> )',
        'alpha-value': '<number>|<percentage>',
        'angle-percentage': '<angle>|<percentage>',
        'angular-color-hint': '<angle-percentage>',
        'angular-color-stop': '<color>&&<color-stop-angle>?',
        'angular-color-stop-list':
            '[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>',
        'animateable-feature': 'scroll-position|contents|<custom-ident>',
        'asin()': 'asin( <calc-sum> )',
        'atan()': 'atan( <calc-sum> )',
        'atan2()': 'atan2( <calc-sum> , <calc-sum> )',
        attachment: 'scroll|fixed|local',
        'attr()': 'attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )',
        'attr-matcher': "['~'|'|'|'^'|'$'|'*']? '='",
        'attr-modifier': 'i|s',
        'attribute-selector':
            "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
        'auto-repeat':
            'repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )',
        'auto-track-list':
            '[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?',
        axis: 'block|inline|vertical|horizontal',
        'baseline-position': '[first|last]? baseline',
        'basic-shape': '<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>',
        'bg-image': 'none|<image>',
        'bg-layer':
            '<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>',
        'bg-position':
            '[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]',
        'bg-size': '[<length-percentage>|auto]{1,2}|cover|contain',
        'blur()': 'blur( <length> )',
        'blend-mode':
            'normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity',
        box: 'border-box|padding-box|content-box',
        'brightness()': 'brightness( <number-percentage> )',
        'calc()': 'calc( <calc-sum> )',
        'calc-sum': "<calc-product> [['+'|'-'] <calc-product>]*",
        'calc-product': "<calc-value> ['*' <calc-value>|'/' <number>]*",
        'calc-value': '<number>|<dimension>|<percentage>|<calc-constant>|( <calc-sum> )',
        'calc-constant': 'e|pi|infinity|-infinity|NaN',
        'cf-final-image': '<image>|<color>',
        'cf-mixing-image': '<percentage>?&&<image>',
        'circle()': 'circle( [<shape-radius>]? [at <position>]? )',
        'clamp()': 'clamp( <calc-sum>#{3} )',
        'class-selector': "'.' <ident-token>",
        'clip-source': '<url>',
        color: '<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>',
        'color-stop': '<color-stop-length>|<color-stop-angle>',
        'color-stop-angle': '<angle-percentage>{1,2}',
        'color-stop-length': '<length-percentage>{1,2}',
        'color-stop-list': '[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>',
        combinator: "'>'|'+'|'~'|['||']",
        'common-lig-values': '[common-ligatures|no-common-ligatures]',
        'compat-auto':
            'searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button',
        'composite-style':
            'clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor',
        'compositing-operator': 'add|subtract|intersect|exclude',
        'compound-selector':
            '[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!',
        'compound-selector-list': '<compound-selector>#',
        'complex-selector': '<compound-selector> [<combinator>? <compound-selector>]*',
        'complex-selector-list': '<complex-selector>#',
        'conic-gradient()':
            'conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )',
        'contextual-alt-values': '[contextual|no-contextual]',
        'content-distribution': 'space-between|space-around|space-evenly|stretch',
        'content-list':
            '[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>|<attr()>]+',
        'content-position': 'center|start|end|flex-start|flex-end',
        'content-replacement': '<image>',
        'contrast()': 'contrast( [<number-percentage>] )',
        'cos()': 'cos( <calc-sum> )',
        counter: '<counter()>|<counters()>',
        'counter()': 'counter( <counter-name> , <counter-style>? )',
        'counter-name': '<custom-ident>',
        'counter-style': '<counter-style-name>|symbols( )',
        'counter-style-name': '<custom-ident>',
        'counters()': 'counters( <counter-name> , <string> , <counter-style>? )',
        'cross-fade()': 'cross-fade( <cf-mixing-image> , <cf-final-image>? )',
        'cubic-bezier-timing-function':
            'ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )',
        'deprecated-system-color':
            'ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText',
        'discretionary-lig-values': '[discretionary-ligatures|no-discretionary-ligatures]',
        'display-box': 'contents|none',
        'display-inside': 'flow|flow-root|table|flex|grid|ruby',
        'display-internal':
            'table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container',
        'display-legacy': 'inline-block|inline-list-item|inline-table|inline-flex|inline-grid',
        'display-listitem': '<display-outside>?&&[flow|flow-root]?&&list-item',
        'display-outside': 'block|inline|run-in',
        'drop-shadow()': 'drop-shadow( <length>{2,3} <color>? )',
        'east-asian-variant-values': '[jis78|jis83|jis90|jis04|simplified|traditional]',
        'east-asian-width-values': '[full-width|proportional-width]',
        'element()':
            'element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )',
        'ellipse()': 'ellipse( [<shape-radius>{2}]? [at <position>]? )',
        'ending-shape': 'circle|ellipse',
        'env()': 'env( <custom-ident> , <declaration-value>? )',
        'exp()': 'exp( <calc-sum> )',
        'explicit-track-list': '[<line-names>? <track-size>]+ <line-names>?',
        'family-name': '<string>|<custom-ident>+',
        'feature-tag-value': '<string> [<integer>|on|off]?',
        'feature-type':
            '@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation',
        'feature-value-block': "<feature-type> '{' <feature-value-declaration-list> '}'",
        'feature-value-block-list': '<feature-value-block>+',
        'feature-value-declaration': '<custom-ident> : <integer>+ ;',
        'feature-value-declaration-list': '<feature-value-declaration>',
        'feature-value-name': '<custom-ident>',
        'fill-rule': 'nonzero|evenodd',
        'filter-function':
            '<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>',
        'filter-function-list': '[<filter-function>|<url>]+',
        'final-bg-layer':
            "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
        'fixed-breadth': '<length-percentage>',
        'fixed-repeat':
            'repeat( [<integer [1,\u221E]>] , [<line-names>? <fixed-size>]+ <line-names>? )',
        'fixed-size':
            '<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )',
        'font-stretch-absolute':
            'normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>',
        'font-variant-css21': '[normal|small-caps]',
        'font-weight-absolute': 'normal|bold|<number [1,1000]>',
        'frequency-percentage': '<frequency>|<percentage>',
        'general-enclosed': '[<function-token> <any-value> )]|( <ident> <any-value> )',
        'generic-family': 'serif|sans-serif|cursive|fantasy|monospace|-apple-system',
        'generic-name': 'serif|sans-serif|cursive|fantasy|monospace',
        'geometry-box': '<shape-box>|fill-box|stroke-box|view-box',
        gradient:
            '<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<repeating-conic-gradient()>|<-legacy-gradient>',
        'grayscale()': 'grayscale( <number-percentage> )',
        'grid-line':
            'auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]',
        'historical-lig-values': '[historical-ligatures|no-historical-ligatures]',
        'hsl()':
            'hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )',
        'hsla()':
            'hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )',
        hue: '<number>|<angle>',
        'hue-rotate()': 'hue-rotate( <angle> )',
        'hwb()':
            'hwb( [<hue>|none] [<percentage>|none] [<percentage>|none] [/ [<alpha-value>|none]]? )',
        'hypot()': 'hypot( <calc-sum># )',
        image: '<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>',
        'image()': 'image( <image-tags>? [<image-src>? , <color>?]! )',
        'image-set()': 'image-set( <image-set-option># )',
        'image-set-option': '[<image>|<string>] [<resolution>||type( <string> )]',
        'image-src': '<url>|<string>',
        'image-tags': 'ltr|rtl',
        'inflexible-breadth': '<length-percentage>|min-content|max-content|auto',
        'inset()': "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
        'invert()': 'invert( <number-percentage> )',
        'keyframes-name': '<custom-ident>|<string>',
        'keyframe-block': '<keyframe-selector># { <declaration-list> }',
        'keyframe-block-list': '<keyframe-block>+',
        'keyframe-selector': 'from|to|<percentage>',
        'lab()':
            'lab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )',
        'layer()': 'layer( <layer-name> )',
        'layer-name': "<ident> ['.' <ident>]*",
        'lch()':
            'lch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )',
        'leader()': 'leader( <leader-type> )',
        'leader-type': 'dotted|solid|space|<string>',
        'length-percentage': '<length>|<percentage>',
        'line-names': "'[' <custom-ident>* ']'",
        'line-name-list': '[<line-names>|<name-repeat>]+',
        'line-style': 'none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset',
        'line-width': '<length>|thin|medium|thick',
        'linear-color-hint': '<length-percentage>',
        'linear-color-stop': '<color> <color-stop-length>?',
        'linear-gradient()':
            'linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )',
        'log()': 'log( <calc-sum> , <calc-sum>? )',
        'mask-layer':
            '<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>',
        'mask-position':
            '[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?',
        'mask-reference': 'none|<image>|<mask-source>',
        'mask-source': '<url>',
        'masking-mode': 'alpha|luminance|match-source',
        'matrix()': 'matrix( <number>#{6} )',
        'matrix3d()': 'matrix3d( <number>#{16} )',
        'max()': 'max( <calc-sum># )',
        'media-and': '<media-in-parens> [and <media-in-parens>]+',
        'media-condition': '<media-not>|<media-and>|<media-or>|<media-in-parens>',
        'media-condition-without-or': '<media-not>|<media-and>|<media-in-parens>',
        'media-feature': '( [<mf-plain>|<mf-boolean>|<mf-range>] )',
        'media-in-parens': '( <media-condition> )|<media-feature>|<general-enclosed>',
        'media-not': 'not <media-in-parens>',
        'media-or': '<media-in-parens> [or <media-in-parens>]+',
        'media-query':
            '<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?',
        'media-query-list': '<media-query>#',
        'media-type': '<ident>',
        'mf-boolean': '<mf-name>',
        'mf-name': '<ident>',
        'mf-plain': '<mf-name> : <mf-value>',
        'mf-range':
            "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
        'mf-value': '<number>|<dimension>|<ident>|<ratio>',
        'min()': 'min( <calc-sum># )',
        'minmax()':
            'minmax( [<length-percentage>|min-content|max-content|auto] , [<length-percentage>|<flex>|min-content|max-content|auto] )',
        'mod()': 'mod( <calc-sum> , <calc-sum> )',
        'name-repeat': 'repeat( [<integer [1,\u221E]>|auto-fill] , <line-names>+ )',
        'named-color':
            'transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>',
        'namespace-prefix': '<ident>',
        'ns-prefix': "[<ident-token>|'*']? '|'",
        'number-percentage': '<number>|<percentage>',
        'numeric-figure-values': '[lining-nums|oldstyle-nums]',
        'numeric-fraction-values': '[diagonal-fractions|stacked-fractions]',
        'numeric-spacing-values': '[proportional-nums|tabular-nums]',
        nth: '<an-plus-b>|even|odd',
        'opacity()': 'opacity( [<number-percentage>] )',
        'overflow-position': 'unsafe|safe',
        'outline-radius': '<length>|<percentage>',
        'page-body': '<declaration>? [; <page-body>]?|<page-margin-box> <page-body>',
        'page-margin-box': "<page-margin-box-type> '{' <declaration-list> '}'",
        'page-margin-box-type':
            '@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom',
        'page-selector-list': '[<page-selector>#]?',
        'page-selector': '<pseudo-page>+|<ident> <pseudo-page>*',
        'page-size': 'A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger',
        'path()': 'path( [<fill-rule> ,]? <string> )',
        'paint()': 'paint( <ident> , <declaration-value>? )',
        'perspective()': 'perspective( [<length [0,\u221E]>|none] )',
        'polygon()': 'polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )',
        position:
            '[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]',
        'pow()': 'pow( <calc-sum> , <calc-sum> )',
        'pseudo-class-selector': "':' <ident-token>|':' <function-token> <any-value> ')'",
        'pseudo-element-selector': "':' <pseudo-class-selector>",
        'pseudo-page': ': [left|right|first|blank]',
        quote: 'open-quote|close-quote|no-open-quote|no-close-quote',
        'radial-gradient()':
            'radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )',
        ratio: '<number [0,\u221E]> [/ <number [0,\u221E]>]?',
        'relative-selector': '<combinator>? <complex-selector>',
        'relative-selector-list': '<relative-selector>#',
        'relative-size': 'larger|smaller',
        'rem()': 'rem( <calc-sum> , <calc-sum> )',
        'repeat-style': 'repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}',
        'repeating-conic-gradient()':
            'repeating-conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )',
        'repeating-linear-gradient()':
            'repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )',
        'repeating-radial-gradient()':
            'repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )',
        'reversed-counter-name': 'reversed( <counter-name> )',
        'rgb()':
            'rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )',
        'rgba()':
            'rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )',
        'rotate()': 'rotate( [<angle>|<zero>] )',
        'rotate3d()': 'rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )',
        'rotateX()': 'rotateX( [<angle>|<zero>] )',
        'rotateY()': 'rotateY( [<angle>|<zero>] )',
        'rotateZ()': 'rotateZ( [<angle>|<zero>] )',
        'round()': 'round( <rounding-strategy>? , <calc-sum> , <calc-sum> )',
        'rounding-strategy': 'nearest|up|down|to-zero',
        'saturate()': 'saturate( <number-percentage> )',
        'scale()': 'scale( [<number>|<percentage>]#{1,2} )',
        'scale3d()': 'scale3d( [<number>|<percentage>]#{3} )',
        'scaleX()': 'scaleX( [<number>|<percentage>] )',
        'scaleY()': 'scaleY( [<number>|<percentage>] )',
        'scaleZ()': 'scaleZ( [<number>|<percentage>] )',
        scroller: 'root|nearest',
        'self-position': 'center|start|end|self-start|self-end|flex-start|flex-end',
        'shape-radius': '<length-percentage>|closest-side|farthest-side',
        'sign()': 'sign( <calc-sum> )',
        'skew()': 'skew( [<angle>|<zero>] , [<angle>|<zero>]? )',
        'skewX()': 'skewX( [<angle>|<zero>] )',
        'skewY()': 'skewY( [<angle>|<zero>] )',
        'sepia()': 'sepia( <number-percentage> )',
        shadow: 'inset?&&<length>{2,4}&&<color>?',
        'shadow-t': '[<length>{2,3}&&<color>?]',
        shape: 'rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )',
        'shape-box': '<box>|margin-box',
        'side-or-corner': '[left|right]||[top|bottom]',
        'sin()': 'sin( <calc-sum> )',
        'single-animation':
            '<time>||<easing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]',
        'single-animation-direction': 'normal|reverse|alternate|alternate-reverse',
        'single-animation-fill-mode': 'none|forwards|backwards|both',
        'single-animation-iteration-count': 'infinite|<number>',
        'single-animation-play-state': 'running|paused',
        'single-animation-timeline': 'auto|none|<timeline-name>|scroll( <axis>? <scroller>? )',
        'single-transition':
            '[none|<single-transition-property>]||<time>||<easing-function>||<time>',
        'single-transition-property': 'all|<custom-ident>',
        size: 'closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}',
        'sqrt()': 'sqrt( <calc-sum> )',
        'step-position': 'jump-start|jump-end|jump-none|jump-both|start|end',
        'step-timing-function': 'step-start|step-end|steps( <integer> [, <step-position>]? )',
        'subclass-selector':
            '<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>',
        'supports-condition':
            'not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*',
        'supports-in-parens': '( <supports-condition> )|<supports-feature>|<general-enclosed>',
        'supports-feature': '<supports-decl>|<supports-selector-fn>',
        'supports-decl': '( <declaration> )',
        'supports-selector-fn': 'selector( <complex-selector> )',
        symbol: '<string>|<image>|<custom-ident>',
        'tan()': 'tan( <calc-sum> )',
        target: '<target-counter()>|<target-counters()>|<target-text()>',
        'target-counter()':
            'target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )',
        'target-counters()':
            'target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )',
        'target-text()': 'target-text( [<string>|<url>] , [content|before|after|first-letter]? )',
        'time-percentage': '<time>|<percentage>',
        'timeline-name': '<custom-ident>|<string>',
        'easing-function': 'linear|<cubic-bezier-timing-function>|<step-timing-function>',
        'track-breadth': '<length-percentage>|<flex>|min-content|max-content|auto',
        'track-list': '[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?',
        'track-repeat':
            'repeat( [<integer [1,\u221E]>] , [<line-names>? <track-size>]+ <line-names>? )',
        'track-size':
            '<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( <length-percentage> )',
        'transform-function':
            '<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>',
        'transform-list': '<transform-function>+',
        'translate()': 'translate( <length-percentage> , <length-percentage>? )',
        'translate3d()': 'translate3d( <length-percentage> , <length-percentage> , <length> )',
        'translateX()': 'translateX( <length-percentage> )',
        'translateY()': 'translateY( <length-percentage> )',
        'translateZ()': 'translateZ( <length> )',
        'type-or-unit':
            'string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%',
        'type-selector': "<wq-name>|<ns-prefix>? '*'",
        'var()': 'var( <custom-property-name> , <declaration-value>? )',
        'viewport-length': 'auto|<length-percentage>',
        'visual-box': 'content-box|padding-box|border-box',
        'wq-name': '<ns-prefix>? <ident-token>',
        '-legacy-gradient':
            '<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>',
        '-legacy-linear-gradient':
            '-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )',
        '-legacy-repeating-linear-gradient':
            '-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )',
        '-legacy-linear-gradient-arguments': '[<angle>|<side-or-corner>]? , <color-stop-list>',
        '-legacy-radial-gradient':
            '-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )',
        '-legacy-repeating-radial-gradient':
            '-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )',
        '-legacy-radial-gradient-arguments':
            '[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>',
        '-legacy-radial-gradient-size':
            'closest-side|closest-corner|farthest-side|farthest-corner|contain|cover',
        '-legacy-radial-gradient-shape': 'circle|ellipse',
        '-non-standard-font':
            '-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body',
        '-non-standard-color':
            '-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text',
        '-non-standard-image-rendering':
            'optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast',
        '-non-standard-overflow':
            '-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable',
        '-non-standard-width':
            'fill-available|min-intrinsic|intrinsic|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content',
        '-webkit-gradient()':
            '-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )',
        '-webkit-gradient-color-stop':
            'from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )',
        '-webkit-gradient-point':
            '[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]',
        '-webkit-gradient-radius': '<length>|<percentage>',
        '-webkit-gradient-type': 'linear|radial',
        '-webkit-mask-box-repeat': 'repeat|stretch|round',
        '-webkit-mask-clip-style': 'border|border-box|padding|padding-box|content|content-box|text',
        '-ms-filter-function-list': '<-ms-filter-function>+',
        '-ms-filter-function': '<-ms-filter-function-progid>|<-ms-filter-function-legacy>',
        '-ms-filter-function-progid':
            "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
        '-ms-filter-function-legacy': '<ident-token>|<function-token> <any-value>? )',
        '-ms-filter': '<string>',
        age: 'child|young|old',
        'attr-name': '<wq-name>',
        'attr-fallback': '<any-value>',
        'bg-clip': '<box>|border|text',
        bottom: '<length>|auto',
        'container-name': '<custom-ident>',
        'container-condition':
            'not <query-in-parens>|<query-in-parens> [[and <query-in-parens>]*|[or <query-in-parens>]*]',
        'generic-voice': '[<age>? <gender> <integer>?]',
        gender: 'male|female|neutral',
        left: '<length>|auto',
        'mask-image': '<mask-reference>#',
        paint: 'none|<color>|<url> [none|<color>]?|context-fill|context-stroke',
        right: '<length>|auto',
        'scroll-timeline-axis': 'block|inline|vertical|horizontal',
        'scroll-timeline-name': 'none|<custom-ident>',
        'single-animation-composition': 'replace|add|accumulate',
        'svg-length': '<percentage>|<length>|<number>',
        'svg-writing-mode': 'lr-tb|rl-tb|tb-rl|lr|rl|tb',
        top: '<length>|auto',
        x: '<number>',
        y: '<number>',
        declaration: "<ident-token> : <declaration-value>? ['!' important]?",
        'declaration-list': "[<declaration>? ';']* <declaration>?",
        url: 'url( <string> <url-modifier>* )|<url-token>',
        'url-modifier': '<ident>|<function-token> <any-value> )',
        'number-zero-one': '<number [0,1]>',
        'number-one-or-greater': '<number [1,\u221E]>',
        'query-in-parens':
            '( <container-condition> )|( <size-feature> )|style( <style-query> )|<general-enclosed>',
        'size-feature': '<mf-plain>|<mf-boolean>|<mf-range>',
        'style-feature': '<declaration>',
        'style-query': '<style-condition>|<style-feature>',
        'style-condition':
            'not <style-in-parens>|<style-in-parens> [[and <style-in-parens>]*|[or <style-in-parens>]*]',
        'style-in-parens': '( <style-condition> )|( <style-feature> )|<general-enclosed>',
        '-non-standard-display':
            '-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box',
    },
    properties: {
        '--*': '<declaration-value>',
        '-ms-accelerator': 'false|true',
        '-ms-block-progression': 'tb|rl|bt|lr',
        '-ms-content-zoom-chaining': 'none|chained',
        '-ms-content-zooming': 'none|zoom',
        '-ms-content-zoom-limit': "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
        '-ms-content-zoom-limit-max': '<percentage>',
        '-ms-content-zoom-limit-min': '<percentage>',
        '-ms-content-zoom-snap': "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
        '-ms-content-zoom-snap-points':
            'snapInterval( <percentage> , <percentage> )|snapList( <percentage># )',
        '-ms-content-zoom-snap-type': 'none|proximity|mandatory',
        '-ms-filter': '<string>',
        '-ms-flow-from': '[none|<custom-ident>]#',
        '-ms-flow-into': '[none|<custom-ident>]#',
        '-ms-grid-columns': 'none|<track-list>|<auto-track-list>',
        '-ms-grid-rows': 'none|<track-list>|<auto-track-list>',
        '-ms-high-contrast-adjust': 'auto|none',
        '-ms-hyphenate-limit-chars': 'auto|<integer>{1,3}',
        '-ms-hyphenate-limit-lines': 'no-limit|<integer>',
        '-ms-hyphenate-limit-zone': '<percentage>|<length>',
        '-ms-ime-align': 'auto|after',
        '-ms-overflow-style': 'auto|none|scrollbar|-ms-autohiding-scrollbar',
        '-ms-scrollbar-3dlight-color': '<color>',
        '-ms-scrollbar-arrow-color': '<color>',
        '-ms-scrollbar-base-color': '<color>',
        '-ms-scrollbar-darkshadow-color': '<color>',
        '-ms-scrollbar-face-color': '<color>',
        '-ms-scrollbar-highlight-color': '<color>',
        '-ms-scrollbar-shadow-color': '<color>',
        '-ms-scrollbar-track-color': '<color>',
        '-ms-scroll-chaining': 'chained|none',
        '-ms-scroll-limit':
            "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
        '-ms-scroll-limit-x-max': 'auto|<length>',
        '-ms-scroll-limit-x-min': '<length>',
        '-ms-scroll-limit-y-max': 'auto|<length>',
        '-ms-scroll-limit-y-min': '<length>',
        '-ms-scroll-rails': 'none|railed',
        '-ms-scroll-snap-points-x':
            'snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )',
        '-ms-scroll-snap-points-y':
            'snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )',
        '-ms-scroll-snap-type': 'none|proximity|mandatory',
        '-ms-scroll-snap-x': "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
        '-ms-scroll-snap-y': "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
        '-ms-scroll-translation': 'none|vertical-to-horizontal',
        '-ms-text-autospace':
            'none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space',
        '-ms-touch-select': 'grippers|none',
        '-ms-user-select': 'none|element|text',
        '-ms-wrap-flow': 'auto|both|start|end|maximum|clear',
        '-ms-wrap-margin': '<length>',
        '-ms-wrap-through': 'wrap|none',
        '-moz-appearance':
            'none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized',
        '-moz-binding': '<url>|none',
        '-moz-border-bottom-colors': '<color>+|none',
        '-moz-border-left-colors': '<color>+|none',
        '-moz-border-right-colors': '<color>+|none',
        '-moz-border-top-colors': '<color>+|none',
        '-moz-context-properties': 'none|[fill|fill-opacity|stroke|stroke-opacity]#',
        '-moz-float-edge': 'border-box|content-box|margin-box|padding-box',
        '-moz-force-broken-image-icon': '0|1',
        '-moz-image-region': '<shape>|auto',
        '-moz-orient': 'inline|block|horizontal|vertical',
        '-moz-outline-radius': '<outline-radius>{1,4} [/ <outline-radius>{1,4}]?',
        '-moz-outline-radius-bottomleft': '<outline-radius>',
        '-moz-outline-radius-bottomright': '<outline-radius>',
        '-moz-outline-radius-topleft': '<outline-radius>',
        '-moz-outline-radius-topright': '<outline-radius>',
        '-moz-stack-sizing': 'ignore|stretch-to-fit',
        '-moz-text-blink': 'none|blink',
        '-moz-user-focus':
            'ignore|normal|select-after|select-before|select-menu|select-same|select-all|none',
        '-moz-user-input': 'auto|none|enabled|disabled',
        '-moz-user-modify': 'read-only|read-write|write-only',
        '-moz-window-dragging': 'drag|no-drag',
        '-moz-window-shadow': 'default|menu|tooltip|sheet|none',
        '-webkit-appearance':
            'none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button',
        '-webkit-border-before': "<'border-width'>||<'border-style'>||<color>",
        '-webkit-border-before-color': '<color>',
        '-webkit-border-before-style': "<'border-style'>",
        '-webkit-border-before-width': "<'border-width'>",
        '-webkit-box-reflect': '[above|below|right|left]? <length>? <image>?',
        '-webkit-line-clamp': 'none|<integer>',
        '-webkit-mask':
            '[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#',
        '-webkit-mask-attachment': '<attachment>#',
        '-webkit-mask-clip': '[<box>|border|padding|content|text]#',
        '-webkit-mask-composite': '<composite-style>#',
        '-webkit-mask-image': '<mask-reference>#',
        '-webkit-mask-origin': '[<box>|border|padding|content]#',
        '-webkit-mask-position': '<position>#',
        '-webkit-mask-position-x': '[<length-percentage>|left|center|right]#',
        '-webkit-mask-position-y': '[<length-percentage>|top|center|bottom]#',
        '-webkit-mask-repeat': '<repeat-style>#',
        '-webkit-mask-repeat-x': 'repeat|no-repeat|space|round',
        '-webkit-mask-repeat-y': 'repeat|no-repeat|space|round',
        '-webkit-mask-size': '<bg-size>#',
        '-webkit-overflow-scrolling': 'auto|touch',
        '-webkit-tap-highlight-color': '<color>',
        '-webkit-text-fill-color': '<color>',
        '-webkit-text-stroke': '<length>||<color>',
        '-webkit-text-stroke-color': '<color>',
        '-webkit-text-stroke-width': '<length>',
        '-webkit-touch-callout': 'default|none',
        '-webkit-user-modify': 'read-only|read-write|read-write-plaintext-only',
        'accent-color': 'auto|<color>',
        'align-content':
            'normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>',
        'align-items': 'normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]',
        'align-self':
            'auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>',
        'align-tracks':
            '[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#',
        all: 'initial|inherit|unset|revert|revert-layer',
        animation: '<single-animation>#',
        'animation-composition': '<single-animation-composition>#',
        'animation-delay': '<time>#',
        'animation-direction': '<single-animation-direction>#',
        'animation-duration': '<time>#',
        'animation-fill-mode': '<single-animation-fill-mode>#',
        'animation-iteration-count': '<single-animation-iteration-count>#',
        'animation-name': '[none|<keyframes-name>]#',
        'animation-play-state': '<single-animation-play-state>#',
        'animation-timing-function': '<easing-function>#',
        'animation-timeline': '<single-animation-timeline>#',
        appearance: 'none|auto|textfield|menulist-button|<compat-auto>',
        'aspect-ratio': 'auto|<ratio>',
        azimuth:
            '<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards',
        'backdrop-filter': 'none|<filter-function-list>',
        'backface-visibility': 'visible|hidden',
        background: '[<bg-layer> ,]* <final-bg-layer>',
        'background-attachment': '<attachment>#',
        'background-blend-mode': '<blend-mode>#',
        'background-clip': '<bg-clip>#',
        'background-color': '<color>',
        'background-image': '<bg-image>#',
        'background-origin': '<box>#',
        'background-position': '<bg-position>#',
        'background-position-x': '[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#',
        'background-position-y': '[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#',
        'background-repeat': '<repeat-style>#',
        'background-size': '<bg-size>#',
        'block-overflow': 'clip|ellipsis|<string>',
        'block-size': "<'width'>",
        border: '<line-width>||<line-style>||<color>',
        'border-block': "<'border-top-width'>||<'border-top-style'>||<color>",
        'border-block-color': "<'border-top-color'>{1,2}",
        'border-block-style': "<'border-top-style'>",
        'border-block-width': "<'border-top-width'>",
        'border-block-end': "<'border-top-width'>||<'border-top-style'>||<color>",
        'border-block-end-color': "<'border-top-color'>",
        'border-block-end-style': "<'border-top-style'>",
        'border-block-end-width': "<'border-top-width'>",
        'border-block-start': "<'border-top-width'>||<'border-top-style'>||<color>",
        'border-block-start-color': "<'border-top-color'>",
        'border-block-start-style': "<'border-top-style'>",
        'border-block-start-width': "<'border-top-width'>",
        'border-bottom': '<line-width>||<line-style>||<color>',
        'border-bottom-color': "<'border-top-color'>",
        'border-bottom-left-radius': '<length-percentage>{1,2}',
        'border-bottom-right-radius': '<length-percentage>{1,2}',
        'border-bottom-style': '<line-style>',
        'border-bottom-width': '<line-width>',
        'border-collapse': 'collapse|separate',
        'border-color': '<color>{1,4}',
        'border-end-end-radius': '<length-percentage>{1,2}',
        'border-end-start-radius': '<length-percentage>{1,2}',
        'border-image':
            "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
        'border-image-outset': '[<length>|<number>]{1,4}',
        'border-image-repeat': '[stretch|repeat|round|space]{1,2}',
        'border-image-slice': '<number-percentage>{1,4}&&fill?',
        'border-image-source': 'none|<image>',
        'border-image-width': '[<length-percentage>|<number>|auto]{1,4}',
        'border-inline': "<'border-top-width'>||<'border-top-style'>||<color>",
        'border-inline-end': "<'border-top-width'>||<'border-top-style'>||<color>",
        'border-inline-color': "<'border-top-color'>{1,2}",
        'border-inline-style': "<'border-top-style'>",
        'border-inline-width': "<'border-top-width'>",
        'border-inline-end-color': "<'border-top-color'>",
        'border-inline-end-style': "<'border-top-style'>",
        'border-inline-end-width': "<'border-top-width'>",
        'border-inline-start': "<'border-top-width'>||<'border-top-style'>||<color>",
        'border-inline-start-color': "<'border-top-color'>",
        'border-inline-start-style': "<'border-top-style'>",
        'border-inline-start-width': "<'border-top-width'>",
        'border-left': '<line-width>||<line-style>||<color>',
        'border-left-color': '<color>',
        'border-left-style': '<line-style>',
        'border-left-width': '<line-width>',
        'border-radius': '<length-percentage>{1,4} [/ <length-percentage>{1,4}]?',
        'border-right': '<line-width>||<line-style>||<color>',
        'border-right-color': '<color>',
        'border-right-style': '<line-style>',
        'border-right-width': '<line-width>',
        'border-spacing': '<length> <length>?',
        'border-start-end-radius': '<length-percentage>{1,2}',
        'border-start-start-radius': '<length-percentage>{1,2}',
        'border-style': '<line-style>{1,4}',
        'border-top': '<line-width>||<line-style>||<color>',
        'border-top-color': '<color>',
        'border-top-left-radius': '<length-percentage>{1,2}',
        'border-top-right-radius': '<length-percentage>{1,2}',
        'border-top-style': '<line-style>',
        'border-top-width': '<line-width>',
        'border-width': '<line-width>{1,4}',
        bottom: '<length>|<percentage>|auto',
        'box-align': 'start|center|end|baseline|stretch',
        'box-decoration-break': 'slice|clone',
        'box-direction': 'normal|reverse|inherit',
        'box-flex': '<number>',
        'box-flex-group': '<integer>',
        'box-lines': 'single|multiple',
        'box-ordinal-group': '<integer>',
        'box-orient': 'horizontal|vertical|inline-axis|block-axis|inherit',
        'box-pack': 'start|center|end|justify',
        'box-shadow': 'none|<shadow>#',
        'box-sizing': 'content-box|border-box',
        'break-after':
            'auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region',
        'break-before':
            'auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region',
        'break-inside': 'auto|avoid|avoid-page|avoid-column|avoid-region',
        'caption-side': 'top|bottom|block-start|block-end|inline-start|inline-end',
        caret: "<'caret-color'>||<'caret-shape'>",
        'caret-color': 'auto|<color>',
        'caret-shape': 'auto|bar|block|underscore',
        clear: 'none|left|right|both|inline-start|inline-end',
        clip: '<shape>|auto',
        'clip-path': '<clip-source>|[<basic-shape>||<geometry-box>]|none',
        color: '<color>',
        'print-color-adjust': 'economy|exact',
        'color-scheme': 'normal|[light|dark|<custom-ident>]+&&only?',
        'column-count': '<integer>|auto',
        'column-fill': 'auto|balance|balance-all',
        'column-gap': 'normal|<length-percentage>',
        'column-rule': "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
        'column-rule-color': '<color>',
        'column-rule-style': "<'border-style'>",
        'column-rule-width': "<'border-width'>",
        'column-span': 'none|all',
        'column-width': '<length>|auto',
        columns: "<'column-width'>||<'column-count'>",
        contain: 'none|strict|content|[[size||inline-size]||layout||style||paint]',
        'contain-intrinsic-size': '[none|<length>|auto <length>]{1,2}',
        'contain-intrinsic-block-size': 'none|<length>|auto <length>',
        'contain-intrinsic-height': 'none|<length>|auto <length>',
        'contain-intrinsic-inline-size': 'none|<length>|auto <length>',
        'contain-intrinsic-width': 'none|<length>|auto <length>',
        content: 'normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>]+]?',
        'content-visibility': 'visible|auto|hidden',
        'counter-increment': '[<counter-name> <integer>?]+|none',
        'counter-reset': '[<counter-name> <integer>?|<reversed-counter-name> <integer>?]+|none',
        'counter-set': '[<counter-name> <integer>?]+|none',
        cursor: '[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]',
        direction: 'ltr|rtl',
        display:
            '[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>',
        'empty-cells': 'show|hide',
        filter: 'none|<filter-function-list>|<-ms-filter-function-list>',
        flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
        'flex-basis': "content|<'width'>",
        'flex-direction': 'row|row-reverse|column|column-reverse',
        'flex-flow': "<'flex-direction'>||<'flex-wrap'>",
        'flex-grow': '<number>',
        'flex-shrink': '<number>',
        'flex-wrap': 'nowrap|wrap|wrap-reverse',
        float: 'left|right|none|inline-start|inline-end',
        font: "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
        'font-family': '[<family-name>|<generic-family>]#',
        'font-feature-settings': 'normal|<feature-tag-value>#',
        'font-kerning': 'auto|normal|none',
        'font-language-override': 'normal|<string>',
        'font-optical-sizing': 'auto|none',
        'font-variation-settings': 'normal|[<string> <number>]#',
        'font-size': '<absolute-size>|<relative-size>|<length-percentage>',
        'font-size-adjust':
            'none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]',
        'font-smooth': 'auto|never|always|<absolute-size>|<length>',
        'font-stretch': '<font-stretch-absolute>',
        'font-style': 'normal|italic|oblique <angle>?',
        'font-synthesis': 'none|[weight||style||small-caps]',
        'font-variant':
            'normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]',
        'font-variant-alternates':
            'normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]',
        'font-variant-caps':
            'normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps',
        'font-variant-east-asian':
            'normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]',
        'font-variant-ligatures':
            'normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]',
        'font-variant-numeric':
            'normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]',
        'font-variant-position': 'normal|sub|super',
        'font-weight': '<font-weight-absolute>|bolder|lighter',
        'forced-color-adjust': 'auto|none',
        gap: "<'row-gap'> <'column-gap'>?",
        grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
        'grid-area': '<grid-line> [/ <grid-line>]{0,3}',
        'grid-auto-columns': '<track-size>+',
        'grid-auto-flow': '[row|column]||dense',
        'grid-auto-rows': '<track-size>+',
        'grid-column': '<grid-line> [/ <grid-line>]?',
        'grid-column-end': '<grid-line>',
        'grid-column-gap': '<length-percentage>',
        'grid-column-start': '<grid-line>',
        'grid-gap': "<'grid-row-gap'> <'grid-column-gap'>?",
        'grid-row': '<grid-line> [/ <grid-line>]?',
        'grid-row-end': '<grid-line>',
        'grid-row-gap': '<length-percentage>',
        'grid-row-start': '<grid-line>',
        'grid-template':
            "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
        'grid-template-areas': 'none|<string>+',
        'grid-template-columns': 'none|<track-list>|<auto-track-list>|subgrid <line-name-list>?',
        'grid-template-rows': 'none|<track-list>|<auto-track-list>|subgrid <line-name-list>?',
        'hanging-punctuation': 'none|[first||[force-end|allow-end]||last]',
        height: 'auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )',
        'hyphenate-character': 'auto|<string>',
        hyphens: 'none|manual|auto',
        'image-orientation': 'from-image|<angle>|[<angle>? flip]',
        'image-rendering':
            'auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>',
        'image-resolution': '[from-image||<resolution>]&&snap?',
        'ime-mode': 'auto|normal|active|inactive|disabled',
        'initial-letter': 'normal|[<number> <integer>?]',
        'initial-letter-align': '[auto|alphabetic|hanging|ideographic]',
        'inline-size': "<'width'>",
        'input-security': 'auto|none',
        inset: "<'top'>{1,4}",
        'inset-block': "<'top'>{1,2}",
        'inset-block-end': "<'top'>",
        'inset-block-start': "<'top'>",
        'inset-inline': "<'top'>{1,2}",
        'inset-inline-end': "<'top'>",
        'inset-inline-start': "<'top'>",
        isolation: 'auto|isolate',
        'justify-content':
            'normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]',
        'justify-items':
            'normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]',
        'justify-self':
            'auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]',
        'justify-tracks':
            '[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#',
        left: '<length>|<percentage>|auto',
        'letter-spacing': 'normal|<length-percentage>',
        'line-break': 'auto|loose|normal|strict|anywhere',
        'line-clamp': 'none|<integer>',
        'line-height': 'normal|<number>|<length>|<percentage>',
        'line-height-step': '<length>',
        'list-style': "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
        'list-style-image': '<image>|none',
        'list-style-position': 'inside|outside',
        'list-style-type': '<counter-style>|<string>|none',
        margin: '[<length>|<percentage>|auto]{1,4}',
        'margin-block': "<'margin-left'>{1,2}",
        'margin-block-end': "<'margin-left'>",
        'margin-block-start': "<'margin-left'>",
        'margin-bottom': '<length>|<percentage>|auto',
        'margin-inline': "<'margin-left'>{1,2}",
        'margin-inline-end': "<'margin-left'>",
        'margin-inline-start': "<'margin-left'>",
        'margin-left': '<length>|<percentage>|auto',
        'margin-right': '<length>|<percentage>|auto',
        'margin-top': '<length>|<percentage>|auto',
        'margin-trim': 'none|in-flow|all',
        mask: '<mask-layer>#',
        'mask-border':
            "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
        'mask-border-mode': 'luminance|alpha',
        'mask-border-outset': '[<length>|<number>]{1,4}',
        'mask-border-repeat': '[stretch|repeat|round|space]{1,2}',
        'mask-border-slice': '<number-percentage>{1,4} fill?',
        'mask-border-source': 'none|<image>',
        'mask-border-width': '[<length-percentage>|<number>|auto]{1,4}',
        'mask-clip': '[<geometry-box>|no-clip]#',
        'mask-composite': '<compositing-operator>#',
        'mask-image': '<mask-reference>#',
        'mask-mode': '<masking-mode>#',
        'mask-origin': '<geometry-box>#',
        'mask-position': '<position>#',
        'mask-repeat': '<repeat-style>#',
        'mask-size': '<bg-size>#',
        'mask-type': 'luminance|alpha',
        'masonry-auto-flow': '[pack|next]||[definite-first|ordered]',
        'math-depth': 'auto-add|add( <integer> )|<integer>',
        'math-shift': 'normal|compact',
        'math-style': 'normal|compact',
        'max-block-size': "<'max-width'>",
        'max-height':
            'none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )',
        'max-inline-size': "<'max-width'>",
        'max-lines': 'none|<integer>',
        'max-width':
            'none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>',
        'min-block-size': "<'min-width'>",
        'min-height':
            'auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )',
        'min-inline-size': "<'min-width'>",
        'min-width':
            'auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>',
        'mix-blend-mode': '<blend-mode>|plus-lighter',
        'object-fit': 'fill|contain|cover|none|scale-down',
        'object-position': '<position>',
        offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
        'offset-anchor': 'auto|<position>',
        'offset-distance': '<length-percentage>',
        'offset-path':
            'none|ray( [<angle>&&<size>&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]',
        'offset-position': 'auto|<position>',
        'offset-rotate': '[auto|reverse]||<angle>',
        opacity: '<alpha-value>',
        order: '<integer>',
        orphans: '<integer>',
        outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
        'outline-color': '<color>|invert',
        'outline-offset': '<length>',
        'outline-style': "auto|<'border-style'>",
        'outline-width': '<line-width>',
        overflow: '[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>',
        'overflow-anchor': 'auto|none',
        'overflow-block': 'visible|hidden|clip|scroll|auto',
        'overflow-clip-box': 'padding-box|content-box',
        'overflow-clip-margin': '<visual-box>||<length [0,\u221E]>',
        'overflow-inline': 'visible|hidden|clip|scroll|auto',
        'overflow-wrap': 'normal|break-word|anywhere',
        'overflow-x': 'visible|hidden|clip|scroll|auto',
        'overflow-y': 'visible|hidden|clip|scroll|auto',
        'overscroll-behavior': '[contain|none|auto]{1,2}',
        'overscroll-behavior-block': 'contain|none|auto',
        'overscroll-behavior-inline': 'contain|none|auto',
        'overscroll-behavior-x': 'contain|none|auto',
        'overscroll-behavior-y': 'contain|none|auto',
        padding: '[<length>|<percentage>]{1,4}',
        'padding-block': "<'padding-left'>{1,2}",
        'padding-block-end': "<'padding-left'>",
        'padding-block-start': "<'padding-left'>",
        'padding-bottom': '<length>|<percentage>',
        'padding-inline': "<'padding-left'>{1,2}",
        'padding-inline-end': "<'padding-left'>",
        'padding-inline-start': "<'padding-left'>",
        'padding-left': '<length>|<percentage>',
        'padding-right': '<length>|<percentage>',
        'padding-top': '<length>|<percentage>',
        'page-break-after': 'auto|always|avoid|left|right|recto|verso',
        'page-break-before': 'auto|always|avoid|left|right|recto|verso',
        'page-break-inside': 'auto|avoid',
        'paint-order': 'normal|[fill||stroke||markers]',
        perspective: 'none|<length>',
        'perspective-origin': '<position>',
        'place-content': "<'align-content'> <'justify-content'>?",
        'place-items': "<'align-items'> <'justify-items'>?",
        'place-self': "<'align-self'> <'justify-self'>?",
        'pointer-events':
            'auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit',
        position: 'static|relative|absolute|sticky|fixed|-webkit-sticky',
        quotes: 'none|auto|[<string> <string>]+',
        resize: 'none|both|horizontal|vertical|block|inline',
        right: '<length>|<percentage>|auto',
        rotate: 'none|<angle>|[x|y|z|<number>{3}]&&<angle>',
        'row-gap': 'normal|<length-percentage>',
        'ruby-align': 'start|center|space-between|space-around',
        'ruby-merge': 'separate|collapse|auto',
        'ruby-position': '[alternate||[over|under]]|inter-character',
        scale: 'none|<number>{1,3}',
        'scrollbar-color': 'auto|<color>{2}',
        'scrollbar-gutter': 'auto|stable&&both-edges?',
        'scrollbar-width': 'auto|thin|none',
        'scroll-behavior': 'auto|smooth',
        'scroll-margin': '<length>{1,4}',
        'scroll-margin-block': '<length>{1,2}',
        'scroll-margin-block-start': '<length>',
        'scroll-margin-block-end': '<length>',
        'scroll-margin-bottom': '<length>',
        'scroll-margin-inline': '<length>{1,2}',
        'scroll-margin-inline-start': '<length>',
        'scroll-margin-inline-end': '<length>',
        'scroll-margin-left': '<length>',
        'scroll-margin-right': '<length>',
        'scroll-margin-top': '<length>',
        'scroll-padding': '[auto|<length-percentage>]{1,4}',
        'scroll-padding-block': '[auto|<length-percentage>]{1,2}',
        'scroll-padding-block-start': 'auto|<length-percentage>',
        'scroll-padding-block-end': 'auto|<length-percentage>',
        'scroll-padding-bottom': 'auto|<length-percentage>',
        'scroll-padding-inline': '[auto|<length-percentage>]{1,2}',
        'scroll-padding-inline-start': 'auto|<length-percentage>',
        'scroll-padding-inline-end': 'auto|<length-percentage>',
        'scroll-padding-left': 'auto|<length-percentage>',
        'scroll-padding-right': 'auto|<length-percentage>',
        'scroll-padding-top': 'auto|<length-percentage>',
        'scroll-snap-align': '[none|start|end|center]{1,2}',
        'scroll-snap-coordinate': 'none|<position>#',
        'scroll-snap-destination': '<position>',
        'scroll-snap-points-x': 'none|repeat( <length-percentage> )',
        'scroll-snap-points-y': 'none|repeat( <length-percentage> )',
        'scroll-snap-stop': 'normal|always',
        'scroll-snap-type': 'none|[x|y|block|inline|both] [mandatory|proximity]?',
        'scroll-snap-type-x': 'none|mandatory|proximity',
        'scroll-snap-type-y': 'none|mandatory|proximity',
        'scroll-timeline': '<scroll-timeline-name>||<scroll-timeline-axis>',
        'scroll-timeline-axis': 'block|inline|vertical|horizontal',
        'scroll-timeline-name': 'none|<custom-ident>',
        'shape-image-threshold': '<alpha-value>',
        'shape-margin': '<length-percentage>',
        'shape-outside': 'none|[<shape-box>||<basic-shape>]|<image>',
        'tab-size': '<integer>|<length>',
        'table-layout': 'auto|fixed',
        'text-align': 'start|end|left|right|center|justify|match-parent',
        'text-align-last': 'auto|start|end|left|right|center|justify',
        'text-combine-upright': 'none|all|[digits <integer>?]',
        'text-decoration':
            "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
        'text-decoration-color': '<color>',
        'text-decoration-line':
            'none|[underline||overline||line-through||blink]|spelling-error|grammar-error',
        'text-decoration-skip':
            'none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]',
        'text-decoration-skip-ink': 'auto|all|none',
        'text-decoration-style': 'solid|double|dotted|dashed|wavy',
        'text-decoration-thickness': 'auto|from-font|<length>|<percentage>',
        'text-emphasis': "<'text-emphasis-style'>||<'text-emphasis-color'>",
        'text-emphasis-color': '<color>',
        'text-emphasis-position': '[over|under]&&[right|left]',
        'text-emphasis-style':
            'none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>',
        'text-indent': '<length-percentage>&&hanging?&&each-line?',
        'text-justify': 'auto|inter-character|inter-word|none',
        'text-orientation': 'mixed|upright|sideways',
        'text-overflow': '[clip|ellipsis|<string>]{1,2}',
        'text-rendering': 'auto|optimizeSpeed|optimizeLegibility|geometricPrecision',
        'text-shadow': 'none|<shadow-t>#',
        'text-size-adjust': 'none|auto|<percentage>',
        'text-transform': 'none|capitalize|uppercase|lowercase|full-width|full-size-kana',
        'text-underline-offset': 'auto|<length>|<percentage>',
        'text-underline-position': 'auto|from-font|[under||[left|right]]',
        top: '<length>|<percentage>|auto',
        'touch-action':
            'auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation',
        transform: 'none|<transform-list>',
        'transform-box': 'content-box|border-box|fill-box|stroke-box|view-box',
        'transform-origin':
            '[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?',
        'transform-style': 'flat|preserve-3d',
        transition: '<single-transition>#',
        'transition-delay': '<time>#',
        'transition-duration': '<time>#',
        'transition-property': 'none|<single-transition-property>#',
        'transition-timing-function': '<easing-function>#',
        translate: 'none|<length-percentage> [<length-percentage> <length>?]?',
        'unicode-bidi':
            'normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext',
        'user-select': 'auto|text|none|contain|all',
        'vertical-align':
            'baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>',
        visibility: 'visible|hidden|collapse',
        'white-space': 'normal|pre|nowrap|pre-wrap|pre-line|break-spaces',
        widows: '<integer>',
        width: 'auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|fill|stretch|intrinsic|-moz-max-content|-webkit-max-content|-moz-fit-content|-webkit-fit-content',
        'will-change': 'auto|<animateable-feature>#',
        'word-break': 'normal|break-all|keep-all|break-word',
        'word-spacing': 'normal|<length>',
        'word-wrap': 'normal|break-word',
        'writing-mode':
            'horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>',
        'z-index': 'auto|<integer>',
        zoom: 'normal|reset|<number>|<percentage>',
        '-moz-background-clip': 'padding|border',
        '-moz-border-radius-bottomleft': "<'border-bottom-left-radius'>",
        '-moz-border-radius-bottomright': "<'border-bottom-right-radius'>",
        '-moz-border-radius-topleft': "<'border-top-left-radius'>",
        '-moz-border-radius-topright': "<'border-bottom-right-radius'>",
        '-moz-control-character-visibility': 'visible|hidden',
        '-moz-osx-font-smoothing': 'auto|grayscale',
        '-moz-user-select': 'none|text|all|-moz-none',
        '-ms-flex-align': 'start|end|center|baseline|stretch',
        '-ms-flex-item-align': 'auto|start|end|center|baseline|stretch',
        '-ms-flex-line-pack': 'start|end|center|justify|distribute|stretch',
        '-ms-flex-negative': "<'flex-shrink'>",
        '-ms-flex-pack': 'start|end|center|justify|distribute',
        '-ms-flex-order': '<integer>',
        '-ms-flex-positive': "<'flex-grow'>",
        '-ms-flex-preferred-size': "<'flex-basis'>",
        '-ms-interpolation-mode': 'nearest-neighbor|bicubic',
        '-ms-grid-column-align': 'start|end|center|stretch',
        '-ms-grid-row-align': 'start|end|center|stretch',
        '-ms-hyphenate-limit-last': 'none|always|column|page|spread',
        '-webkit-background-clip': '[<box>|border|padding|content|text]#',
        '-webkit-column-break-after': 'always|auto|avoid',
        '-webkit-column-break-before': 'always|auto|avoid',
        '-webkit-column-break-inside': 'always|auto|avoid',
        '-webkit-font-smoothing': 'auto|none|antialiased|subpixel-antialiased',
        '-webkit-mask-box-image':
            '[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?',
        '-webkit-print-color-adjust': 'economy|exact',
        '-webkit-text-security': 'none|circle|disc|square',
        '-webkit-user-drag': 'none|element|auto',
        '-webkit-user-select': 'auto|none|text|all',
        'alignment-baseline':
            'auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical',
        'baseline-shift': 'baseline|sub|super|<svg-length>',
        behavior: '<url>+',
        'clip-rule': 'nonzero|evenodd',
        container: "<'container-name'> [/ <'container-type'>]?",
        'container-name': 'none|<custom-ident>+',
        'container-type': 'normal||[size|inline-size]',
        cue: "<'cue-before'> <'cue-after'>?",
        'cue-after': '<url> <decibel>?|none',
        'cue-before': '<url> <decibel>?|none',
        'dominant-baseline':
            'auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge',
        fill: '<paint>',
        'fill-opacity': '<number-zero-one>',
        'fill-rule': 'nonzero|evenodd',
        'glyph-orientation-horizontal': '<angle>',
        'glyph-orientation-vertical': '<angle>',
        kerning: 'auto|<svg-length>',
        marker: 'none|<url>',
        'marker-end': 'none|<url>',
        'marker-mid': 'none|<url>',
        'marker-start': 'none|<url>',
        pause: "<'pause-before'> <'pause-after'>?",
        'pause-after': '<time>|none|x-weak|weak|medium|strong|x-strong',
        'pause-before': '<time>|none|x-weak|weak|medium|strong|x-strong',
        rest: "<'rest-before'> <'rest-after'>?",
        'rest-after': '<time>|none|x-weak|weak|medium|strong|x-strong',
        'rest-before': '<time>|none|x-weak|weak|medium|strong|x-strong',
        'shape-rendering': 'auto|optimizeSpeed|crispEdges|geometricPrecision',
        src: '[<url> [format( <string># )]?|local( <family-name> )]#',
        speak: 'auto|none|normal',
        'speak-as': 'normal|spell-out||digits||[literal-punctuation|no-punctuation]',
        stroke: '<paint>',
        'stroke-dasharray': 'none|[<svg-length>+]#',
        'stroke-dashoffset': '<svg-length>',
        'stroke-linecap': 'butt|round|square',
        'stroke-linejoin': 'miter|round|bevel',
        'stroke-miterlimit': '<number-one-or-greater>',
        'stroke-opacity': '<number-zero-one>',
        'stroke-width': '<svg-length>',
        'text-anchor': 'start|middle|end',
        'unicode-range': '<urange>#',
        'voice-balance': '<number>|left|center|right|leftwards|rightwards',
        'voice-duration': 'auto|<time>',
        'voice-family':
            '[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve',
        'voice-pitch':
            '<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]',
        'voice-range':
            '<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]',
        'voice-rate': '[normal|x-slow|slow|medium|fast|x-fast]||<percentage>',
        'voice-stress': 'normal|strong|moderate|none|reduced',
        'voice-volume': 'silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]',
    },
    atrules: {
        charset: { prelude: '<string>', descriptors: null },
        'counter-style': {
            prelude: '<counter-style-name>',
            descriptors: {
                'additive-symbols': '[<integer>&&<symbol>]#',
                fallback: '<counter-style-name>',
                negative: '<symbol> <symbol>?',
                pad: '<integer>&&<symbol>',
                prefix: '<symbol>',
                range: '[[<integer>|infinite]{2}]#|auto',
                'speak-as': 'auto|bullets|numbers|words|spell-out|<counter-style-name>',
                suffix: '<symbol>',
                symbols: '<symbol>+',
                system: 'cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]',
            },
        },
        document: {
            prelude:
                '[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#',
            descriptors: null,
        },
        'font-face': {
            prelude: null,
            descriptors: {
                'ascent-override': 'normal|<percentage>',
                'descent-override': 'normal|<percentage>',
                'font-display': '[auto|block|swap|fallback|optional]',
                'font-family': '<family-name>',
                'font-feature-settings': 'normal|<feature-tag-value>#',
                'font-variation-settings': 'normal|[<string> <number>]#',
                'font-stretch': '<font-stretch-absolute>{1,2}',
                'font-style': 'normal|italic|oblique <angle>{0,2}',
                'font-weight': '<font-weight-absolute>{1,2}',
                'font-variant':
                    'normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]',
                'line-gap-override': 'normal|<percentage>',
                'size-adjust': '<percentage>',
                src: '[<url> [format( <string># )]?|local( <family-name> )]#',
                'unicode-range': '<urange>#',
            },
        },
        'font-feature-values': { prelude: '<family-name>#', descriptors: null },
        import: {
            prelude:
                '[<string>|<url>] [layer|layer( <layer-name> )]? [supports( [<supports-condition>|<declaration>] )]? <media-query-list>?',
            descriptors: null,
        },
        keyframes: { prelude: '<keyframes-name>', descriptors: null },
        layer: { prelude: '[<layer-name>#|<layer-name>?]', descriptors: null },
        media: { prelude: '<media-query-list>', descriptors: null },
        namespace: {
            prelude: '<namespace-prefix>? [<string>|<url>]',
            descriptors: null,
        },
        page: {
            prelude: '<page-selector-list>',
            descriptors: {
                bleed: 'auto|<length>',
                marks: 'none|[crop||cross]',
                size: '<length>{1,2}|auto|[<page-size>||[portrait|landscape]]',
            },
        },
        property: {
            prelude: '<custom-property-name>',
            descriptors: {
                syntax: '<string>',
                inherits: 'true|false',
                'initial-value': '<string>',
            },
        },
        'scroll-timeline': { prelude: '<timeline-name>', descriptors: null },
        supports: { prelude: '<supports-condition>', descriptors: null },
        viewport: {
            prelude: null,
            descriptors: {
                height: '<viewport-length>{1,2}',
                'max-height': '<viewport-length>',
                'max-width': '<viewport-length>',
                'max-zoom': 'auto|<number>|<percentage>',
                'min-height': '<viewport-length>',
                'min-width': '<viewport-length>',
                'min-zoom': 'auto|<number>|<percentage>',
                orientation: 'auto|portrait|landscape',
                'user-zoom': 'zoom|fixed',
                'viewport-fit': 'auto|contain|cover',
                width: '<viewport-length>{1,2}',
                zoom: 'auto|<number>|<percentage>',
            },
        },
        container: {
            prelude: '[<container-name>]? <container-condition>',
            descriptors: null,
        },
        nest: { prelude: '<complex-selector-list>', descriptors: null },
    },
};
var gt = {};
b(gt, {
    AnPlusB: () => Xr,
    Atrule: () => Zr,
    AtrulePrelude: () => en,
    AttributeSelector: () => nn,
    Block: () => an,
    Brackets: () => ln,
    CDC: () => un,
    CDO: () => hn,
    ClassSelector: () => fn,
    Combinator: () => gn,
    Comment: () => xn,
    Declaration: () => kn,
    DeclarationList: () => Sn,
    Dimension: () => An,
    Function: () => En,
    Hash: () => Pn,
    IdSelector: () => Nn,
    Identifier: () => Dn,
    MediaFeature: () => Mn,
    MediaQuery: () => Fn,
    MediaQueryList: () => _n,
    NestingSelector: () => Un,
    Nth: () => Wn,
    Number: () => Yn,
    Operator: () => Vn,
    Parentheses: () => Qn,
    Percentage: () => $n,
    PseudoClassSelector: () => Jn,
    PseudoElementSelector: () => to,
    Ratio: () => no,
    Raw: () => io,
    Rule: () => so,
    Selector: () => co,
    SelectorList: () => po,
    String: () => bo,
    StyleSheet: () => yo,
    TypeSelector: () => vo,
    UnicodeRange: () => Ao,
    Url: () => Do,
    Value: () => No,
    WhiteSpace: () => Mo,
});
var Xr = {};
b(Xr, {
    generate: () => xc,
    name: () => gc,
    parse: () => Qr,
    structure: () => bc,
});
var me = 43,
    re = 45,
    Xt = 110,
    Ie = !0,
    dc = !1;
function $t(e, t) {
    let r = this.tokenStart + e,
        n = this.charCodeAt(r);
    for (
        (n === me || n === re) && (t && this.error('Number sign is not allowed'), r++);
        r < this.tokenEnd;
        r++
    )
        B(this.charCodeAt(r)) || this.error('Integer is expected', r);
}
function Qe(e) {
    return $t.call(this, 0, e);
}
function Ce(e, t) {
    if (!this.cmpChar(this.tokenStart + e, t)) {
        let r = '';
        switch (t) {
            case Xt:
                r = 'N is expected';
                break;
            case re:
                r = 'HyphenMinus is expected';
                break;
        }
        this.error(r, this.tokenStart + e);
    }
}
function Kr() {
    let e = 0,
        t = 0,
        r = this.tokenType;
    for (; r === 13 || r === 25; ) r = this.lookupType(++e);
    if (r !== 10)
        if (this.isDelim(me, e) || this.isDelim(re, e)) {
            t = this.isDelim(me, e) ? me : re;
            do r = this.lookupType(++e);
            while (r === 13 || r === 25);
            r !== 10 && (this.skip(e), Qe.call(this, Ie));
        } else return null;
    return (
        e > 0 && this.skip(e),
        t === 0 &&
            ((r = this.charCodeAt(this.tokenStart)),
            r !== me && r !== re && this.error('Number sign is expected')),
        Qe.call(this, t !== 0),
        t === re ? '-' + this.consume(10) : this.consume(10)
    );
}
var gc = 'AnPlusB',
    bc = { a: [String, null], b: [String, null] };
function Qr() {
    let e = this.tokenStart,
        t = null,
        r = null;
    if (this.tokenType === 10) Qe.call(this, dc), (r = this.consume(10));
    else if (this.tokenType === 1 && this.cmpChar(this.tokenStart, re))
        switch (((t = '-1'), Ce.call(this, 1, Xt), this.tokenEnd - this.tokenStart)) {
            case 2:
                this.next(), (r = Kr.call(this));
                break;
            case 3:
                Ce.call(this, 2, re),
                    this.next(),
                    this.skipSC(),
                    Qe.call(this, Ie),
                    (r = '-' + this.consume(10));
                break;
            default:
                Ce.call(this, 2, re),
                    $t.call(this, 3, Ie),
                    this.next(),
                    (r = this.substrToCursor(e + 2));
        }
    else if (this.tokenType === 1 || (this.isDelim(me) && this.lookupType(1) === 1)) {
        let n = 0;
        switch (
            ((t = '1'),
            this.isDelim(me) && ((n = 1), this.next()),
            Ce.call(this, 0, Xt),
            this.tokenEnd - this.tokenStart)
        ) {
            case 1:
                this.next(), (r = Kr.call(this));
                break;
            case 2:
                Ce.call(this, 1, re),
                    this.next(),
                    this.skipSC(),
                    Qe.call(this, Ie),
                    (r = '-' + this.consume(10));
                break;
            default:
                Ce.call(this, 1, re),
                    $t.call(this, 2, Ie),
                    this.next(),
                    (r = this.substrToCursor(e + n + 1));
        }
    } else if (this.tokenType === 12) {
        let n = this.charCodeAt(this.tokenStart),
            o = n === me || n === re,
            i = this.tokenStart + o;
        for (; i < this.tokenEnd && B(this.charCodeAt(i)); i++);
        i === this.tokenStart + o && this.error('Integer is expected', this.tokenStart + o),
            Ce.call(this, i - this.tokenStart, Xt),
            (t = this.substring(e, i)),
            i + 1 === this.tokenEnd
                ? (this.next(), (r = Kr.call(this)))
                : (Ce.call(this, i - this.tokenStart + 1, re),
                  i + 2 === this.tokenEnd
                      ? (this.next(),
                        this.skipSC(),
                        Qe.call(this, Ie),
                        (r = '-' + this.consume(10)))
                      : ($t.call(this, i - this.tokenStart + 2, Ie),
                        this.next(),
                        (r = this.substrToCursor(i + 1))));
    } else this.error();
    return (
        t !== null && t.charCodeAt(0) === me && (t = t.substr(1)),
        r !== null && r.charCodeAt(0) === me && (r = r.substr(1)),
        {
            type: 'AnPlusB',
            loc: this.getLocation(e, this.tokenStart),
            a: t,
            b: r,
        }
    );
}
function xc(e) {
    if (e.a) {
        let t =
            (e.a === '+1' && 'n') || (e.a === '1' && 'n') || (e.a === '-1' && '-n') || e.a + 'n';
        if (e.b) {
            let r = e.b[0] === '-' || e.b[0] === '+' ? e.b : '+' + e.b;
            this.tokenize(t + r);
        } else this.tokenize(t);
    } else this.tokenize(e.b);
}
var Zr = {};
b(Zr, {
    generate: () => Sc,
    name: () => kc,
    parse: () => $r,
    structure: () => vc,
    walkContext: () => wc,
});
function da(e) {
    return this.Raw(e, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function yc() {
    for (let e = 1, t; (t = this.lookupType(e)); e++) {
        if (t === 24) return !0;
        if (t === 23 || t === 3) return !1;
    }
    return !1;
}
var kc = 'Atrule',
    wc = 'atrule',
    vc = {
        name: String,
        prelude: ['AtrulePrelude', 'Raw', null],
        block: ['Block', null],
    };
function $r(e = !1) {
    let t = this.tokenStart,
        r,
        n,
        o = null,
        i = null;
    switch (
        (this.eat(3),
        (r = this.substrToCursor(t + 1)),
        (n = r.toLowerCase()),
        this.skipSC(),
        this.eof === !1 &&
            this.tokenType !== 23 &&
            this.tokenType !== 17 &&
            (this.parseAtrulePrelude
                ? (o = this.parseWithFallback(this.AtrulePrelude.bind(this, r, e), da))
                : (o = da.call(this, this.tokenIndex)),
            this.skipSC()),
        this.tokenType)
    ) {
        case 17:
            this.next();
            break;
        case 23:
            hasOwnProperty.call(this.atrule, n) && typeof this.atrule[n].block == 'function'
                ? (i = this.atrule[n].block.call(this, e))
                : (i = this.Block(yc.call(this)));
            break;
    }
    return {
        type: 'Atrule',
        loc: this.getLocation(t, this.tokenStart),
        name: r,
        prelude: o,
        block: i,
    };
}
function Sc(e) {
    this.token(3, '@' + e.name),
        e.prelude !== null && this.node(e.prelude),
        e.block ? this.node(e.block) : this.token(17, ';');
}
var en = {};
b(en, {
    generate: () => Ec,
    name: () => Cc,
    parse: () => Jr,
    structure: () => Tc,
    walkContext: () => Ac,
});
var Cc = 'AtrulePrelude',
    Ac = 'atrulePrelude',
    Tc = { children: [[]] };
function Jr(e) {
    let t = null;
    return (
        e !== null && (e = e.toLowerCase()),
        this.skipSC(),
        hasOwnProperty.call(this.atrule, e) && typeof this.atrule[e].prelude == 'function'
            ? (t = this.atrule[e].prelude.call(this))
            : (t = this.readSequence(this.scope.AtrulePrelude)),
        this.skipSC(),
        this.eof !== !0 &&
            this.tokenType !== 23 &&
            this.tokenType !== 17 &&
            this.error('Semicolon or block is expected'),
        { type: 'AtrulePrelude', loc: this.getLocationFromList(t), children: t }
    );
}
function Ec(e) {
    this.children(e);
}
var nn = {};
b(nn, {
    generate: () => Mc,
    name: () => Nc,
    parse: () => rn,
    structure: () => zc,
});
var Lc = 36,
    ga = 42,
    Zt = 61,
    Pc = 94,
    tn = 124,
    Ic = 126;
function Dc() {
    this.eof && this.error('Unexpected end of input');
    let e = this.tokenStart,
        t = !1;
    return (
        this.isDelim(ga) ? ((t = !0), this.next()) : this.isDelim(tn) || this.eat(1),
        this.isDelim(tn)
            ? this.charCodeAt(this.tokenStart + 1) !== Zt
                ? (this.next(), this.eat(1))
                : t && this.error('Identifier is expected', this.tokenEnd)
            : t && this.error('Vertical line is expected'),
        {
            type: 'Identifier',
            loc: this.getLocation(e, this.tokenStart),
            name: this.substrToCursor(e),
        }
    );
}
function Oc() {
    let e = this.tokenStart,
        t = this.charCodeAt(e);
    return (
        t !== Zt &&
            t !== Ic &&
            t !== Pc &&
            t !== Lc &&
            t !== ga &&
            t !== tn &&
            this.error('Attribute selector (=, ~=, ^=, $=, *=, |=) is expected'),
        this.next(),
        t !== Zt && (this.isDelim(Zt) || this.error('Equal sign is expected'), this.next()),
        this.substrToCursor(e)
    );
}
var Nc = 'AttributeSelector',
    zc = {
        name: 'Identifier',
        matcher: [String, null],
        value: ['String', 'Identifier', null],
        flags: [String, null],
    };
function rn() {
    let e = this.tokenStart,
        t,
        r = null,
        n = null,
        o = null;
    return (
        this.eat(19),
        this.skipSC(),
        (t = Dc.call(this)),
        this.skipSC(),
        this.tokenType !== 20 &&
            (this.tokenType !== 1 &&
                ((r = Oc.call(this)),
                this.skipSC(),
                (n = this.tokenType === 5 ? this.String() : this.Identifier()),
                this.skipSC()),
            this.tokenType === 1 && ((o = this.consume(1)), this.skipSC())),
        this.eat(20),
        {
            type: 'AttributeSelector',
            loc: this.getLocation(e, this.tokenStart),
            name: t,
            matcher: r,
            value: n,
            flags: o,
        }
    );
}
function Mc(e) {
    this.token(9, '['),
        this.node(e.name),
        e.matcher !== null && (this.tokenize(e.matcher), this.node(e.value)),
        e.flags !== null && this.token(1, e.flags),
        this.token(9, ']');
}
var an = {};
b(an, {
    generate: () => Uc,
    name: () => Bc,
    parse: () => on,
    structure: () => qc,
    walkContext: () => _c,
});
var Rc = 38;
function ya(e) {
    return this.Raw(e, null, !0);
}
function ba() {
    return this.parseWithFallback(this.Rule, ya);
}
function xa(e) {
    return this.Raw(e, this.consumeUntilSemicolonIncluded, !0);
}
function Fc() {
    if (this.tokenType === 17) return xa.call(this, this.tokenIndex);
    let e = this.parseWithFallback(this.Declaration, xa);
    return this.tokenType === 17 && this.next(), e;
}
var Bc = 'Block',
    _c = 'block',
    qc = { children: [['Atrule', 'Rule', 'Declaration']] };
function on(e) {
    let t = e ? Fc : ba,
        r = this.tokenStart,
        n = this.createList();
    this.eat(23);
    e: for (; !this.eof; )
        switch (this.tokenType) {
            case 24:
                break e;
            case 13:
            case 25:
                this.next();
                break;
            case 3:
                n.push(this.parseWithFallback(this.Atrule.bind(this, e), ya));
                break;
            default:
                e && this.isDelim(Rc) ? n.push(ba.call(this)) : n.push(t.call(this));
        }
    return (
        this.eof || this.eat(24),
        {
            type: 'Block',
            loc: this.getLocation(r, this.tokenStart),
            children: n,
        }
    );
}
function Uc(e) {
    this.token(23, '{'),
        this.children(e, (t) => {
            t.type === 'Declaration' && this.token(17, ';');
        }),
        this.token(24, '}');
}
var ln = {};
b(ln, {
    generate: () => Hc,
    name: () => jc,
    parse: () => sn,
    structure: () => Wc,
});
var jc = 'Brackets',
    Wc = { children: [[]] };
function sn(e, t) {
    let r = this.tokenStart,
        n = null;
    return (
        this.eat(19),
        (n = e.call(this, t)),
        this.eof || this.eat(20),
        {
            type: 'Brackets',
            loc: this.getLocation(r, this.tokenStart),
            children: n,
        }
    );
}
function Hc(e) {
    this.token(9, '['), this.children(e), this.token(9, ']');
}
var un = {};
b(un, {
    generate: () => Vc,
    name: () => Yc,
    parse: () => cn,
    structure: () => Gc,
});
var Yc = 'CDC',
    Gc = [];
function cn() {
    let e = this.tokenStart;
    return this.eat(15), { type: 'CDC', loc: this.getLocation(e, this.tokenStart) };
}
function Vc() {
    this.token(15, '-->');
}
var hn = {};
b(hn, {
    generate: () => Xc,
    name: () => Kc,
    parse: () => pn,
    structure: () => Qc,
});
var Kc = 'CDO',
    Qc = [];
function pn() {
    let e = this.tokenStart;
    return this.eat(14), { type: 'CDO', loc: this.getLocation(e, this.tokenStart) };
}
function Xc() {
    this.token(14, '<!--');
}
var fn = {};
b(fn, {
    generate: () => eu,
    name: () => Zc,
    parse: () => mn,
    structure: () => Jc,
});
var $c = 46,
    Zc = 'ClassSelector',
    Jc = { name: String };
function mn() {
    return (
        this.eatDelim($c),
        {
            type: 'ClassSelector',
            loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
            name: this.consume(1),
        }
    );
}
function eu(e) {
    this.token(9, '.'), this.token(1, e.name);
}
var gn = {};
b(gn, {
    generate: () => au,
    name: () => ou,
    parse: () => dn,
    structure: () => iu,
});
var tu = 43,
    ka = 47,
    ru = 62,
    nu = 126,
    ou = 'Combinator',
    iu = { name: String };
function dn() {
    let e = this.tokenStart,
        t;
    switch (this.tokenType) {
        case 13:
            t = ' ';
            break;
        case 9:
            switch (this.charCodeAt(this.tokenStart)) {
                case ru:
                case tu:
                case nu:
                    this.next();
                    break;
                case ka:
                    this.next(), this.eatIdent('deep'), this.eatDelim(ka);
                    break;
                default:
                    this.error('Combinator is expected');
            }
            t = this.substrToCursor(e);
            break;
    }
    return {
        type: 'Combinator',
        loc: this.getLocation(e, this.tokenStart),
        name: t,
    };
}
function au(e) {
    this.tokenize(e.name);
}
var xn = {};
b(xn, {
    generate: () => pu,
    name: () => cu,
    parse: () => bn,
    structure: () => uu,
});
var su = 42,
    lu = 47,
    cu = 'Comment',
    uu = { value: String };
function bn() {
    let e = this.tokenStart,
        t = this.tokenEnd;
    return (
        this.eat(25),
        t - e + 2 >= 2 &&
            this.charCodeAt(t - 2) === su &&
            this.charCodeAt(t - 1) === lu &&
            (t -= 2),
        {
            type: 'Comment',
            loc: this.getLocation(e, this.tokenStart),
            value: this.substring(e + 2, t),
        }
    );
}
function pu(e) {
    this.token(25, '/*' + e.value + '*/');
}
var kn = {};
b(kn, {
    generate: () => Su,
    name: () => ku,
    parse: () => yn,
    structure: () => vu,
    walkContext: () => wu,
});
var va = 33,
    hu = 35,
    mu = 36,
    fu = 38,
    du = 42,
    gu = 43,
    wa = 47;
function bu(e) {
    return this.Raw(e, this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function xu(e) {
    return this.Raw(e, this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function yu() {
    let e = this.tokenIndex,
        t = this.Value();
    return (
        t.type !== 'Raw' &&
            this.eof === !1 &&
            this.tokenType !== 17 &&
            this.isDelim(va) === !1 &&
            this.isBalanceEdge(e) === !1 &&
            this.error(),
        t
    );
}
var ku = 'Declaration',
    wu = 'declaration',
    vu = {
        important: [Boolean, String],
        property: String,
        value: ['Value', 'Raw'],
    };
function yn() {
    let e = this.tokenStart,
        t = this.tokenIndex,
        r = Cu.call(this),
        n = Mt(r),
        o = n ? this.parseCustomProperty : this.parseValue,
        i = n ? xu : bu,
        s = !1,
        u;
    this.skipSC(), this.eat(16);
    let c = this.tokenIndex;
    if (
        (n || this.skipSC(),
        o ? (u = this.parseWithFallback(yu, i)) : (u = i.call(this, this.tokenIndex)),
        n && u.type === 'Value' && u.children.isEmpty)
    ) {
        for (let a = c - this.tokenIndex; a <= 0; a++)
            if (this.lookupType(a) === 13) {
                u.children.appendData({
                    type: 'WhiteSpace',
                    loc: null,
                    value: ' ',
                });
                break;
            }
    }
    return (
        this.isDelim(va) && ((s = Au.call(this)), this.skipSC()),
        this.eof === !1 && this.tokenType !== 17 && this.isBalanceEdge(t) === !1 && this.error(),
        {
            type: 'Declaration',
            loc: this.getLocation(e, this.tokenStart),
            important: s,
            property: r,
            value: u,
        }
    );
}
function Su(e) {
    this.token(1, e.property),
        this.token(16, ':'),
        this.node(e.value),
        e.important &&
            (this.token(9, '!'), this.token(1, e.important === !0 ? 'important' : e.important));
}
function Cu() {
    let e = this.tokenStart;
    if (this.tokenType === 9)
        switch (this.charCodeAt(this.tokenStart)) {
            case du:
            case mu:
            case gu:
            case hu:
            case fu:
                this.next();
                break;
            case wa:
                this.next(), this.isDelim(wa) && this.next();
                break;
        }
    return this.tokenType === 4 ? this.eat(4) : this.eat(1), this.substrToCursor(e);
}
function Au() {
    this.eat(9), this.skipSC();
    let e = this.consume(1);
    return e === 'important' ? !0 : e;
}
var Sn = {};
b(Sn, {
    generate: () => Pu,
    name: () => Eu,
    parse: () => vn,
    structure: () => Lu,
});
var Tu = 38;
function wn(e) {
    return this.Raw(e, this.consumeUntilSemicolonIncluded, !0);
}
var Eu = 'DeclarationList',
    Lu = { children: [['Declaration', 'Atrule', 'Rule']] };
function vn() {
    let e = this.createList();
    e: for (; !this.eof; )
        switch (this.tokenType) {
            case 13:
            case 25:
            case 17:
                this.next();
                break;
            case 3:
                e.push(this.parseWithFallback(this.Atrule.bind(this, !0), wn));
                break;
            default:
                this.isDelim(Tu)
                    ? e.push(this.parseWithFallback(this.Rule, wn))
                    : e.push(this.parseWithFallback(this.Declaration, wn));
        }
    return {
        type: 'DeclarationList',
        loc: this.getLocationFromList(e),
        children: e,
    };
}
function Pu(e) {
    this.children(e, (t) => {
        t.type === 'Declaration' && this.token(17, ';');
    });
}
var An = {};
b(An, {
    generate: () => Ou,
    name: () => Iu,
    parse: () => Cn,
    structure: () => Du,
});
var Iu = 'Dimension',
    Du = { value: String, unit: String };
function Cn() {
    let e = this.tokenStart,
        t = this.consumeNumber(12);
    return {
        type: 'Dimension',
        loc: this.getLocation(e, this.tokenStart),
        value: t,
        unit: this.substring(e + t.length, this.tokenStart),
    };
}
function Ou(e) {
    this.token(12, e.value + e.unit);
}
var En = {};
b(En, {
    generate: () => Ru,
    name: () => Nu,
    parse: () => Tn,
    structure: () => Mu,
    walkContext: () => zu,
});
var Nu = 'Function',
    zu = 'function',
    Mu = { name: String, children: [[]] };
function Tn(e, t) {
    let r = this.tokenStart,
        n = this.consumeFunctionName(),
        o = n.toLowerCase(),
        i;
    return (
        (i = t.hasOwnProperty(o) ? t[o].call(this, t) : e.call(this, t)),
        this.eof || this.eat(22),
        {
            type: 'Function',
            loc: this.getLocation(r, this.tokenStart),
            name: n,
            children: i,
        }
    );
}
function Ru(e) {
    this.token(2, e.name + '('), this.children(e), this.token(22, ')');
}
var Pn = {};
b(Pn, {
    generate: () => qu,
    name: () => Bu,
    parse: () => Ln,
    structure: () => _u,
    xxx: () => Fu,
});
var Fu = 'XXX',
    Bu = 'Hash',
    _u = { value: String };
function Ln() {
    let e = this.tokenStart;
    return (
        this.eat(4),
        {
            type: 'Hash',
            loc: this.getLocation(e, this.tokenStart),
            value: this.substrToCursor(e + 1),
        }
    );
}
function qu(e) {
    this.token(4, '#' + e.value);
}
var Dn = {};
b(Dn, {
    generate: () => Wu,
    name: () => Uu,
    parse: () => In,
    structure: () => ju,
});
var Uu = 'Identifier',
    ju = { name: String };
function In() {
    return {
        type: 'Identifier',
        loc: this.getLocation(this.tokenStart, this.tokenEnd),
        name: this.consume(1),
    };
}
function Wu(e) {
    this.token(1, e.name);
}
var Nn = {};
b(Nn, {
    generate: () => Gu,
    name: () => Hu,
    parse: () => On,
    structure: () => Yu,
});
var Hu = 'IdSelector',
    Yu = { name: String };
function On() {
    let e = this.tokenStart;
    return (
        this.eat(4),
        {
            type: 'IdSelector',
            loc: this.getLocation(e, this.tokenStart),
            name: this.substrToCursor(e + 1),
        }
    );
}
function Gu(e) {
    this.token(9, '#' + e.name);
}
var Mn = {};
b(Mn, {
    generate: () => Qu,
    name: () => Vu,
    parse: () => zn,
    structure: () => Ku,
});
var Vu = 'MediaFeature',
    Ku = {
        name: String,
        value: ['Identifier', 'Number', 'Dimension', 'Ratio', null],
    };
function zn() {
    let e = this.tokenStart,
        t,
        r = null;
    if (
        (this.eat(21), this.skipSC(), (t = this.consume(1)), this.skipSC(), this.tokenType !== 22)
    ) {
        switch ((this.eat(16), this.skipSC(), this.tokenType)) {
            case 10:
                this.lookupNonWSType(1) === 9 ? (r = this.Ratio()) : (r = this.Number());
                break;
            case 12:
                r = this.Dimension();
                break;
            case 1:
                r = this.Identifier();
                break;
            default:
                this.error('Number, dimension, ratio or identifier is expected');
        }
        this.skipSC();
    }
    return (
        this.eat(22),
        {
            type: 'MediaFeature',
            loc: this.getLocation(e, this.tokenStart),
            name: t,
            value: r,
        }
    );
}
function Qu(e) {
    this.token(21, '('),
        this.token(1, e.name),
        e.value !== null && (this.token(16, ':'), this.node(e.value)),
        this.token(22, ')');
}
var Fn = {};
b(Fn, {
    generate: () => Zu,
    name: () => Xu,
    parse: () => Rn,
    structure: () => $u,
});
var Xu = 'MediaQuery',
    $u = { children: [['Identifier', 'MediaFeature', 'WhiteSpace']] };
function Rn() {
    let e = this.createList(),
        t = null;
    this.skipSC();
    e: for (; !this.eof; ) {
        switch (this.tokenType) {
            case 25:
            case 13:
                this.next();
                continue;
            case 1:
                t = this.Identifier();
                break;
            case 21:
                t = this.MediaFeature();
                break;
            default:
                break e;
        }
        e.push(t);
    }
    return (
        t === null && this.error('Identifier or parenthesis is expected'),
        { type: 'MediaQuery', loc: this.getLocationFromList(e), children: e }
    );
}
function Zu(e) {
    this.children(e);
}
var _n = {};
b(_n, {
    generate: () => tp,
    name: () => Ju,
    parse: () => Bn,
    structure: () => ep,
});
var Ju = 'MediaQueryList',
    ep = { children: [['MediaQuery']] };
function Bn() {
    let e = this.createList();
    for (this.skipSC(); !this.eof && (e.push(this.MediaQuery()), this.tokenType === 18); )
        this.next();
    return {
        type: 'MediaQueryList',
        loc: this.getLocationFromList(e),
        children: e,
    };
}
function tp(e) {
    this.children(e, () => this.token(18, ','));
}
var Un = {};
b(Un, {
    generate: () => ip,
    name: () => np,
    parse: () => qn,
    structure: () => op,
});
var rp = 38,
    np = 'NestingSelector',
    op = {};
function qn() {
    let e = this.tokenStart;
    return (
        this.eatDelim(rp), { type: 'NestingSelector', loc: this.getLocation(e, this.tokenStart) }
    );
}
function ip() {
    this.token(9, '&');
}
var Wn = {};
b(Wn, {
    generate: () => lp,
    name: () => ap,
    parse: () => jn,
    structure: () => sp,
});
var ap = 'Nth',
    sp = { nth: ['AnPlusB', 'Identifier'], selector: ['SelectorList', null] };
function jn() {
    this.skipSC();
    let e = this.tokenStart,
        t = e,
        r = null,
        n;
    return (
        this.lookupValue(0, 'odd') || this.lookupValue(0, 'even')
            ? (n = this.Identifier())
            : (n = this.AnPlusB()),
        (t = this.tokenStart),
        this.skipSC(),
        this.lookupValue(0, 'of') &&
            (this.next(), (r = this.SelectorList()), (t = this.tokenStart)),
        { type: 'Nth', loc: this.getLocation(e, t), nth: n, selector: r }
    );
}
function lp(e) {
    this.node(e.nth), e.selector !== null && (this.token(1, 'of'), this.node(e.selector));
}
var Yn = {};
b(Yn, {
    generate: () => pp,
    name: () => cp,
    parse: () => Hn,
    structure: () => up,
});
var cp = 'Number',
    up = { value: String };
function Hn() {
    return {
        type: 'Number',
        loc: this.getLocation(this.tokenStart, this.tokenEnd),
        value: this.consume(10),
    };
}
function pp(e) {
    this.token(10, e.value);
}
var Vn = {};
b(Vn, {
    generate: () => fp,
    name: () => hp,
    parse: () => Gn,
    structure: () => mp,
});
var hp = 'Operator',
    mp = { value: String };
function Gn() {
    let e = this.tokenStart;
    return (
        this.next(),
        {
            type: 'Operator',
            loc: this.getLocation(e, this.tokenStart),
            value: this.substrToCursor(e),
        }
    );
}
function fp(e) {
    this.tokenize(e.value);
}
var Qn = {};
b(Qn, {
    generate: () => bp,
    name: () => dp,
    parse: () => Kn,
    structure: () => gp,
});
var dp = 'Parentheses',
    gp = { children: [[]] };
function Kn(e, t) {
    let r = this.tokenStart,
        n = null;
    return (
        this.eat(21),
        (n = e.call(this, t)),
        this.eof || this.eat(22),
        {
            type: 'Parentheses',
            loc: this.getLocation(r, this.tokenStart),
            children: n,
        }
    );
}
function bp(e) {
    this.token(21, '('), this.children(e), this.token(22, ')');
}
var $n = {};
b($n, {
    generate: () => kp,
    name: () => xp,
    parse: () => Xn,
    structure: () => yp,
});
var xp = 'Percentage',
    yp = { value: String };
function Xn() {
    return {
        type: 'Percentage',
        loc: this.getLocation(this.tokenStart, this.tokenEnd),
        value: this.consumeNumber(11),
    };
}
function kp(e) {
    this.token(11, e.value + '%');
}
var Jn = {};
b(Jn, {
    generate: () => Cp,
    name: () => wp,
    parse: () => Zn,
    structure: () => Sp,
    walkContext: () => vp,
});
var wp = 'PseudoClassSelector',
    vp = 'function',
    Sp = { name: String, children: [['Raw'], null] };
function Zn() {
    let e = this.tokenStart,
        t = null,
        r,
        n;
    return (
        this.eat(16),
        this.tokenType === 2
            ? ((r = this.consumeFunctionName()),
              (n = r.toLowerCase()),
              hasOwnProperty.call(this.pseudo, n)
                  ? (this.skipSC(), (t = this.pseudo[n].call(this)), this.skipSC())
                  : ((t = this.createList()), t.push(this.Raw(this.tokenIndex, null, !1))),
              this.eat(22))
            : (r = this.consume(1)),
        {
            type: 'PseudoClassSelector',
            loc: this.getLocation(e, this.tokenStart),
            name: r,
            children: t,
        }
    );
}
function Cp(e) {
    this.token(16, ':'),
        e.children === null
            ? this.token(1, e.name)
            : (this.token(2, e.name + '('), this.children(e), this.token(22, ')'));
}
var to = {};
b(to, {
    generate: () => Lp,
    name: () => Ap,
    parse: () => eo,
    structure: () => Ep,
    walkContext: () => Tp,
});
var Ap = 'PseudoElementSelector',
    Tp = 'function',
    Ep = { name: String, children: [['Raw'], null] };
function eo() {
    let e = this.tokenStart,
        t = null,
        r,
        n;
    return (
        this.eat(16),
        this.eat(16),
        this.tokenType === 2
            ? ((r = this.consumeFunctionName()),
              (n = r.toLowerCase()),
              hasOwnProperty.call(this.pseudo, n)
                  ? (this.skipSC(), (t = this.pseudo[n].call(this)), this.skipSC())
                  : ((t = this.createList()), t.push(this.Raw(this.tokenIndex, null, !1))),
              this.eat(22))
            : (r = this.consume(1)),
        {
            type: 'PseudoElementSelector',
            loc: this.getLocation(e, this.tokenStart),
            name: r,
            children: t,
        }
    );
}
function Lp(e) {
    this.token(16, ':'),
        this.token(16, ':'),
        e.children === null
            ? this.token(1, e.name)
            : (this.token(2, e.name + '('), this.children(e), this.token(22, ')'));
}
var no = {};
b(no, {
    generate: () => Np,
    name: () => Dp,
    parse: () => ro,
    structure: () => Op,
});
var Pp = 47,
    Ip = 46;
function Sa() {
    this.skipSC();
    let e = this.consume(10);
    for (let t = 0; t < e.length; t++) {
        let r = e.charCodeAt(t);
        !B(r) &&
            r !== Ip &&
            this.error('Unsigned number is expected', this.tokenStart - e.length + t);
    }
    return (
        Number(e) === 0 && this.error('Zero number is not allowed', this.tokenStart - e.length), e
    );
}
var Dp = 'Ratio',
    Op = { left: String, right: String };
function ro() {
    let e = this.tokenStart,
        t = Sa.call(this),
        r;
    return (
        this.skipSC(),
        this.eatDelim(Pp),
        (r = Sa.call(this)),
        {
            type: 'Ratio',
            loc: this.getLocation(e, this.tokenStart),
            left: t,
            right: r,
        }
    );
}
function Np(e) {
    this.token(10, e.left), this.token(9, '/'), this.token(10, e.right);
}
var io = {};
b(io, {
    generate: () => Fp,
    name: () => Mp,
    parse: () => oo,
    structure: () => Rp,
});
function zp() {
    return this.tokenIndex > 0 && this.lookupType(-1) === 13
        ? this.tokenIndex > 1
            ? this.getTokenStart(this.tokenIndex - 1)
            : this.firstCharOffset
        : this.tokenStart;
}
var Mp = 'Raw',
    Rp = { value: String };
function oo(e, t, r) {
    let n = this.getTokenStart(e),
        o;
    return (
        this.skipUntilBalanced(e, t || this.consumeUntilBalanceEnd),
        r && this.tokenStart > n ? (o = zp.call(this)) : (o = this.tokenStart),
        {
            type: 'Raw',
            loc: this.getLocation(n, o),
            value: this.substring(n, o),
        }
    );
}
function Fp(e) {
    this.tokenize(e.value);
}
var so = {};
b(so, {
    generate: () => jp,
    name: () => _p,
    parse: () => ao,
    structure: () => Up,
    walkContext: () => qp,
});
function Ca(e) {
    return this.Raw(e, this.consumeUntilLeftCurlyBracket, !0);
}
function Bp() {
    let e = this.SelectorList();
    return e.type !== 'Raw' && this.eof === !1 && this.tokenType !== 23 && this.error(), e;
}
var _p = 'Rule',
    qp = 'rule',
    Up = { prelude: ['SelectorList', 'Raw'], block: ['Block'] };
function ao() {
    let e = this.tokenIndex,
        t = this.tokenStart,
        r,
        n;
    return (
        this.parseRulePrelude ? (r = this.parseWithFallback(Bp, Ca)) : (r = Ca.call(this, e)),
        (n = this.Block(!0)),
        {
            type: 'Rule',
            loc: this.getLocation(t, this.tokenStart),
            prelude: r,
            block: n,
        }
    );
}
function jp(e) {
    this.node(e.prelude), this.node(e.block);
}
var co = {};
b(co, {
    generate: () => Yp,
    name: () => Wp,
    parse: () => lo,
    structure: () => Hp,
});
var Wp = 'Selector',
    Hp = {
        children: [
            [
                'TypeSelector',
                'IdSelector',
                'ClassSelector',
                'AttributeSelector',
                'PseudoClassSelector',
                'PseudoElementSelector',
                'Combinator',
                'WhiteSpace',
            ],
        ],
    };
function lo() {
    let e = this.readSequence(this.scope.Selector);
    return (
        this.getFirstListNode(e) === null && this.error('Selector is expected'),
        { type: 'Selector', loc: this.getLocationFromList(e), children: e }
    );
}
function Yp(e) {
    this.children(e);
}
var po = {};
b(po, {
    generate: () => Qp,
    name: () => Gp,
    parse: () => uo,
    structure: () => Kp,
    walkContext: () => Vp,
});
var Gp = 'SelectorList',
    Vp = 'selector',
    Kp = { children: [['Selector', 'Raw']] };
function uo() {
    let e = this.createList();
    for (; !this.eof; ) {
        if ((e.push(this.Selector()), this.tokenType === 18)) {
            this.next();
            continue;
        }
        break;
    }
    return {
        type: 'SelectorList',
        loc: this.getLocationFromList(e),
        children: e,
    };
}
function Qp(e) {
    this.children(e, () => this.token(18, ','));
}
var bo = {};
b(bo, {
    generate: () => Zp,
    name: () => Xp,
    parse: () => go,
    structure: () => $p,
});
var fo = {};
b(fo, { decode: () => ft, encode: () => mo });
var ho = 92,
    Aa = 34,
    Ta = 39;
function ft(e) {
    let t = e.length,
        r = e.charCodeAt(0),
        n = r === Aa || r === Ta ? 1 : 0,
        o = n === 1 && t > 1 && e.charCodeAt(t - 1) === r ? t - 2 : t - 1,
        i = '';
    for (let s = n; s <= o; s++) {
        let u = e.charCodeAt(s);
        if (u === ho) {
            if (s === o) {
                s !== t - 1 && (i = e.substr(s + 1));
                break;
            }
            if (((u = e.charCodeAt(++s)), $(ho, u))) {
                let c = s - 1,
                    a = se(e, c);
                (s = a - 1), (i += Re(e.substring(c + 1, a)));
            } else u === 13 && e.charCodeAt(s + 1) === 10 && s++;
        } else i += e[s];
    }
    return i;
}
function mo(e, t) {
    let r = t ? "'" : '"',
        n = t ? Ta : Aa,
        o = '',
        i = !1;
    for (let s = 0; s < e.length; s++) {
        let u = e.charCodeAt(s);
        if (u === 0) {
            o += '\uFFFD';
            continue;
        }
        if (u <= 31 || u === 127) {
            (o += '\\' + u.toString(16)), (i = !0);
            continue;
        }
        u === n || u === ho
            ? ((o += '\\' + e.charAt(s)), (i = !1))
            : (i && (ee(u) || pe(u)) && (o += ' '), (o += e.charAt(s)), (i = !1));
    }
    return r + o + r;
}
var Xp = 'String',
    $p = { value: String };
function go() {
    return {
        type: 'String',
        loc: this.getLocation(this.tokenStart, this.tokenEnd),
        value: ft(this.consume(5)),
    };
}
function Zp(e) {
    this.token(5, mo(e.value));
}
var yo = {};
b(yo, {
    generate: () => nh,
    name: () => eh,
    parse: () => xo,
    structure: () => rh,
    walkContext: () => th,
});
var Jp = 33;
function Ea(e) {
    return this.Raw(e, null, !1);
}
var eh = 'StyleSheet',
    th = 'stylesheet',
    rh = { children: [['Comment', 'CDO', 'CDC', 'Atrule', 'Rule', 'Raw']] };
function xo() {
    let e = this.tokenStart,
        t = this.createList(),
        r;
    e: for (; !this.eof; ) {
        switch (this.tokenType) {
            case 13:
                this.next();
                continue;
            case 25:
                if (this.charCodeAt(this.tokenStart + 2) !== Jp) {
                    this.next();
                    continue;
                }
                r = this.Comment();
                break;
            case 14:
                r = this.CDO();
                break;
            case 15:
                r = this.CDC();
                break;
            case 3:
                r = this.parseWithFallback(this.Atrule, Ea);
                break;
            default:
                r = this.parseWithFallback(this.Rule, Ea);
        }
        t.push(r);
    }
    return {
        type: 'StyleSheet',
        loc: this.getLocation(e, this.tokenStart),
        children: t,
    };
}
function nh(e) {
    this.children(e);
}
var vo = {};
b(vo, {
    generate: () => sh,
    name: () => ih,
    parse: () => wo,
    structure: () => ah,
});
var oh = 42,
    La = 124;
function ko() {
    this.tokenType !== 1 &&
        this.isDelim(oh) === !1 &&
        this.error('Identifier or asterisk is expected'),
        this.next();
}
var ih = 'TypeSelector',
    ah = { name: String };
function wo() {
    let e = this.tokenStart;
    return (
        this.isDelim(La)
            ? (this.next(), ko.call(this))
            : (ko.call(this), this.isDelim(La) && (this.next(), ko.call(this))),
        {
            type: 'TypeSelector',
            loc: this.getLocation(e, this.tokenStart),
            name: this.substrToCursor(e),
        }
    );
}
function sh(e) {
    this.tokenize(e.name);
}
var Ao = {};
b(Ao, {
    generate: () => hh,
    name: () => uh,
    parse: () => Co,
    structure: () => ph,
});
var Pa = 43,
    Ia = 45,
    So = 63;
function dt(e, t) {
    let r = 0;
    for (let n = this.tokenStart + e; n < this.tokenEnd; n++) {
        let o = this.charCodeAt(n);
        if (o === Ia && t && r !== 0) return dt.call(this, e + r + 1, !1), -1;
        ee(o) ||
            this.error(
                t && r !== 0
                    ? 'Hyphen minus' + (r < 6 ? ' or hex digit' : '') + ' is expected'
                    : r < 6
                      ? 'Hex digit is expected'
                      : 'Unexpected input',
                n,
            ),
            ++r > 6 && this.error('Too many hex digits', n);
    }
    return this.next(), r;
}
function Jt(e) {
    let t = 0;
    for (; this.isDelim(So); ) ++t > e && this.error('Too many question marks'), this.next();
}
function lh(e) {
    this.charCodeAt(this.tokenStart) !== e &&
        this.error((e === Pa ? 'Plus sign' : 'Hyphen minus') + ' is expected');
}
function ch() {
    let e = 0;
    switch (this.tokenType) {
        case 10:
            if (((e = dt.call(this, 1, !0)), this.isDelim(So))) {
                Jt.call(this, 6 - e);
                break;
            }
            if (this.tokenType === 12 || this.tokenType === 10) {
                lh.call(this, Ia), dt.call(this, 1, !1);
                break;
            }
            break;
        case 12:
            (e = dt.call(this, 1, !0)), e > 0 && Jt.call(this, 6 - e);
            break;
        default:
            if ((this.eatDelim(Pa), this.tokenType === 1)) {
                (e = dt.call(this, 0, !0)), e > 0 && Jt.call(this, 6 - e);
                break;
            }
            if (this.isDelim(So)) {
                this.next(), Jt.call(this, 5);
                break;
            }
            this.error('Hex digit or question mark is expected');
    }
}
var uh = 'UnicodeRange',
    ph = { value: String };
function Co() {
    let e = this.tokenStart;
    return (
        this.eatIdent('u'),
        ch.call(this),
        {
            type: 'UnicodeRange',
            loc: this.getLocation(e, this.tokenStart),
            value: this.substrToCursor(e),
        }
    );
}
function hh(e) {
    this.tokenize(e.value);
}
var Do = {};
b(Do, {
    generate: () => yh,
    name: () => bh,
    parse: () => Io,
    structure: () => xh,
});
var Po = {};
b(Po, { decode: () => Eo, encode: () => Lo });
var mh = 32,
    To = 92,
    fh = 34,
    dh = 39,
    gh = 40,
    Da = 41;
function Eo(e) {
    let t = e.length,
        r = 4,
        n = e.charCodeAt(t - 1) === Da ? t - 2 : t - 1,
        o = '';
    for (; r < n && pe(e.charCodeAt(r)); ) r++;
    for (; r < n && pe(e.charCodeAt(n)); ) n--;
    for (let i = r; i <= n; i++) {
        let s = e.charCodeAt(i);
        if (s === To) {
            if (i === n) {
                i !== t - 1 && (o = e.substr(i + 1));
                break;
            }
            if (((s = e.charCodeAt(++i)), $(To, s))) {
                let u = i - 1,
                    c = se(e, u);
                (i = c - 1), (o += Re(e.substring(u + 1, c)));
            } else s === 13 && e.charCodeAt(i + 1) === 10 && i++;
        } else o += e[i];
    }
    return o;
}
function Lo(e) {
    let t = '',
        r = !1;
    for (let n = 0; n < e.length; n++) {
        let o = e.charCodeAt(n);
        if (o === 0) {
            t += '\uFFFD';
            continue;
        }
        if (o <= 31 || o === 127) {
            (t += '\\' + o.toString(16)), (r = !0);
            continue;
        }
        o === mh || o === To || o === fh || o === dh || o === gh || o === Da
            ? ((t += '\\' + e.charAt(n)), (r = !1))
            : (r && ee(o) && (t += ' '), (t += e.charAt(n)), (r = !1));
    }
    return 'url(' + t + ')';
}
var bh = 'Url',
    xh = { value: String };
function Io() {
    let e = this.tokenStart,
        t;
    switch (this.tokenType) {
        case 7:
            t = Eo(this.consume(7));
            break;
        case 2:
            this.cmpStr(this.tokenStart, this.tokenEnd, 'url(') ||
                this.error('Function name must be `url`'),
                this.eat(2),
                this.skipSC(),
                (t = ft(this.consume(5))),
                this.skipSC(),
                this.eof || this.eat(22);
            break;
        default:
            this.error('Url or Function is expected');
    }
    return { type: 'Url', loc: this.getLocation(e, this.tokenStart), value: t };
}
function yh(e) {
    this.token(7, Lo(e.value));
}
var No = {};
b(No, {
    generate: () => vh,
    name: () => kh,
    parse: () => Oo,
    structure: () => wh,
});
var kh = 'Value',
    wh = { children: [[]] };
function Oo() {
    let e = this.tokenStart,
        t = this.readSequence(this.scope.Value);
    return {
        type: 'Value',
        loc: this.getLocation(e, this.tokenStart),
        children: t,
    };
}
function vh(e) {
    this.children(e);
}
var Mo = {};
b(Mo, {
    generate: () => Th,
    name: () => Ch,
    parse: () => zo,
    structure: () => Ah,
});
var Sh = Object.freeze({ type: 'WhiteSpace', loc: null, value: ' ' }),
    Ch = 'WhiteSpace',
    Ah = { value: String };
function zo() {
    return this.eat(13), Sh;
}
function Th(e) {
    this.token(13, e.value);
}
var Oa = { generic: !0, ...fa, node: gt };
var Ro = {};
b(Ro, { AtrulePrelude: () => za, Selector: () => Ra, Value: () => qa });
var Eh = 35,
    Lh = 42,
    Na = 43,
    Ph = 45,
    Ih = 47,
    Dh = 117;
function bt(e) {
    switch (this.tokenType) {
        case 4:
            return this.Hash();
        case 18:
            return this.Operator();
        case 21:
            return this.Parentheses(this.readSequence, e.recognizer);
        case 19:
            return this.Brackets(this.readSequence, e.recognizer);
        case 5:
            return this.String();
        case 12:
            return this.Dimension();
        case 11:
            return this.Percentage();
        case 10:
            return this.Number();
        case 2:
            return this.cmpStr(this.tokenStart, this.tokenEnd, 'url(')
                ? this.Url()
                : this.Function(this.readSequence, e.recognizer);
        case 7:
            return this.Url();
        case 1:
            return this.cmpChar(this.tokenStart, Dh) && this.cmpChar(this.tokenStart + 1, Na)
                ? this.UnicodeRange()
                : this.Identifier();
        case 9: {
            let t = this.charCodeAt(this.tokenStart);
            if (t === Ih || t === Lh || t === Na || t === Ph) return this.Operator();
            t === Eh && this.error('Hex or identifier is expected', this.tokenStart + 1);
            break;
        }
    }
}
var za = { getNode: bt };
var Oh = 35,
    Nh = 38,
    zh = 42,
    Mh = 43,
    Rh = 47,
    Ma = 46,
    Fh = 62,
    Bh = 124,
    _h = 126;
function qh(e, t) {
    t.last !== null &&
        t.last.type !== 'Combinator' &&
        e !== null &&
        e.type !== 'Combinator' &&
        t.push({ type: 'Combinator', loc: null, name: ' ' });
}
function Uh() {
    switch (this.tokenType) {
        case 19:
            return this.AttributeSelector();
        case 4:
            return this.IdSelector();
        case 16:
            return this.lookupType(1) === 16
                ? this.PseudoElementSelector()
                : this.PseudoClassSelector();
        case 1:
            return this.TypeSelector();
        case 10:
        case 11:
            return this.Percentage();
        case 12:
            this.charCodeAt(this.tokenStart) === Ma &&
                this.error('Identifier is expected', this.tokenStart + 1);
            break;
        case 9: {
            switch (this.charCodeAt(this.tokenStart)) {
                case Mh:
                case Fh:
                case _h:
                case Rh:
                    return this.Combinator();
                case Ma:
                    return this.ClassSelector();
                case zh:
                case Bh:
                    return this.TypeSelector();
                case Oh:
                    return this.IdSelector();
                case Nh:
                    return this.NestingSelector();
            }
            break;
        }
    }
}
var Ra = { onWhiteSpace: qh, getNode: Uh };
function Fa() {
    return this.createSingleNodeList(this.Raw(this.tokenIndex, null, !1));
}
function Ba() {
    let e = this.createList();
    if ((this.skipSC(), e.push(this.Identifier()), this.skipSC(), this.tokenType === 18)) {
        e.push(this.Operator());
        let t = this.tokenIndex,
            r = this.parseCustomProperty
                ? this.Value(null)
                : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, !1);
        if (r.type === 'Value' && r.children.isEmpty) {
            for (let n = t - this.tokenIndex; n <= 0; n++)
                if (this.lookupType(n) === 13) {
                    r.children.appendData({
                        type: 'WhiteSpace',
                        loc: null,
                        value: ' ',
                    });
                    break;
                }
        }
        e.push(r);
    }
    return e;
}
function _a(e) {
    return (
        e !== null &&
        e.type === 'Operator' &&
        (e.value[e.value.length - 1] === '-' || e.value[e.value.length - 1] === '+')
    );
}
var qa = {
    getNode: bt,
    onWhiteSpace(e, t) {
        _a(e) && (e.value = ' ' + e.value), _a(t.last) && (t.last.value += ' ');
    },
    expression: Fa,
    var: Ba,
};
var Ua = {
    parse: {
        prelude: null,
        block() {
            return this.Block(!0);
        },
    },
};
var ja = {
    parse: {
        prelude() {
            let e = this.createList();
            switch ((this.skipSC(), this.tokenType)) {
                case 5:
                    e.push(this.String());
                    break;
                case 7:
                case 2:
                    e.push(this.Url());
                    break;
                default:
                    this.error('String or url() is expected');
            }
            return (
                (this.lookupNonWSType(0) === 1 || this.lookupNonWSType(0) === 21) &&
                    e.push(this.MediaQueryList()),
                e
            );
        },
        block: null,
    },
};
var Wa = {
    parse: {
        prelude() {
            return this.createSingleNodeList(this.MediaQueryList());
        },
        block(e = !1) {
            return this.Block(e);
        },
    },
};
var Ha = {
    parse: {
        prelude() {
            return this.createSingleNodeList(this.SelectorList());
        },
        block() {
            return this.Block(!0);
        },
    },
};
var Ya = {
    parse: {
        prelude() {
            return this.createSingleNodeList(this.SelectorList());
        },
        block() {
            return this.Block(!0);
        },
    },
};
function jh() {
    return this.createSingleNodeList(this.Raw(this.tokenIndex, null, !1));
}
function Wh() {
    return (
        this.skipSC(),
        this.tokenType === 1 && this.lookupNonWSType(1) === 16
            ? this.createSingleNodeList(this.Declaration())
            : Ga.call(this)
    );
}
function Ga() {
    let e = this.createList(),
        t;
    this.skipSC();
    e: for (; !this.eof; ) {
        switch (this.tokenType) {
            case 25:
            case 13:
                this.next();
                continue;
            case 2:
                t = this.Function(jh, this.scope.AtrulePrelude);
                break;
            case 1:
                t = this.Identifier();
                break;
            case 21:
                t = this.Parentheses(Wh, this.scope.AtrulePrelude);
                break;
            default:
                break e;
        }
        e.push(t);
    }
    return e;
}
var Va = {
    parse: {
        prelude() {
            let e = Ga.call(this);
            return this.getFirstListNode(e) === null && this.error('Condition is expected'), e;
        },
        block(e = !1) {
            return this.Block(e);
        },
    },
};
var Ka = {
    'font-face': Ua,
    import: ja,
    media: Wa,
    nest: Ha,
    page: Ya,
    supports: Va,
};
var De = {
        parse() {
            return this.createSingleNodeList(this.SelectorList());
        },
    },
    Fo = {
        parse() {
            return this.createSingleNodeList(this.Selector());
        },
    },
    Qa = {
        parse() {
            return this.createSingleNodeList(this.Identifier());
        },
    },
    er = {
        parse() {
            return this.createSingleNodeList(this.Nth());
        },
    },
    Xa = {
        dir: Qa,
        has: De,
        lang: Qa,
        matches: De,
        is: De,
        '-moz-any': De,
        '-webkit-any': De,
        where: De,
        not: De,
        'nth-child': er,
        'nth-last-child': er,
        'nth-last-of-type': er,
        'nth-of-type': er,
        slotted: Fo,
        host: Fo,
        'host-context': Fo,
    };
var Bo = {};
b(Bo, {
    AnPlusB: () => Qr,
    Atrule: () => $r,
    AtrulePrelude: () => Jr,
    AttributeSelector: () => rn,
    Block: () => on,
    Brackets: () => sn,
    CDC: () => cn,
    CDO: () => pn,
    ClassSelector: () => mn,
    Combinator: () => dn,
    Comment: () => bn,
    Declaration: () => yn,
    DeclarationList: () => vn,
    Dimension: () => Cn,
    Function: () => Tn,
    Hash: () => Ln,
    IdSelector: () => On,
    Identifier: () => In,
    MediaFeature: () => zn,
    MediaQuery: () => Rn,
    MediaQueryList: () => Bn,
    NestingSelector: () => qn,
    Nth: () => jn,
    Number: () => Hn,
    Operator: () => Gn,
    Parentheses: () => Kn,
    Percentage: () => Xn,
    PseudoClassSelector: () => Zn,
    PseudoElementSelector: () => eo,
    Ratio: () => ro,
    Raw: () => oo,
    Rule: () => ao,
    Selector: () => lo,
    SelectorList: () => uo,
    String: () => go,
    StyleSheet: () => xo,
    TypeSelector: () => wo,
    UnicodeRange: () => Co,
    Url: () => Io,
    Value: () => Oo,
    WhiteSpace: () => zo,
});
var $a = {
    parseContext: {
        default: 'StyleSheet',
        stylesheet: 'StyleSheet',
        atrule: 'Atrule',
        atrulePrelude(e) {
            return this.AtrulePrelude(e.atrule ? String(e.atrule) : null);
        },
        mediaQueryList: 'MediaQueryList',
        mediaQuery: 'MediaQuery',
        rule: 'Rule',
        selectorList: 'SelectorList',
        selector: 'Selector',
        block() {
            return this.Block(!0);
        },
        declarationList: 'DeclarationList',
        declaration: 'Declaration',
        value: 'Value',
    },
    scope: Ro,
    atrule: Ka,
    pseudo: Xa,
    node: Bo,
};
var Za = { node: gt };
var Ja = Vr({ ...Oa, ...$a, ...Za });
var lb = '2.3.0';
function _o(e) {
    let t = {};
    for (let r in e) {
        let n = e[r];
        n &&
            (Array.isArray(n) || n instanceof D
                ? (n = n.map(_o))
                : n.constructor === Object && (n = _o(n))),
            (t[r] = n);
    }
    return t;
}
var ts = {};
b(ts, { decode: () => Hh, encode: () => Yh });
var es = 92;
function Hh(e) {
    let t = e.length - 1,
        r = '';
    for (let n = 0; n < e.length; n++) {
        let o = e.charCodeAt(n);
        if (o === es) {
            if (n === t) break;
            if (((o = e.charCodeAt(++n)), $(es, o))) {
                let i = n - 1,
                    s = se(e, i);
                (n = s - 1), (r += Re(e.substring(i + 1, s)));
            } else o === 13 && e.charCodeAt(n + 1) === 10 && n++;
        } else r += e[n];
    }
    return r;
}
function Yh(e) {
    let t = '';
    if (e.length === 1 && e.charCodeAt(0) === 45) return '\\-';
    for (let r = 0; r < e.length; r++) {
        let n = e.charCodeAt(r);
        if (n === 0) {
            t += '\uFFFD';
            continue;
        }
        if (
            n <= 31 ||
            n === 127 ||
            (n >= 48 && n <= 57 && (r === 0 || (r === 1 && e.charCodeAt(0) === 45)))
        ) {
            t += '\\' + n.toString(16) + ' ';
            continue;
        }
        Ne(n) ? (t += e.charAt(r)) : (t += '\\' + e.charAt(r));
    }
    return t;
}
var {
    tokenize: fb,
    parse: db,
    generate: gb,
    lexer: bb,
    createLexer: xb,
    walk: yb,
    find: kb,
    findLast: wb,
    findAll: vb,
    toPlainObject: Sb,
    fromPlainObject: Cb,
    fork: Ab,
} = Ja;
export {
    Ke as Lexer,
    D as List,
    rt as TokenStream,
    _o as clone,
    xb as createLexer,
    Vr as createSyntax,
    $i as definitionSyntax,
    kb as find,
    vb as findAll,
    wb as findLast,
    Ab as fork,
    Cb as fromPlainObject,
    gb as generate,
    ts as ident,
    Mt as isCustomProperty,
    zt as keyword,
    bb as lexer,
    db as parse,
    kr as property,
    fo as string,
    Sb as toPlainObject,
    Fe as tokenNames,
    $e as tokenTypes,
    fb as tokenize,
    Po as url,
    Ym as vendorPrefix,
    lb as version,
    yb as walk,
};
