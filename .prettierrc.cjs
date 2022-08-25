const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  semi: false, // 是否使用分号
  singleQuote: true, // 使用单引号代替双引号
  trailingComma: 'none' // 多行时去掉逗号结尾
}
