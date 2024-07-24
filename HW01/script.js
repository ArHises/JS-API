const initialData = `[
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]`;

const key = "classSchedule";
const scheduleTableBody = document.getElementById("scheduleTableBody");

if (!localStorage.getItem(key)) {
  localStorage.setItem(key, initialData);
}
const classes = JSON.parse(localStorage.getItem(key));

function updateTable() {
  scheduleTableBody.innerHTML = classes
    .map((classItem) => createClassRow(classItem))
    .join("");
}

function createClassRow(classItem) {
  const isFull = classItem.currentParticipants >= classItem.maxParticipants;
  const isUserRegistered = localStorage.getItem(`registered_${classItem.id}`);
  return `
                <tr data-id="${classItem.id}">
                    <td>${classItem.name}</td>
                    <td>${classItem.time}</td>
                    <td>${classItem.maxParticipants}</td>
                    <td>${classItem.currentParticipants}</td>
                    <td><button class="signUpButton ${
                      isFull || isUserRegistered ? "disabled" : ""
                    }" ${
    isFull || isUserRegistered ? "disabled" : ""
  }>Записаться</button></td>
                    <td><button class="cancelButton ${
                      isUserRegistered ? "" : "disabled"
                    }" ${
    isUserRegistered ? "" : "disabled"
  }>Отменить запись</button></td>
                </tr>
            `;
}

function signUp(classId) {
  const classItem = classes.find((c) => c.id === classId);
  if (classItem.currentParticipants < classItem.maxParticipants) {
    classItem.currentParticipants += 1;
    localStorage.setItem(key, JSON.stringify(classes));
    localStorage.setItem(`registered_${classId}`, true);
    updateTable();
  }
}

function cancelRegistration(classId) {
  const classItem = classes.find((c) => c.id === classId);
  if (localStorage.getItem(`registered_${classId}`)) {
    classItem.currentParticipants -= 1;
    localStorage.setItem(key, JSON.stringify(classes));
    localStorage.removeItem(`registered_${classId}`);
    updateTable();
  }
}

scheduleTableBody.addEventListener("click", (event) => {
  const classRow = event.target.closest("tr");
  const classId = +classRow.getAttribute("data-id");

  if (event.target.classList.contains("signUpButton")) {
    signUp(classId);
  }

  if (event.target.classList.contains("cancelButton")) {
    cancelRegistration(classId);
  }
});

updateTable();
