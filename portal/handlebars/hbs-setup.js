const hbs = require('hbs');


hbs.registerHelper('convertToString', function (data) {
    return JSON.stringify(data)
 });
 
 hbs.registerHelper('addInputField', function (tool, index) {
    let form = createCheckBox(tool.enable, index)
    if (tool.dataSchema.properties) {
       form += createInputFields(tool.dataSchema.properties, tool.dataSchema.required, tool.config[0], index)
    }
    return new hbs.SafeString(form)
 });
 
 function createCheckBox(isChecked, index) {
    let checked = isChecked ? 'checked' : ''
    let id = 'enable-' + index
    return 'Enable: <input id="' + id + '" type="checkbox" ' + checked + '/><br>'
 }
 
 function createInputFields(properties, required, config, index) {
    let inputFields = ''
 
    Object.keys(properties).forEach(function (key) {
       let isRequired = (required.indexOf(key) > -1)
       let prePopulatedValue = getPrePopulatedValue(properties[key], config, key)
       inputFields += createInputFieldForColor(properties[key], key, isRequired, prePopulatedValue, index)
       inputFields += createDropdownList(properties[key], key, isRequired, prePopulatedValue, index)
    });
 
    return inputFields
 }
 
 function createInputFieldForColor(property, key, isRequired, prePopulatedValue, index) {
    let id = key + '-' + index
    let inputField = ''
    let required = isRequired ? 'required' : ''
 
    if (property.format && property.format === 'color') {
       inputField += key + ': <input id="' + id + '" type="color" value="' + prePopulatedValue + '"' + required + '/><br>'
    }
 
    return inputField
 }
 
 function createDropdownList(property, key, isRequired, prePopulatedValue, index) {
    let id = key + '-' + index
    let inputField = ''
    let required = isRequired ? 'required' : ''
 
    if (property.enum) {
       inputField += key + ': <select id="' + id + '" ' + required + '>'
       for (let i = 0; i < property.enum.length; i++) {
          let isSelected = prePopulatedValue === property.enum[i] ? 'selected' : ''
          inputField += '<option value="' + property.enum[i] + '" ' + isSelected + '>' + property.enum[i] + '</option>'
       }
       inputField += '</select><br>'
    }
 
    return inputField
 }
 
 function getPrePopulatedValue(property, config, key) {
    if (config) {
       let value = config[key]
       if (value) {
          return value
       }
    }
    return property.default
 }

module.exports = hbs;