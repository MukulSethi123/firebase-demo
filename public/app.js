const auth = firebase.auth();
const db = firebase.firestore();
const $ = document;

const whenSignedIn = $.getElementById("whenSignedIn");
const whenSignedOut = $.getElementById("whenSignedOut");
const createThing = $.getElementById("createThing");
const thingsList = $.getElementById("thingsList");
const signInBtn = $.getElementById("signInBtn");
const signOutBtn = $.getElementById("signOutBtn");
const userDetails = $.getElementById("userDetails");

let thingsRef; //refrence to the collection on firestore
let unsubscribe;//we are subscribed to a stream of changes that happening to the database 
                // hence we have to unsubscribe form that stream and stop listing to that
const provider = new firebase.auth.GoogleAuthProvider();
signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
    if (user){
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = '<h3>Hello '+ user.displayName + '!'+ '</h3> <p>user id:' + user.uid + '</p>';
        thingsRef = db.collection('things');
        
        createThing.onclick = () => {
            console.log("clicked");
            

            thingsRef.add({
                uid:user.uid,
                name:faker.commerce.productName(),                
            });            
        }

        unsubscribe = thingsRef.where('uid','==',user.uid)
        .onSnapshot( querySnapshot => {
            const items = querySnapshot.docs.map(doc => {
                const data = doc.data().name;
                return '<li>' +data+'</li>'
            });
            thingsList.innerHTML = items.join("");
        })

        

    }
    else{
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;        
        userDetails.innerHTML='';
        unsubscribe && unsubscribe();
    }
})
