export default function makeUser(formData){
    //get form data, create user array
    const user = {
        name: formData.get('name'),
        meep: formData.get('meep'), 
        cities: {},
        cityConnections: 0,
        cityCompleted: 0,
        roadConnections: 0, 
        monasteries: 0,
    };
    return user;
}