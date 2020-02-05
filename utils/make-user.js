function makeUser(formData){
    //get form data, create user array
    const user = {
        name: formData.get('name'),
        meep: formData.get('meep'), 
    };
    return user;
}
export const makeNewUser = (formData) => ({
    //get form data, create new user from data
    name: formData.get('name'),
    meep: formData.get('meep'),

});

export default makeUser;