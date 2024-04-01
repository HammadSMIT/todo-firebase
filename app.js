// We have to add data of todo in firebase and edit it and have to delete

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, onSnapshot, deleteDoc, updateDoc  } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUO53OS85nm2ZUFGG9_xf4JMAuaCYcqyY",
    authDomain: "authentication-project-9b821.firebaseapp.com",
    projectId: "authentication-project-9b821",
    storageBucket: "authentication-project-9b821.appspot.com",
    messagingSenderId: "499555950862",
    appId: "1:499555950862:web:737b93be87be094c11375f",
    measurementId: "G-F30QNPT41J"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ids = [];

const getTodos = () => {
    onSnapshot(collection(db, "todos"), (data) => {
        data.docChanges().forEach((todo) => {
            console.log("change", todo.doc.data())
            console.log(todo)
            ids.push(todo.doc.id)
            if(todo.type === 'removed'){
                let dtodo = document.getElementById(todo.doc.id)
                if(dtodo){
                    dtodo.remove()
                }

               
            }else if(todo.type === 'added') {
            var list = document.getElementById("list");
            list.innerHTML += `
<li id="${todo.doc.id}"> <input class = 'todo-inp' type = 'text' value = '${todo.doc.data().value}' disabled />
${todo.doc.data().time} <br>
<button  onclick = "delThis('${todo.doc.id}')"> Delete </button>
<button  onclick = "editThis( this, '${todo.doc.id}')"> Edit </button>
</li>
`
}
})
});
}
getTodos()


var todo = document.getElementById("todo");
var list = document.getElementById("list");
async function addTodo() {

    try {
        var date = new Date();
        const docRef = await addDoc(collection(db, "todos"), {
            value: todo.value,
            time: date.toLocaleString()
        });
        todo.value = ""
        console.log("Document written with ID: ", docRef.id);
    } catch (err) {
        console.log(err)
    }

}

async function delTodo() {
    let arr = []
    // console.log(ids)
    for(var i = 0 ; i < ids.length ; i++){
        
        arr.push(await deleteDoc(doc(db, "todos", ids[i] )));
    }
    Promise.all(arr)
    .then((res)=>{
        console.log("all data has been deleted")
    })
    .catch((err)=>{
        console.log(err)
    })

}

async function delThis(id) {
    await deleteDoc(doc(db, "todos", id ));
    console.log("this field is deleted")
}

var edit = false;
async function editThis(e , id) {

    // console.log(e.parentNode.childNodes)
    if (edit) {
        await updateDoc(doc(db,"todos" , id ), {
            value: e.parentNode.childNodes[1].value,
           
          });
        e.parentNode.childNodes[1].disabled = true
        e.parentNode.childNodes[1].blur()
        e.parentNode.childNodes[7].innerHTML = 'Edit'
        edit = false

    }
    else {
        e.parentNode.childNodes[1].disabled = false
        e.parentNode.childNodes[1].focus()
        e.parentNode.childNodes[7].innerHTML = 'Update'
        edit = true
    }


}

window.addTodo = addTodo;
window.delTodo = delTodo;
window.delThis = delThis;
window.editThis = editThis;


        
              
         



