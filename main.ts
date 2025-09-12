import {
    Project,
    Node,
    ts,
    FunctionDeclaration,
    ReturnTypedNode,
    ReturnStatement,
    IfStatement,
    TypeOfExpression, VariableStatement, VariableDeclarationKind
} from 'ts-morph'
import * as fs from "node:fs";
import * as path from "node:path";

function tsTypeToCj(type: string) {
    type = type.replaceAll('\'', '').replaceAll('\"', '')
    switch (type) {
        case "string":
            return "String"
        case "number":
            return "Number"
        case "bigint":
            return "Bigint"
        case "boolean":
            return "Boolean"
        case "void":
            return "Void"
    }
}

function mapTsTypeToCj(node?: Node) {
    if (!node) {
        return 'Undefined';
    }
    const type = node.getType()
    const typeText = type.getText();
    if (type.isUnion()) {
        return "Any"
    }
    return tsTypeToCj(typeText)
}

function transformBlock(node: Node, indent = "", returnType = "") {
    let cj = ''
    cj += " {\n";
    const _indent = `${indent}  `
    node.forEachChild(n => {
        cj += `${_indent}${transformNode(n, `${_indent}`)}`;
    })
    if (["Undefined", "Void"].includes(returnType) && !cj.includes(' return ')) {
        cj += `\n${_indent}return Undefined();`
    }
    cj += `\n${indent}}`;
    return cj
}

function transformNode(node: Node, indent = "") {
    let cj = ''
    const kind = node.getKind();

    switch (kind) {
        case ts.SyntaxKind.VariableDeclaration:
            break;
        case ts.SyntaxKind.FunctionDeclaration:
            const funNode = node as FunctionDeclaration;
            const funName = funNode.getName();
            const params = funNode.getParameters().map(p => `${p.getName()}:${mapTsTypeToCj(p)}`)
            const returnType = mapTsTypeToCj(funNode.getReturnTypeNode());
            const body = funNode.getBody() ? transformBlock(funNode.getBody()!, "", returnType) : ""
            cj += `func ${funName}(${params}):${returnType}${body}\n\n`
            break;
        case ts.SyntaxKind.Block: {
            cj += transformBlock(node, indent)
            // console.log('Block',node.getText(),node.getChildAtIndex(2).getKindName(),node.getChildCount()) //console.log("cj",cj)
        }
            break;
        case ts.SyntaxKind.ReturnStatement:
            const returnNode = node as ReturnStatement;
            let res = `return `
            returnNode.forEachChild(c => {
                res += transformNode(c)
            })
            cj += res
            break;
        case ts.SyntaxKind.BinaryExpression: {
            let haveTypeof = false;
            const children: Node[] = []
            node.forEachChild(c => {
                if (c.getKind() === ts.SyntaxKind.TypeOfExpression) {
                    haveTypeof = true;
                }
                children.push(c);
            })
            if (haveTypeof) {
                const typeOfNode = children.find(child => child.getKind() === ts.SyntaxKind.TypeOfExpression)! as TypeOfExpression
                //const equalNode = children.find(child => [ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.EqualsEqualsEqualsToken].includes(child.getKind()))!
                const right = children.find(child => ![ts.SyntaxKind.TypeOfExpression, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.EqualsEqualsEqualsToken].includes(child.getKind()))!
                const v = typeOfNode.getChildren()[1]
                cj += `${v.getText()} is ${tsTypeToCj(right.getText())}`
            } else {
                node.forEachChild(c => {
                    cj += `${transformNode(c)}`
                })
                cj += ';'
            }

        }
            break;
        case ts.SyntaxKind.VariableStatement:
            const vsNode = node as VariableStatement;
            const list = vsNode.getDeclarationList();
            const kind = list.getDeclarationKind(); // const / let / var
            const vl = list.getDeclarations();

            vl.forEach(v => {
                const initializer = v.getInitializer();
                cj += `${kind === "const" ? "let" : kind} ${v.getName()} = ${initializer ? transformNode(initializer) : "Undefined();"}\n`
            })
            break;
        case ts.SyntaxKind.ExpressionStatement:
            cj += `${node.getText()}`;
            break;
        case ts.SyntaxKind.TypeOfExpression:
            cj += `${node.getText()}`;
            break;
        case ts.SyntaxKind.Identifier:
            cj += `${node.getText()}`;
            break;
        case ts.SyntaxKind.NumericLiteral:
            cj += `${node.getText()}`;
            break;
        case ts.SyntaxKind.PlusToken:
            cj += ` ${node.getText()} `;
            break;
        case ts.SyntaxKind.IfStatement:
            const ifNode = node as IfStatement;
            const children: Node[] = [];
            ifNode.forEachChild(child => {
                children.push(child);
            })
            cj += `if(${transformNode(children[0])})${transformNode(children[1], indent)}`;
            break;
        case ts.SyntaxKind.CallExpression:
            break;
        case ts.SyntaxKind.EnumDeclaration:
            break;
        case ts.SyntaxKind.ClassDeclaration:
            break;
        case ts.SyntaxKind.TypeParameter:
            break;
    }
    return cj;
}

function convert(input: string, output: string) {
    const project = new Project({})
    const sourceFile = project.addSourceFileAtPath(input);
    let outputCode = "package ts2cj\n";
    sourceFile.forEachChild(node => {
        outputCode += transformNode(node)
    })
    fs.writeFileSync(output, outputCode)
}

convert(path.resolve(__dirname, './test.ts'), "./src/main.cj");