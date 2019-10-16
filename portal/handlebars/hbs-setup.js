const hbs = require('hbs');
hbs.registerHelper("hasRole",function (user,role,options) {
    let userHasRole =false;
    if(user){

        if(user.roles){

            if(Array.isArray(user.roles)){
                if(user.roles.includes(role)){
                    userHasRole =  true;
                }
            }


        }

    }

    return userHasRole ? options.fn(this) : options.inverse(this)
});

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('convertToString', function (data) {
    return JSON.stringify(data)
 });

hbs.registerHelper('capitalizeFirst', function(text) {
    return new hbs.SafeString(
        text.charAt(0).toUpperCase() + text.slice(1)
    );
});

hbs.registerHelper('capitalizeWords', function(text) {
    return new hbs.SafeString(
        text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })
    );
});
 
hbs.registerHelper('addEnableCheckBox', function (tool, index) {
   let form = createCheckBox(tool.enable, index)   
   return new hbs.SafeString(form)
});

hbs.registerHelper('addEnableCheckBoxLabel', function (title, icon, index) {
   let form = createCheckBoxLabel(title, icon, index)   
   return new hbs.SafeString(form)
});

 hbs.registerHelper('addInputField', function (tool, index) {
   let form = "";
    if (tool.dataSchema.properties) {
       form += createInputFields(tool, index)
    }
    return new hbs.SafeString(form)
 });

 hbs.registerHelper('createConfigFormForComponent',function(component){

     let componentID = component.componentID+"_"+component.id;

     let html = "";

     if(component.dataSchema){

         Object.keys(component.dataSchema.properties).forEach(function(key,index) {

             let schema= component.dataSchema.properties[key];
             let currentValue = null;
             if(component.configuration.hasOwnProperty(key)){
                 currentValue = component.configuration[key];
             }

             let propertyInfo = {
                 propertyName: key,
                 schema : schema,
                 componentID: componentID,
                 currentValue : currentValue,

             };

             html = html + createInputFieldForSchemaProperty(propertyInfo);

         });

     }


     return new hbs.SafeString(html);
});

 function createInputFieldForSchemaProperty(propertyInfo){

     switch (propertyInfo.schema.type){

         case "integer": {
             return createInputFieldForIntegerSchema(propertyInfo);
         }
         case "string" : {
             return createInputFieldForStringProperty(propertyInfo);
         }
     }
 }

 function createInputFieldForIntegerSchema(propertyInfo){

     let inputID = createInputID(propertyInfo.componentID,propertyInfo.propertyName);
     let currentValue = "";
     if(propertyInfo.currentValue){

         currentValue = 'value:"'+currentValue+'"';

     }

     let describedByAttribute = "";
     let describedByAttributeSpan = "";
     if(propertyInfo.schema.description){

         let describedBySpanID = inputID+"_description";
         describedByAttribute = ' aria-describedby="'+describedBySpanID+'"';
         describedByAttributeSpan = '<br><span id="'+describedBySpanID+'">'+propertyInfo.schema.description+'</span>';
     }
     if(typeof propertyInfo.schema.maximum !== "undefined" && typeof propertyInfo.schema.minimum !== "undefined"){

         return '<label for="'+inputID+'">'+propertyInfo.schema.title+'</label><input type="range" name="'+inputID+'" id="'+inputID+'" '+currentValue+' min="'+propertyInfo.schema.minimum+'" max="100"'+describedByAttribute+'>'+describedByAttributeSpan;

     }else{
         return '<label for="'+inputID+'">'+propertyInfo.schema.title+'</label><input type="number" name="'+inputID+'" id="'+inputID+'" '+currentValue+describedByAttribute+'>'+describedByAttributeSpan;
     }
}
function createInputFieldForStringProperty(propertyInfo) {
    let inputID = createInputID(propertyInfo.componentID,propertyInfo.propertyName);

    let describedByAttribute = "";
    let describedByAttributeSpan = "";
    if(propertyInfo.schema.description){

        let describedBySpanID = inputID+"_description";
        describedByAttribute = ' aria-describedby="'+describedBySpanID+'"';
        describedByAttributeSpan = '<br><span id="'+describedBySpanID+'">'+propertyInfo.schema.description+'</span>';
    }


    if(typeof propertyInfo.schema.enum !== "undefined"){

        //Return combo if more then 4 options
        if(propertyInfo.schema.enum.length > 4){

            let html = '<label>'+propertyInfo.schema.title+'<select name="'+inputID+'" id="'+inputID+'"'+describedByAttribute+'>';
            for(let i=0; i < propertyInfo.schema.enum.length; i++){

                if(propertyInfo.currentValue === propertyInfo.schema.enum[i]){
                    html+= "<option selected value='"+propertyInfo.schema.enum[i]+"'>"+propertyInfo.schema.translatedEnum[i]+"</option>";
                }else{
                    html+= "<option value='"+propertyInfo.schema.enum[i]+"'>"+propertyInfo.schema.translatedEnum[i]+"</option>";
                }

            }

            return  html+"</select></label>"+describedByAttributeSpan;
            //Return radio if less then 4 options
        }else{
            let html = '<fieldset><legend '+describedByAttributeSpan+'>'+propertyInfo.schema.title+'</legend>';

            for(let i=0; i < propertyInfo.schema.enum.length; i++){
                let inputIDRadio = inputID+'-'+i;
                if(propertyInfo.currentValue === propertyInfo.schema.enum[i]) {
                    html += '<input type="radio" name="' + inputID + '" id="' + inputIDRadio + '" value="' + propertyInfo.schema.enum[i] + '" checked><label for="' + inputIDRadio + '">' + propertyInfo.schema.translatedEnum[i] + '</label> ';

                }else{
                    html += '<input type="radio" name="' + inputID + '" id="' + inputIDRadio + '" value="' + propertyInfo.schema.enum[i] + '"><label for="' + inputIDRadio + '">' + propertyInfo.schema.translatedEnum[i] + '</label> ';

                }
                if(i < propertyInfo.schema.enum.length-1){
                    html+="<br>";
                }
            }

            return html+"</fieldset>"+describedByAttributeSpan;
        }
    }else{

        if(propertyInfo.currentValue){

            return '<label for="'+inputID+'">'+propertyInfo.schema.title+'</label><input type="text" name="'+inputID+'" id="'+inputID+'" value="'+propertyInfo.currentValue+'" required>'+describedByAttributeSpan;

        }else{

            return '<label for="'+inputID+'">'+propertyInfo.schema.title+'</label><input type="text" name="'+inputID+'" id="'+inputID+'" required>'+describedByAttributeSpan;
        }
    }
}
function createInputID(component,propertyName) {
     return component+"_"+propertyName;

}
 function createCheckBox(isChecked, index) {
    let checked = isChecked ? 'checked' : '';
    let id = 'enable-' + index;
    return `<input data-control-type="enable" id="${id}" type="checkbox" onclick="prepareUpdate('${index}', false)" ${checked}/>`;    
 }

 function createCheckBoxLabel(text, icon, index) {
   let checkboxId = 'enable-' + index;
   let id = checkboxId+'-label';
   return `<label class="tool-card-title-select-name" id="${id}" for="${checkboxId}"><span class="bg-image" style="background-image: url('${icon}')"></span>${text}</label>`;    
}

 function createInputFields(tool, index) {
   let inputFields = ''
   const configurationDataOptions = tool.configurationDataOptions;

   if (configurationDataOptions && configurationDataOptions.length > 0) {
      configurationDataOptions.forEach(configurationDataOption => {
         switch(configurationDataOption.type.toLowerCase()) {
            case 'colorcombination':         
               inputFields += createInputOptionsForColorCombination(configurationDataOption, tool, index);
               break;
            case 'colorpicker':         
               inputFields += createInputFieldForProperty(configurationDataOption.dataSchemaProerty, tool, index, "color");
               break;
            case 'singleselectlist':         
               inputFields += createInputFieldForSingleSelectList(configurationDataOption, tool, index);
               break;
            case 'text':         
               inputFields += createInputFieldForProperty(configurationDataOption.dataSchemaProerty, tool, index, "text");
               break;
         }
      });
   } else {
      inputFields += createInputFieldForProperty(Object.keys(tool.dataSchema.properties), tool, index, "text");
   }
 
   return inputFields
 }
 
