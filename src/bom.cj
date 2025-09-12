package ts2cj
import std.core

public class Console {
    public func log<T>(val: T): Unit where T <: ToString {
        println("${val}")
    }
}

public let console = Console()
