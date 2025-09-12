package  ts2cj

import std.unicode.UnicodeStringExtension
import std.unicode

type Number = Float64
// ------------------ Number 扩展 ------------------
extend Number {
    // 重载构造：Int 也能变成 Number
    public static func from(n: Int64): Float64 {
        Float64(n);
    }
    // 重载构造：Int 也能变成 Number
    public static func from(n: Float64): Float64 {
        Float64(n);
    }
    // 固定小数位
    public func toFixed(digits: Int): String {
        return '';
    }
}

extend String {
    // 重载构造：Int 也能变成 Number
    public static func from(n: Int64): String {
        "${n}"
    }
    // 重载构造：Int 也能变成 Number
    public static func from(n: String): String {
        n
    }
    public func toUpperCase(){
        return this.toUpper()
    }
    // 小写
    public func toLowerCase(): String {
        return this.toLower()
    }

    // 是否包含子串
    public func includes(sub: String): Bool {
        return this.indexOf(sub) != - 1
    }
}

type Boolean = Bool

// ------------------ Number 扩展 ------------------
extend Boolean {
    // 重载构造：Int 也能变成 Number
    public static func from(n: Float64): Bool {
        if (n == 0.00) {
            false
        } else {
            true
        }
    }
    // 重载构造：Int 也能变成 Number
    public static func from(n: Bool): Bool {
        if (n) {
            true
        } else {
            false
        }
    }

    // 重载构造：Int 也能变成 Number
    public static func from(n: String): Bool {
        if (n == "") {
            false
        } else {
            true
        }
    }
}

struct Undefined <: ToString {
    public func toString():String {
        "undefined"
    }
    operator func +(right: Int64): Float64 {
        Float64.NaN
    }
    operator func +(right: Float64): Float64 {
        Float64.NaN
    }
    operator func +(right: String): Float64 {
        Float64.NaN
    }
    operator func -(right: Int64): Float64 {
        Float64.NaN
    }
    operator func -(right: Float64): Float64 {
        Float64.NaN
    }
    operator func -(right: String): Float64 {
        Float64.NaN
    }
}

struct Null <: ToString {
    public func toString() {
        "null"
    }
}
type Void = Undefined
type Bigint = Int64;
