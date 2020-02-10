export function makeUser(formData){
    //get form data, create user array
    const user = {
        name: formData.get('name'),
        meep: formData.get('meep'), 
        cityConnections: 0,
        roadConnections: 0, 
        monasteries: 0,
    };
    return user;
}
//add user to local storage
export function saveUser(user) {
    const json = JSON.stringify(user);
    //turn user info into string and set in LS
    localStorage.setItem('user', json);
}
//get user from local storage
export function getUser() {
    const json = localStorage.getItem('user');
    //get user data from LS
    if (!json) return null;
    //if none return null
    const user = JSON.parse(json);
    //parse user info
    return user;
}