function getDataSchemaProertyByConfigurableDataOptionProerty (propertyMapping, configurableDataOptionProerty)  {
   const mapping = propertyMapping.filter(map => map.configurableDataOptionProerty === configurableDataOptionProerty);
   return mapping[0].dataSchemaProerty;   
}

function isRequired(tool, configProperties) {

   let isRequired = false;
   if (tool.dataSchema.required && tool.dataSchema.required.length > 0) {      
      tool.dataSchema.required.forEach(requiredProperty => {
         const matchedProperty = configProperties.filter(property => {
            return (property.toLowerCase() === requiredProperty.toLowerCase());
         });
         if (matchedProperty.length > 0)
            isRequired = true;
      });
   }
   return isRequired;
}

 function createInputOptionsForColorCombination(configurationDataOption, tool, index) { 

   let config = tool.config[0];
   const translation = tool.configurationDataOptionTranslations;
   const labelTranslaoin = translation[configurationDataOption.type];
   const id = tool.id + '-' + index
   let inputField = ''
   const configProperties = configurationDataOption.propertyMapping.map( property => property.dataSchemaProerty);
   const required = (isRequired(tool, configProperties)) ? 'required' : ''
   const configurableDataOption = configurationDataOption.configurableDataOption;
   const propertyMapping = configurationDataOption.propertyMapping;
   const dataSchemaPFontColorroerty = getDataSchemaProertyByConfigurableDataOptionProerty(propertyMapping, 'text-color');
   const dataSchemaPbackgroundColorroerty = getDataSchemaProertyByConfigurableDataOptionProerty(propertyMapping, 'background-color');   
   if (!config) {
      config = {};
      config[dataSchemaPFontColorroerty] = tool.dataSchema.properties[dataSchemaPFontColorroerty].default;
      config[dataSchemaPbackgroundColorroerty] = tool.dataSchema.properties[dataSchemaPbackgroundColorroerty].default;
   }

   inputField += `<div data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'><p>${labelTranslaoin}</p><ul>`;
   configurableDataOption.forEach(dataOption => {
      const fontColor = dataOption['text-color'];
      const backgroundColor = dataOption['background-color'];
      const label = dataOption.label;
      const configData = {};
      configData[dataSchemaPFontColorroerty] = fontColor;
      configData[dataSchemaPbackgroundColorroerty] = backgroundColor;

      let checked = "";
      if ((fontColor.localeCompare(config[dataSchemaPFontColorroerty], undefined, { sensitivity: 'base' }) === 0)
         && (backgroundColor.localeCompare(config[dataSchemaPbackgroundColorroerty], undefined, { sensitivity: 'base' }) === 0)) {
            checked = "checked";
         }      

      inputField += `<li class="${configurationDataOption.type}-option-container"><div>
                        <label style="color: ${fontColor}; background-color: ${backgroundColor}">
                           <input type="radio" name="${id}" value='${JSON.stringify(configData)}' ${checked} ${required}>
                           ${label}                           
                        </label>
                     </div></li>`;
   });
   inputField += "</ul></div>";

   return inputField
 }

 function createInputFieldForProperty(dataSchemaProerty, tool, index, type) {

   let inputField = '';      
   const config = tool.config[0];
   const translation = tool.configurationDataOptionTranslations;   

   if (dataSchemaProerty && dataSchemaProerty.length > 0) {
      dataSchemaProerty.forEach(property => {

         const required = (isRequired(tool, [property])) ? 'required' : '';
         const prePopulatedValue = getPrePopulatedValue(tool.dataSchema.properties[property], config, property);
         const labelTranslaoin = translation[property];

         const id = property + '-' + index;
         inputField += `<div data-option-type='property' class='config-data-option-property'><label for='${id}'>${labelTranslaoin}</label><input id='${id}' type='${type}' value='${prePopulatedValue}' ${required}/></div>`;
      });
   }

   return inputField;
 }
 
