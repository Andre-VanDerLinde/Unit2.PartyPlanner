const API = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events"

const state = {
    events: [],
    event: {},
}

const root = document.querySelector(".root");

// renders content on page for API PULL and after PUSH
const render = (content) => {
    if(Array.isArray(content)){ 
        root.querySelectorAll(".eventValues").forEach(event => event.remove());
        content.forEach(generateContent);
    }else{
        generateContent(content);
    }
}

// generating content used by Render function
function generateContent(data){
    const event = document.createElement('div');
    event.classList.add('eventValues');
    const {date, time} = deconstructISOString(data.date);
    event.innerHTML = `
        <p class="val">${data.name}</p>
        <p class="val">${date}</p>
        <p class="val">${time}</p>
        <p class="val">${data.location}</p>
        <p class="val">${data.description}</p>
        <button class="deleteButt" id=${data.id}>DELETE</button>
    `  
    root.appendChild(event);     
}

// Retrieving data from API
const getEvents = async () =>{
    try{
        const res = await fetch(API);
        const data = await res.json();

        state.events = data.data;

        render(state.events);
        

    }catch(e){
        console.error("Failed to fetch data:", e);
    }
}

getEvents();

// if user submits form pull data and POST to API
const submit = document.querySelector("#submit");
submit.addEventListener('click', (e)=>{
    e.preventDefault();

    // grabbing info for event
    state.event.name = document.querySelector("#name").value;
    const date = document.querySelector("#date").value;
    const time = document.querySelector("#time").value;
    state.event.date = convertToISOString(date, time);
    state.event.location = document.querySelector('#location').value;
    state.event.description = document.querySelector('#description').value;

    // POST event to API
    createEvent(state.event);

    // resetting form
    document.querySelector('form').reset();
})

const createEvent = async(event) => {
    try{
        const res = await fetch(API,{
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({name: event.name, description: event.description, date: event.date, location: event.location})
        })

        const data = await res.json();
        state.events = data.data;

        render(state.events);
        
    }catch(e){
        console.error(e);
    }
}

const convertToISOString = (dateInput, timeInput) => {
    // Combine date and time inputs into a single Date object
    const dateTimeString = `${dateInput}T${timeInput}:00Z`; // Adding seconds + UTC timezone
    const isoString = new Date(dateTimeString).toISOString();
    return isoString;
};

const deconstructISOString = (ISO) => {

    const dateObj = new Date(ISO);
    const date = dateObj.toDateString();
    const time = dateObj.toTimeString();
    return { date, time };
};

document.addEventListener('click', (e)=>{
    if(e.target.classList.contains("deleteButt")){
        console.log(e.target.id);
        deleteEvent(e.target.id);
    }
})

const deleteEvent = async (id) =>{
    try {
        await fetch(`${API}/${parseInt(id)}`,{
            method: 'DELETE'
        })

        getEvents();

    } catch (e) {
        console.error(e)    
    }
}