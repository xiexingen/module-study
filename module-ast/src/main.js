import { tokenizer, parser, transformer, codeGenerator } from './ast.js';

/**
 * LISP 代码： (add 10 (subtract 100 30))
  C    代码  add(10, subtract(100, 30))
  释义： 10 + （ 100 - 30 ）
 */
const input='(add 10 (subtract 100 30))';
/** 生成 tokens
 * 根据输入的 (add 10 (subtract 100 30)) 得到下面的 tokens
 *  [
      { "type": "paren", "value": "(" },
      { "type": "name", "value": "add" },
      { "type": "number", "value": "10" },
      { "type": "paren", "value": "(" },
      { "type": "name", "value": "subtract" },
      { "type": "number", "value": "100" },
      { "type": "number", "value": "30" },
      { "type": "paren", "value": ")" },
      { "type": "paren", "value": ")" }
    ]
 */
const tokens=tokenizer(input);

/** 生成 ast
 * 将上面生成的 tokens 解析生成新的 AST
 * [
      { "type": "paren", "value": "(" },
      { "type": "name", "value": "add" },
      { "type": "number", "value": "10" },
      { "type": "paren", "value": "(" },
      { "type": "name", "value": "subtract" },
      { "type": "number", "value": "100" },
      { "type": "number", "value": "30" },
      { "type": "paren", "value": ")" },
      { "type": "paren", "value": ")" }
    ]
    解析后得到下面的数据
    {
      "type": "Program",
      "body": [
        {
          "type": "CallExpression",
          "value": "add",
          "params": [
            { "type": "NumberLiteral", "value": "10" },
            {
              "type": "CallExpression",
              "value": "subtract",
              "params": [
                { "type": "NumberLiteral", "value": "100" },
                { "type": "NumberLiteral", "value": "30" }
              ]
            }
          ]
        }
      ]
    }
 */
const ast=parser(tokens);

/** 根据 ast 得到转换后的 ast
 * 将上一步得到的 AST、
 * {
      "type": "Program",
      "body": [
        {
          "type": "CallExpression",
          "value": "add",
          "params": [
            { "type": "NumberLiteral", "value": "10" },
            {
              "type": "CallExpression",
              "value": "subtract",
              "params": [
                { "type": "NumberLiteral", "value": "100" },
                { "type": "NumberLiteral", "value": "30" }
              ]
            }
          ]
        }
      ]
    }
  转成新的 AST，转换后端 AST 如下
  {
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": { "type": "Identifier", "name": "add" },
        "arguments": [
          { "type": "NumberLiteral", "value": "10" },
          {
            "type": "CallExpression",
            "callee": { "type": "Identifier", "name": "subtract" },
            "arguments": [
              { "type": "NumberLiteral", "value": "100" },
              { "type": "NumberLiteral", "value": "30" }
            ]
          }
        ]
      }
    }
  ]
}

**/
const transformedAst=transformer(ast)

/**根据新的 ast 生成新的代码
 * 将上面的代码转成 add(10, subtract(100, 30))
 * */
let newCode = codeGenerator(transformedAst);
console.log(newCode)
