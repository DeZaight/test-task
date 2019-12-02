// Tabs switcher start
const tabs = document.querySelectorAll(".tab");
const tabContent = document.querySelectorAll(".tabs-content");

for (let tab of tabs) {
    tab.addEventListener("click", () => {
        document.querySelector(".tabs-content.active").classList.remove("active");

        tab.checked = true;
        const parentListItem = tab.parentElement;
        const index = [...parentListItem.parentElement.children].indexOf(parentListItem);

        const content = [...tabContent].filter(tab => tab.getAttribute("data-index") == index);
        content[0].classList.add("active");
    });
}
// Tabs switcher end

// Focus on input after switching to tab start
const tab3 = document.getElementById("tab3");
const name = document.getElementById("name");

tab3.addEventListener("click", () => {
    name.focus();
});
// Focus on input after switching to tab end

// Image uploader start
const filesView = document.getElementById("filesView");
const addFile = document.getElementById("addFile");
let filesList = [];

addFile.addEventListener("change", function () {
    if (this.files[0]) {
        let fr = new FileReader();

        fr.addEventListener("load", () => {
            let div = document.createElement('div');
            div.className = "col-md-4";
            div.innerHTML = `<div class="added-file" style="background: url('${fr.result}') center no-repeat; background-size: cover;"></div>`;
            filesView.append(div);
            filesList.push(fr.result);
        }, false);

        fr.readAsDataURL(this.files[0]);
    }

    filesView.children[0].style = "order: " + filesView.children.length;
});
// Image uploader end

// Create new tarif start
const newTarifs = document.getElementById("newTarifs");
const addNewTarif = document.getElementById("addNewTarif");

document.getElementById("addNewTarifBtn").addEventListener("click", () => {
    if (addNewTarif.value !== undefined && addNewTarif.value !== "") {
        let option = newTarifs.options;

        addNewTarifValue(JSON.stringify(addNewTarif.value));
        // Тут надо проверить ответ от бэкенда и только после этого добавлять новый option, 
        // но я не знаю что должен отвечать бэкенд, по этому просто добавлю option и очищу input
        option[option.length] = new Option(addNewTarif.value, addNewTarif.value, true);
        addNewTarif.value = "";
    }
});

async function addNewTarifValue(r) {
    let url = "";
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: r,
    });
    let result = await response.json();
}
// Create new tarif end

// Create tarifs start
const tarifsContainer = document.getElementById("tarifsContainer");
let tarifs = [];

document.getElementById("append").addEventListener("click", () => {
    let price = document.getElementById("price").value;
    let currency = document.getElementById("currency").value;
    let name = newTarifs.value;

    let itemNum = tarifs.length ? tarifs[tarifs.length - 1] + 1 : 0;

    let tarifLayout = `
        <div class="col-auto d-flex align-items-center">
            <input type="text" class="tarif-name" id="tarifName-${itemNum}" value="${name}" disabled>
        </div>

        <div class="col-auto d-flex align-items-center">
            <input type="number" class="form-control" id="tarifPrice-${itemNum}" style="width: 70px;" value="${price}">
            <input type="text" class="tarif-currency" id="tarifCurrency-${itemNum}" value="${currency}" disabled>
        </div>

        <div class="col-auto d-flex align-items-center">
            <input type="checkbox" class="form-control" style="min-width: 65px" id="tarifTimeValid-${itemNum}" onClick="enabledTimeValid(${itemNum})">
            <label for="tarifTimeValid-${itemNum}" class="tarif-time">Time valid</label>
        </div>

        <div class="col d-flex align-items-center">
            <input type="date" class="form-control" id="tarifDateStart-${itemNum}" disabled>
        </div>

        <div class="col d-flex align-items-center">
            <input type="date" class="form-control" id="tarifDateEnd-${itemNum}" disabled>
        </div>

        <div class="col-auto d-flex align-items-center">
            <input type="checkbox" class="form-control" style="min-width: 65px" id="tarifWeekDay-${itemNum}">
            <label for="tarifWeekDay-${itemNum}" class="tarif-week">Week day</label>
        </div>

        <div class="col-auto d-flex align-items-center">
            <button type="button" class="btn btn-light" data-toggle="modal" data-target="#confirmDeleteModal" onClick="deleteTarif(${itemNum})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        `;

    let div = document.createElement('div');
    div.className = "row tarif";
    div.id = "tarif-" + itemNum;
    div.innerHTML = tarifLayout;
    tarifsContainer.append(div);

    tarifs.push(itemNum);
});
// Create tarifs end

// Delete tarif start
let deletedElement;
function deleteTarif(el) {
    deletedElement = el;
}

function deleteTarifConfirm() {
    let div = document.getElementById("tarif-" + deletedElement);
    tarifsContainer.removeChild(div);
    tarifs = tarifs.filter((el) => el !== deletedElement);
    $('#confirmDeleteModal').modal('hide')
}
// Delete tarif end

// Enabled time valid start
function enabledTimeValid(el) {
    let check = document.getElementById("tarifTimeValid-" + el);
    let dateStart = document.getElementById("tarifDateStart-" + el);
    let dateEnd = document.getElementById("tarifDateEnd-" + el);

    if (check.checked) {
        dateStart.disabled = false;
        dateEnd.disabled = false;
    } else {
        dateStart.disabled = true;
        dateEnd.disabled = true;
    }
}
// Enabled time valid end

// Sending data start
document.getElementById("sendBtn").addEventListener("click", () => {
    let tarifsList = [];

    for (let i in tarifs) {
        let el = {
            tarifName: document.getElementById("tarifName-" + tarifs[i]).value ? document.getElementById("tarifName-" + tarifs[i]).value : null,
            tarifPrice: document.getElementById("tarifPrice-" + tarifs[i]).value ? document.getElementById("tarifPrice-" + tarifs[i]).value : null,
            tarifCurrency: document.getElementById("tarifCurrency-" + tarifs[i]).value ? document.getElementById("tarifCurrency-" + tarifs[i]).value : null,
            tarifDateStart: document.getElementById("tarifDateStart-" + tarifs[i]).value ? document.getElementById("tarifDateStart-" + tarifs[i]).value : null,
            tarifDateEnd: document.getElementById("tarifDateEnd-" + tarifs[i]).value ? document.getElementById("tarifDateEnd-" + tarifs[i]).value : null,
            tarifWeekDay: document.getElementById("tarifWeekDay-" + tarifs[i]).checked ? true : false,
        }
        tarifsList.push(el)
    }

    let req = {
        name: document.getElementById("name").value ? document.getElementById("name").value : null,
        service: document.getElementById("service").value ? document.getElementById("service").value : null,
        category: document.getElementById("category").value ? document.getElementById("category").value : null,
        description: document.getElementById("desc").value ? document.getElementById("desc").value : null,
        files: filesList,
        tarif: tarifsList,
    }

    sendData(JSON.stringify(req));
});

async function sendData(r) {
    let url = "";
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: r,
    });

    let result = await response.json();
}
// Sending data end