function createInputFieldForSingleSelectList(configurationDataOption, tool, index) {

   let inputField = '';
   const config = tool.config[0];   
   const translation = tool.configurationDataOptionTranslations;
   const configurableDataOption = configurationDataOption.configurableDataOption;

   if (configurationDataOption.dataSchemaProerty && configurationDataOption.dataSchemaProerty.length > 0) {
      configurationDataOption.dataSchemaProerty.forEach(dataSchemaProerty => {

         const required = (isRequired(tool, [dataSchemaProerty])) ? 'required' : '';
         const prePopulatedValue = getPrePopulatedValue(tool.dataSchema.properties[dataSchemaProerty], config, dataSchemaProerty);
         const id = dataSchemaProerty + '-' + index;
         const labelTranslaoin = translation[dataSchemaProerty];

         //inputField += `<div data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'><label for='${id}'>${labelTranslaoin}</label><select id='${id}' ${required} class="${configurationDataOption.type}-option-container">`;
         inputField += `<div data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'><label for='${id}'>${labelTranslaoin}</label><select id='${id}' class="${configurationDataOption.type}-option-container">`;
         configurableDataOption.forEach(dataOption => {

             if ( typeof prePopulatedValue === "boolean"){

                 const isSelected = (prePopulatedValue === dataOption.value) ? 'selected' : '';
                 inputField += '<option value="' + dataOption.value + '" ' + isSelected + '>' + dataOption.label + '</option>';


             }else{
                 const isSelected = (prePopulatedValue.toLowerCase() === dataOption.value.toLowerCase()) ? 'selected' : '';
                 inputField += '<option value="' + dataOption.value + '" ' + isSelected + '>' + dataOption.label + '</option>';
             }


         });
         inputField += '</select></div>';
      });
   }

   return inputField;
}

function getPrePopulatedValue(property, config, key) {
    if (config) {
       let value = config[key]
       if (value) {

           //Stored as tiny int in database...
           if(property.type === "boolean"){
               if(value === 1){
                   return true;
               }else{
                   return false;
               }
           }
          return value
       }
    }
    return property.default
 }

module.exports = hbs;