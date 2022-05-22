/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv();

const basePath = path.join('/Users/pavel/projects/popuga-tracker/src/schema-registry/schemas/event');

const schemaMap = {};
const validateMap = {};

for (const scope of fs.readdirSync(basePath)) {
  schemaMap[scope] = {};
  validateMap[scope] = {};

  for (const event of fs.readdirSync(path.join(basePath, scope))) {
    schemaMap[scope][event] = {};
    validateMap[scope][event] = {};

    for (const versionFile of fs.readdirSync(path.join(basePath, scope, event))) {
      const schema = require(path.join(basePath, scope, event, versionFile));
      const [version] = versionFile.split('.');

      schemaMap[scope][event][version] = schema;
      validateMap[scope][event][version] = ajv.compile(schema);
    }
  }
}

console.log('Loaded schemas', schemaMap);

module.exports = (data, eventName, { version }) => {
  try {
    const [scope, event] = eventName.split('.');
    const validate = validateMap[scope][event][version];

    const valid = validate(data);

    return {
      success: Boolean(valid),
      failure: !valid && validate.errors,
    };
  } catch (error) {
    console.log('Unknown event', error);

    // @todo: to support events without schema
    return {
      success: true,
    };
  }
};
