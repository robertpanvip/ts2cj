

open  class Object{
    init(){
    }
    public open func toString(){
       return '[object Object]'
    }
    public open func toLocaleString(){
       return '[object Object]'
    }
    public open func valueOf(){
       return this
    }
}

enum ESType{
    // | JSUndefined
    // | JSNull
    | JSNumber(Int64)
     | JSString(String) 
    // | JSObject(Object)
    // | JSArray
    // | JSSymbol
    operator func +(right: ESType): ESType {
        let total = match (this) { // Error, Not all constructors of RGBColor are covered.
            case ESType.JSString(l) => 
                let val = match (right) { // Error, Not all constructors of RGBColor are covered.
                    case ESType.JSString(r) => ESType.JSString("${l}${r}");
                    case ESType.JSNumber(r) => ESType.JSString("${l}${r}");
                }
                return val;
            case ESType.JSNumber(l) => 
                let val = match (right) { // Error, Not all constructors of RGBColor are covered.
                    case ESType.JSString(r) => ESType.JSString("${l}${r}");
                    case ESType.JSNumber(r) => ESType.JSNumber(l + r);
                }
                return val;
            
        }
        
        return total
    }
}

class Console{
    public func log(val:ESType){
        let r = match (val) { // Error, Not all constructors of RGBColor are covered.
            case ESType.JSString(str) => "${str}";
            case ESType.JSNumber(n) => "${n}";
        }
        println(r);
    }
}

var console = Console();

class Function<:Object{
    var caller:ESType
    let fun:(arr: Array<ESType>,caller:ESType)->Unit
    init(fun:(arr: Array<ESType>,caller:ESType)->Unit,caller:ESType){
        super();
        this.fun=fun;
        this.caller = caller;
    }
    
    public func call(arr: Array<ESType>,caller:ESType){
       this.fun(arr,this.caller) 
    }
    public func apply(arr: Array<ESType>,caller:ESType){
       this.fun(arr,this.caller) 
    }
    public func bind(that:ESType){
       //this.fun() 
       this.caller = that;
    }
    public override  func toString(){
       //this.fun() 
       return ''
    }
}



main() {
    let fun = Function({ arr:Array<ESType>, caller:ESType =>   // Parameterless lambda expression.
    let a = arr[0];
    let b = arr[1];
    console.log(a+b)
    console.log(caller)
},ESType.JSNumber(1))
    fun.call([ESType.JSNumber(1),ESType.JSString('2')],ESType.JSNumber(1))
}
