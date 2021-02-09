export const updateObject =(oldObj, updatedProperteis) => {
    return {
        ...oldObj,
        ...updatedProperteis
    }
}

export const validateFields = (value,rules) => {
    let isValid = true;
    
    if(rules.required){
        isValid = value.trim() !==  '' && isValid;
    }

    if(rules.minLenght){
        isValid = value.length >= rules.minLenght && isValid;
    }

    if(rules.maxLength){
        isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}
