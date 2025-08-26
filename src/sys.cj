package ts2cj
import std.unicode.UnicodeStringExtension
import std.unicode
import std.core

public class Console {
    public func log<T>(val: T): Unit where T <: ToString {
        println("${val}")
    }
}
extend String {
    public func toUpperCase(){
        return this.toUpper()
    }
    // 小写
    public func toLowerCase(): String {
        return this.toLower()
    }

    // 是否包含子串
    public func includes(sub: String): Bool {
        return this.indexOf(sub) != -1
    }
}

// ------------------ Number 扩展 ------------------
extend Float64 {

    // 固定小数位
    public func toFixed(digits: Int): String {
        return '';
    }
}
public let console = Console()
