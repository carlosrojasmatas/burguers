export const updateObject =(oldObj, updatedProperteis) => {
    return {
        ...oldObj,
        ...updatedProperteis
    }
}