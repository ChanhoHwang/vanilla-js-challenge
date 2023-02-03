const images = [
  "https://wallpapers.com/images/file/animal-fur-of-white-siberian-tiger-l0qtiy8fax4r0lz0.jpg",
  "https://wallpapers.com/images/file/racoon-animal-fur-dg28btdcyoycuqyg.jpg",
  "https://wallpapers.com/images/file/sleeping-white-arctic-fox-y6gwjzy3pd07pvhd.jpg",
  "https://wallpapers.com/images/file/chimpanzees-at-leafy-tree-8fmnuq7z0su0brpd.jpg",
  "https://wallpapers.com/images/file/hippopotamus-intimidating-mouth-9cpy92qmnmpe336p.jpg",
];

const chosenImage = images[Math.floor(Math.random() * images.length)];
const clock = document.querySelector("h1#clock");
const nameForm = document.querySelector("#name-form");
const nameText = document.querySelector("#name-form h2");
const nameInput = document.querySelector("#name-form h2 input:first-child");
const weather = document.querySelector("#weather span:first-child");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-form input:first-child");
const todoList = document.querySelector("#todo-list");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";
const API_KEY = "00f28f6ec9ebdc76553f3baa332d566f";

document.body.style.backgroundImage = `url(${chosenImage})`;

function getClock() {
  const date = new Date();
  const hours = String(date.getHours());
  const minutes = String(date.getMinutes()).padStart(2, "0");
  clock.innerText = `${hours}:${minutes}`;
}

function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      weather.innerText = `${data.weather[0].main} / ${data.main.temp}  ${data.name}`;
    });
}
function onGeoError() {
  //weather.innerText = "I can't find your geo...";
  const lat = "37.532600";
  const lon = "127.024612";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      weather.innerText = `${data.weather[0].main} / ${data.main.temp}  ${data.name}`;
    });
}

function onLoginSubmit(event) {
  event.preventDefault();
  const username = nameInput.value;
  localStorage.setItem(USERNAME_KEY, username);
  greetingUser(username);
}

function greetingUser(username) {
  nameText.innerText = `Hello, ${username}!`;
  nameInput.classList.add(HIDDEN_CLASSNAME);
}

let toDos = [];

function saveToDos() {
  localStorage.setItem("todos", JSON.stringify(toDos));
}

function deleteToDo(event) {
  const li = event.target.parentElement;
  li.remove();
  //li.filter((toDo) => console.log(li.id));
  //toDos.filter((toDo) => console.log(li.id));
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
  //toDos.filter((toDo) => console.log(li.id));
  saveToDos();
}

function handleToDoSubmit(event) {
  event.preventDefault();
  const newTodo = todoInput.value;
  todoInput.value = "";
  const newTodoObj = {
    text: newTodo,
    id: Date.now(),
  };
  toDos.push(newTodoObj);
  paintToDo(newTodoObj);
  saveToDos();
}

function paintToDo(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  const span = document.createElement("span");
  span.innerText = newTodo.text;
  const button = document.createElement("button");
  button.innerText = "X";
  button.addEventListener("click", deleteToDo);
  li.appendChild(span);
  li.appendChild(button);
  todoList.appendChild(li);
}

const savedUsername = localStorage.getItem(USERNAME_KEY);

getClock();
setInterval(getClock, 1000);
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);

if (savedUsername === null) {
  nameForm.addEventListener("submit", onLoginSubmit);
} else {
  greetingUser(savedUsername);
}

todoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem("todos");

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}
