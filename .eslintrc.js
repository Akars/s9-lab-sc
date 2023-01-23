module.exports = {
  "root": true,
  "rules": {
    "semi": ["error", "always"],
    "class-methods-use-this": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "func-names": "off",
    "import/prefer-default-export": "off",
    "max-classes-per-file": "off",
    "import/no-cycle": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "airbnb-typescript/base"
  ],
};

