// Code generated by colf(1); DO NOT EDIT.
// The compiler used schema file test.colf for package gen.

// Package gen tests all field mapping options.
var gen = new function() {
	const EOF = 'colfer: EOF';

	// The upper limit for serial byte sizes.
	var colferSizeMax = 16 * 1024 * 1024;
	// The upper limit for the number of elements in a list.
	var colferListMax = 64 * 1024;

	// Constructor.
	// O contains all supported data types.
	// When init is provided all enumerable properties are merged into the new object a.k.a. shallow cloning.
	this.O = function(init) {
		// B tests booleans.
		this.b = false;
		// U32 tests unsigned 32-bit integers.
		this.u32 = 0;
		// U64 tests unsigned 64-bit integers.
		this.u64 = 0;
		// I32 tests signed 32-bit integers.
		this.i32 = 0;
		// I64 tests signed 64-bit integers.
		this.i64 = 0;
		// F32 tests 32-bit floating points.
		this.f32 = 0;
		// F64 tests 64-bit floating points.
		this.f64 = 0;
		// T tests timestamps.
		this.t = null;
		this.t_ns = 0;
		// S tests text.
		this.s = '';
		// A tests binaries.
		this.a = new Uint8Array(0);
		// O tests nested data structures.
		this.o = null;
		// Os tests data structure lists.
		this.os = [];
		// Ss tests text lists.
		this.ss = [];
		// As tests binary lists.
		this.as = [];
		// U8 tests unsigned 8-bit integers.
		this.u8 = 0;
		// U16 tests unsigned 16-bit integers.
		this.u16 = 0;
		// F32s tests 32-bit floating point lists.
		this.f32s = [];
		// F64s tests 64-bit floating point lists.
		this.f64s = [];

		for (var p in init) this[p] = init[p];
	}

	// Serializes the object into an Uint8Array.
	// All null entries in property os will be replaced with a new gen.O.
	// All null entries in property ss will be replaced with an empty String.
	// All null entries in property as will be replaced with an empty Array.
	this.O.prototype.marshal = function() {
		var segs = [];

		if (this.b)
			segs.push([0]);

		if (this.u32) {
			if (this.u32 > 4294967295 || this.u32 < 0)
				throw 'colfer: gen/O field u32 out of reach: ' + this.u32;
			if (this.u32 < 0x200000) {
				var seg = [1];
				encodeVarint(seg, this.u32);
				segs.push(seg);
			} else {
				var bytes = new Uint8Array(5);
				bytes[0] = 1 | 128;
				var view = new DataView(bytes.buffer);
				view.setUint32(1, this.u32);
				segs.push(bytes)
			}
		}

		if (this.u64) {
			if (this.u64 < 0)
				throw 'colfer: gen/O field u64 out of reach: ' + this.u64;
			if (this.u64 > Number.MAX_SAFE_INTEGER)
				throw 'colfer: gen/O field u64 exceeds Number.MAX_SAFE_INTEGER';
			if (this.u64 < 0x2000000000000) {
				var seg = [2];
				encodeVarint(seg, this.u64);
				segs.push(seg);
			} else {
				var bytes = new Uint8Array(9);
				bytes[0] = 2 | 128;
				var view = new DataView(bytes.buffer);
				view.setUint32(1, this.u64 / 0x100000000);
				view.setUint32(5, this.u64 % 0x100000000);
				segs.push(bytes)
			}
		}

		if (this.i32) {
			var seg = [3];
			if (this.i32 < 0) {
				seg[0] |= 128;
				if (this.i32 < -2147483648)
					throw 'colfer: gen/O field i32 exceeds 32-bit range';
				encodeVarint(seg, -this.i32);
			} else {
				if (this.i32 > 2147483647)
					throw 'colfer: gen/O field i32 exceeds 32-bit range';
				encodeVarint(seg, this.i32);
			}
			segs.push(seg);
		}

		if (this.i64) {
			var seg = [4];
			if (this.i64 < 0) {
				seg[0] |= 128;
				if (this.i64 < -Number.MAX_SAFE_INTEGER)
					throw 'colfer: gen/O field i64 exceeds Number.MAX_SAFE_INTEGER';
				encodeVarint(seg, -this.i64);
			} else {
				if (this.i64 > Number.MAX_SAFE_INTEGER)
					throw 'colfer: gen/O field i64 exceeds Number.MAX_SAFE_INTEGER';
				encodeVarint(seg, this.i64);
			}
			segs.push(seg);
		}

		if (this.f32 || Number.isNaN(this.f32)) {
			if (this.f32 > 3.4028234663852886E38 || this.f32 < -3.4028234663852886E38)
				throw 'colfer: gen/O field f32 exceeds 32-bit range';
			var bytes = new Uint8Array(5);
			bytes[0] = 5;
			new DataView(bytes.buffer).setFloat32(1, this.f32);
			segs.push(bytes);
		}

		if (this.f64 || Number.isNaN(this.f64)) {
			var bytes = new Uint8Array(9);
			bytes[0] = 6;
			new DataView(bytes.buffer).setFloat64(1, this.f64);
			segs.push(bytes);
		}

		if ((this.t && this.t.getTime()) || this.t_ns) {
			var ms = this.t ? this.t.getTime() : 0;
			if (ms < -Number.MAX_SAFE_INTEGER || ms > Number.MAX_SAFE_INTEGER)
				throw 'colfer: gen/O field t millisecond value exceeds Number.MAX_SAFE_INTEGER';
			var s = ms / 1E3;

			var ns = this.t_ns || 0;
			if (ns < 0 || ns >= 1E6)
				throw 'colfer: gen/O field t_ns not in range (0, 1ms>';
			var msf = ms % 1E3;
			if (ms < 0 && msf) {
				s--
				msf = 1E3 + msf;
			}
			ns += msf * 1E6;

			if (s > 0xffffffff || s < 0) {
				var bytes = new Uint8Array(13);
				bytes[0] = 7 | 128;
				var view = new DataView(bytes.buffer);
				view.setUint32(9, ns);
				if (s > 0) {
					view.setUint32(1, s / 0x100000000);
					view.setUint32(5, s);
				} else {
					s = -s;
					view.setUint32(1, s / 0x100000000);
					view.setUint32(5, s);
					var carry = 1;
					for (var j = 8; j > 0; j--) {
						var b = (bytes[j] ^ 255) + carry;
						bytes[j] = b & 255;
						carry = b >> 8;
					}
				}
				segs.push(bytes);
			} else {
				var bytes = new Uint8Array(9);
				bytes[0] = 7;
				var view = new DataView(bytes.buffer);
				view.setUint32(1, s);
				view.setUint32(5, ns);
				segs.push(bytes);
			}
		}

		if (this.s) {
			var utf = encodeUTF8(this.s);
			var seg = [8];
			encodeVarint(seg, utf.length);
			segs.push(seg);
			segs.push(utf)
		}

		if (this.a && this.a.length) {
			var seg = [9];
			encodeVarint(seg, this.a.length);
			segs.push(seg);
			segs.push(this.a);
		}

		if (this.o) {
			segs.push([10]);
			segs.push(this.o.marshal());
		}

		if (this.os && this.os.length) {
			var a = this.os;
			if (a.length > colferListMax)
				throw 'colfer: gen.o.os length exceeds colferListMax';
			var seg = [11];
			encodeVarint(seg, a.length);
			segs.push(seg);
			for (var i = 0; i < a.length; i++) {
				var v = a[i];
				if (v == null) {
					v = new gen.O();
					a[i] = v;
				}
				segs.push(v.marshal());
			};
		}

		if (this.ss && this.ss.length) {
			var a = this.ss;
			if (a.length > colferListMax)
				throw 'colfer: gen.o.ss length exceeds colferListMax';
			var seg = [12];
			encodeVarint(seg, a.length);
			segs.push(seg);
			for (var i = 0; i < a.length; i++) {
				var s = a[i];
				if (s == null) {
					s = "";
					a[i] = s;
				}
				var utf = encodeUTF8(s);
				seg = [];
				encodeVarint(seg, utf.length);
				segs.push(seg);
				segs.push(utf)
			}
		}

		if (this.as && this.as.length) {
			var a = this.as;
			if (a.length > colferListMax)
				throw 'colfer: gen.o.as length exceeds colferListMax';
			var seg = [13];
			encodeVarint(seg, a.length);
			segs.push(seg);
			for (var i = 0; i < a.length; i++) {
				var b = a[i];
				if (b == null) {
					b = new Uint8Array(0);
					a[i] = b;
				}
				seg = [];
				encodeVarint(seg, b.length);
				segs.push(seg);
				segs.push(b)
			}
		}

		if (this.u8) {
			if (this.u8 > 255 || this.u8 < 0)
				throw 'colfer: gen/O field u8 out of reach: ' + this.u8;
			segs.push([14, this.u8]);
		}

		if (this.u16) {
			if (this.u16 > 65535 || this.u16 < 0)
				throw 'colfer: gen/O field u16 out of reach: ' + this.u16;
			if (this.u16 < 256)
				segs.push([15 | 128, this.u16]);
			else
				segs.push([15, this.u16 >>> 8, this.u16 & 255]);
		}

		if (this.f32s && this.f32s.length) {
			if (this.f32s.length > colferListMax)
				throw 'colfer: gen.o.f32s length exceeds colferListMax';
			var seg = [16];
			encodeVarint(seg, this.f32s.length);
			segs.push(seg);

			var bytes = new Uint8Array(this.f32s.length * 4);
			segs.push(bytes);

			var view = new DataView(bytes.buffer);
			this.f32s.forEach(function(f, i) {
				if (f > 3.4028234663852886E38 || f < -3.4028234663852886E38)
					throw 'colfer: gen.o.f32s[' + i + '] exceeds 32-bit range';
				view.setFloat32(i * 4, f);
			});
		}

		if (this.f64s && this.f64s.length) {
			if (this.f64s.length > colferListMax)
				throw 'colfer: gen.o.f64s length exceeds colferListMax';
			var seg = [17];
			encodeVarint(seg, this.f64s.length);
			segs.push(seg);

			var bytes = new Uint8Array(this.f64s.length * 8);
			segs.push(bytes);

			var view = new DataView(bytes.buffer);
			this.f64s.forEach(function(f, i) {
				view.setFloat64(i * 8, f);
			});
		}

		var size = 1;
		segs.forEach(function(seg) {
			size += seg.length;
		});
		if (size > colferSizeMax)
			throw 'colfer: gen.o serial size ' + size + ' exceeds ' + colferListMax + ' bytes';

		var bytes = new Uint8Array(size);
		var i = 0;
		segs.forEach(function(seg) {
			bytes.set(seg, i);
			i += seg.length;
		});
		bytes[i] = 127;
		return bytes;
	}

	// Deserializes the object from an Uint8Array and returns the number of bytes read.
	this.O.prototype.unmarshal = function(data) {
		if (!data || ! data.length) throw EOF;
		var header = data[0];
		var i = 1;
		var readHeader = function() {
			if (i >= data.length) throw EOF;
			header = data[i++];
		}

		var readVarint = function() {
			var pos = 0, result = 0;
			while (pos != 8) {
				var c = data[i+pos];
				result += (c & 127) * Math.pow(128, pos);
				++pos;
				if (c < 128) {
					i += pos;
					if (result > Number.MAX_SAFE_INTEGER) break;
					return result;
				}
				if (pos == data.length) throw EOF;
			}
			return -1;
		}

		if (header == 0) {
			this.b = true;
			readHeader();
		}

		if (header == 1) {
			var x = readVarint();
			if (x < 0) throw 'colfer: gen/O field u32 exceeds Number.MAX_SAFE_INTEGER';
			this.u32 = x;
			readHeader();
		} else if (header == (1 | 128)) {
			if (i + 4 > data.length) throw EOF;
			this.u32 = new DataView(data.buffer).getUint32(i);
			i += 4;
			readHeader();
		}

		if (header == 2) {
			var x = readVarint();
			if (x < 0) throw 'colfer: gen/O field u64 exceeds Number.MAX_SAFE_INTEGER';
			this.u64 = x;
			readHeader();
		} else if (header == (2 | 128)) {
			if (i + 8 > data.length) throw EOF;
			var view = new DataView(data.buffer);
			var x = view.getUint32(i) * 0x100000000;
			x += view.getUint32(i + 4);
			if (x > Number.MAX_SAFE_INTEGER)
				throw 'colfer: gen/O field u64 exceeds Number.MAX_SAFE_INTEGER';
			this.u64 = x;
			i += 8;
			readHeader();
		}

		if (header == 3) {
			var x = readVarint();
			if (x < 0) throw 'colfer: gen/O field i32 exceeds Number.MAX_SAFE_INTEGER';
			this.i32 = x;
			readHeader();
		} else if (header == (3 | 128)) {
			var x = readVarint();
			if (x < 0) throw 'colfer: gen/O field i32 exceeds Number.MAX_SAFE_INTEGER';
			this.i32 = -1 * x;
			readHeader();
		}

		if (header == 4) {
			var x = readVarint();
			if (x < 0) throw 'colfer: gen/O field i64 exceeds Number.MAX_SAFE_INTEGER';
			this.i64 = x;
			readHeader();
		} else if (header == (4 | 128)) {
			var x = readVarint();
			if (x < 0) throw 'colfer: gen/O field i64 exceeds Number.MAX_SAFE_INTEGER';
			this.i64 = -1 * x;
			readHeader();
		}

		if (header == 5) {
			if (i + 4 > data.length) throw EOF;
			this.f32 = new DataView(data.buffer).getFloat32(i);
			i += 4;
			readHeader();
		}

		if (header == 6) {
			if (i + 8 > data.length) throw EOF;
			this.f64 = new DataView(data.buffer).getFloat64(i);
			i += 8;
			readHeader();
		}

		if (header == 7) {
			if (i + 8 > data.length) throw EOF;
			var view = new DataView(data.buffer);
			var ms = view.getUint32(i) * 1000;
			var ns = view.getUint32(i + 4);
			ms += ns / 1E6;
			ns %= 1E6;
			if (ms > Number.MAX_SAFE_INTEGER)
				throw 'colfer: gen/O field t millisecond value exceeds Number.MAX_SAFE_INTEGER';
			i += 8;
			this.t = new Date();
			this.t.setTime(ms);
			this.t_ns = ns;
			readHeader();
		} else if (header == (7 | 128)) {
			if (i + 12 > data.length) throw EOF;

			var int64 = new Uint8Array(data.subarray(i, i + 8));
			if (int64[0] > 127) {	// two's complement
				var carry = 1;
				for (var j = 7; j >= 0; j--) {
					var b = (int64[j] ^ 255) + carry;
					int64[j] = b & 255;
					carry = b >> 8;
				}
			}
			if (int64[0] != 0 || int64[1] > 31)
				throw 'colfer: gen/O field t second value exceeds Number.MAX_SAFE_INTEGER';
			var view = new DataView(int64.buffer);
			var s = (view.getUint32(0) * 0x100000000) + view.getUint32(4);
			if (data[i] > 127) s = -s;

			var ns = new DataView(data.buffer).getUint32(i + 8);
			var ms = (s * 1E3);
			if (Math.abs(ms) > Number.MAX_SAFE_INTEGER)
				throw 'colfer: gen/O field t millisecond value exceeds Number.MAX_SAFE_INTEGER';
			var msa = Math.floor(ns / 1E6);
			if (msa > 0) {
				if (s < 0) ms = (ms + 1000) - (1000 - msa);
				else ms += msa;
			}
			this.t = new Date();
			this.t.setTime(ms);
			this.t_ns = ns % 1E6;

			i += 12;
			readHeader();
		}

		if (header == 8) {
			var size = readVarint();
			if (size < 0)
				throw 'colfer: gen.o.s size exceeds Number.MAX_SAFE_INTEGER';
			else if (size > colferSizeMax)
				throw 'colfer: gen.o.s size ' + size + ' exceeds ' + colferSizeMax + ' UTF-8 bytes';

			var start = i;
			i += size;
			if (i > data.length) throw EOF;
			this.s = decodeUTF8(data.subarray(start, i));
			readHeader();
		}

		if (header == 9) {
			var size = readVarint();
			if (size < 0)
				throw 'colfer: gen.o.a size exceeds Number.MAX_SAFE_INTEGER';
			else if (size > colferSizeMax)
				throw 'colfer: gen.o.a size ' + size + ' exceeds ' + colferSizeMax + ' bytes';

			var start = i;
			i += size;
			if (i > data.length) throw EOF;
			this.a = data.slice(start, i);
			readHeader();
		}

		if (header == 10) {
			var o = new gen.O();
			i += o.unmarshal(data.subarray(i));
			this.o = o;
			readHeader();
		}

		if (header == 11) {
			var l = readVarint();
			if (l < 0) throw 'colfer: gen.o.os length exceeds Number.MAX_SAFE_INTEGER';
			if (l > colferListMax)
				throw 'colfer: gen.o.os length ' + l + ' exceeds ' + colferListMax + ' elements';

			for (var n = 0; n < l; ++n) {
				var o = new gen.O();
				i += o.unmarshal(data.subarray(i));
				this.os[n] = o;
			}
			readHeader();
		}

		if (header == 12) {
			var l = readVarint();
			if (l < 0) throw 'colfer: gen.o.ss length exceeds Number.MAX_SAFE_INTEGER';
			if (l > colferListMax)
				throw 'colfer: gen.o.ss length ' + l + ' exceeds ' + colferListMax + ' elements';

			this.ss = new Array(l);
			for (var n = 0; n < l; ++n) {
				var size = readVarint();
				if (size < 0)
					throw 'colfer: gen.o.ss element ' + this.ss.length + ' size exceeds Number.MAX_SAFE_INTEGER';
				else if (size > colferSizeMax)
					throw 'colfer: gen.o.ss element ' + this.ss.length + ' size ' + size + ' exceeds ' + colferSizeMax + ' UTF-8 bytes';

				var start = i;
				i += size;
				if (i > data.length) throw EOF;
				this.ss[n] = decodeUTF8(data.subarray(start, i));
			}
			readHeader();
		}

		if (header == 13) {
			var l = readVarint();
			if (l < 0) throw 'colfer: gen.o.as length exceeds Number.MAX_SAFE_INTEGER';
			if (l > colferListMax)
				throw 'colfer: gen.o.as length ' + l + ' exceeds ' + colferListMax + ' elements';

			this.as = new Array(l);
			for (var n = 0; n < l; ++n) {
				var size = readVarint();
				if (size < 0)
					throw 'colfer: gen.o.as element ' + this.as.length + ' size exceeds Number.MAX_SAFE_INTEGER';
				else if (size > colferSizeMax)
					throw 'colfer: gen.o.as element ' + this.as.length + ' size ' + size + ' exceeds ' + colferSizeMax + ' UTF-8 bytes';

				var start = i;
				i += size;
				if (i > data.length) throw EOF;
				this.as[n] = data.slice(start, i);
			}
			readHeader();
		}

		if (header == 14) {
			if (i + 1 >= data.length) throw EOF;
			this.u8 = data[i++];
			header = data[i++];
		}

		if (header == 15) {
			if (i + 2 >= data.length) throw EOF;
			this.u16 = (data[i++] << 8) | data[i++];
			header = data[i++];
		} else if (header == (15 | 128)) {
			if (i + 1 >= data.length) throw EOF;
			this.u16 = data[i++];
			header = data[i++];
		}

		if (header == 16) {
			var l = readVarint();
			if (l < 0) throw 'colfer: gen.o.f32s length exceeds Number.MAX_SAFE_INTEGER';
			if (l > colferListMax)
				throw 'colfer: gen.o.f32s length ' + l + ' exceeds ' + colferListMax + ' elements';
			if (i + l * 4 > data.length) throw EOF;

			this.f32s = new Array(l);
			var view = new DataView(data.buffer);
			for (var n = 0; n < l; ++n) {
				this.f32s[n] = view.getFloat32(i);
				i += 4;
			}
			readHeader();
		}

		if (header == 17) {
			var l = readVarint();
			if (l < 0) throw 'colfer: gen.o.f64s length exceeds Number.MAX_SAFE_INTEGER';
			if (l > colferListMax)
				throw 'colfer: gen.o.f64s length ' + l + ' exceeds ' + colferListMax + ' elements';
			if (i + l * 8 > data.length) throw EOF;

			this.f64s = new Array(l);
			var view = new DataView(data.buffer);
			for (var n = 0; n < l; ++n) {
				this.f64s[n] = view.getFloat64(i);
				i += 8;
			}
			readHeader();
		}

		if (header != 127) throw 'colfer: unknown header at byte ' + (i - 1);
		if (i > colferSizeMax)
			throw 'colfer: gen.o serial size ' + size + ' exceeds ' + colferSizeMax + ' bytes';
		return i;
	}

	// private section

	var encodeVarint = function(bytes, x) {
		while (x > 127) {
			bytes.push(x|128);
			x /= 128;
		}
		bytes.push(x&127);
		return bytes;
	}

	var encodeUTF8 = function(s) {
		var i = 0;
		var bytes = new Uint8Array(s.length * 4);
		for (var ci = 0; ci != s.length; ci++) {
			var c = s.charCodeAt(ci);
			if (c < 128) {
				bytes[i++] = c;
				continue;
			}
			if (c < 2048) {
				bytes[i++] = c >> 6 | 192;
			} else {
				if (c > 0xd7ff && c < 0xdc00) {
					if (++ci == s.length) throw 'UTF-8 encode: incomplete surrogate pair';
					var c2 = s.charCodeAt(ci);
					if (c2 < 0xdc00 || c2 > 0xdfff) throw 'UTF-8 encode: second char code 0x' + c2.toString(16) + ' at index ' + ci + ' in surrogate pair out of range';
					c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
					bytes[i++] = c >> 18 | 240;
					bytes[i++] = c>> 12 & 63 | 128;
				} else { // c <= 0xffff
					bytes[i++] = c >> 12 | 224;
				}
				bytes[i++] = c >> 6 & 63 | 128;
			}
			bytes[i++] = c & 63 | 128;
		}
		return bytes.subarray(0, i);
	}

	var decodeUTF8 = function(bytes) {
		var s = '';
		var i = 0;
		while (i < bytes.length) {
			var c = bytes[i++];
			if (c > 127) {
				if (c > 191 && c < 224) {
					if (i >= bytes.length) throw 'UTF-8 decode: incomplete 2-byte sequence';
					c = (c & 31) << 6 | bytes[i] & 63;
				} else if (c > 223 && c < 240) {
					if (i + 1 >= bytes.length) throw 'UTF-8 decode: incomplete 3-byte sequence';
					c = (c & 15) << 12 | (bytes[i] & 63) << 6 | bytes[++i] & 63;
				} else if (c > 239 && c < 248) {
					if (i+2 >= bytes.length) throw 'UTF-8 decode: incomplete 4-byte sequence';
					c = (c & 7) << 18 | (bytes[i] & 63) << 12 | (bytes[++i] & 63) << 6 | bytes[++i] & 63;
				} else throw 'UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1);
				++i;
			}

			if (c <= 0xffff) s += String.fromCharCode(c);
			else if (c <= 0x10ffff) {
				c -= 0x10000;
				s += String.fromCharCode(c >> 10 | 0xd800)
				s += String.fromCharCode(c & 0x3FF | 0xdc00)
			} else throw 'UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach';
		}
		return s;
	}
}

// NodeJS:
if (typeof exports !== 'undefined') exports.gen = gen;
