const API = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events"

const state = {
    events: [],
    event: {},
}

const root = document.querySelector(".root");

const render = (content) => {
    content.forEach( data => {
        const event = document.createElement('div');
        event.classList.add('eventValues');

        const {date, time} = deconstructISOString(data.date);
        event.innerHTML = `
            <p class="val">${data.name}</p>
            <p class="val">${date}</p>
            <p class="val">${time}</p>
            <p class="val">${data.location}</p>
            <p class="val">${data.description}</p>
            <button class="deleteButt">DELETE</button>
        `  
        root.appendChild(event);     
    });
}

// Retrieving data from API
const getEvents = async () =>{
    try{
        const res = await fetch(API);
        const data = await res.json();

        state.events = data.data;

        console.log(state.events);

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

    // re-Render
    render(state.events);

})

const createEvent = async(event) => {
    try{
        const res = await fetch(API,{
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({name: event.name, description: event.description, date: event.date, location: event.location})
        })

        const data = await res.json();
        
        console.log(data);
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

    console.log(dateObj)
    
    // Extract date in "YYYY-MM-DD" format
    const date = dateObj.toISOString().split("T")[0]; 

    // Extract hours and minutes
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Convert "0" to "12" for 12 AM

    // Format time in "HH:MM AM/PM"
    const time = `${hours}:${minutes} ${ampm}`;

    return { date, time };
};