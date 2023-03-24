let customer = {
  table: "",
  hour: "",
  order: [],
};

const categories = {
  1: "Foods",
  2: "Drinks",
  3: "Desserts"
}

const buttonSaveCustomer = document.querySelector("#guardar-cliente");
buttonSaveCustomer.addEventListener("click", saveCustomer);

function saveCustomer() {
  const table = document.querySelector("#mesa").value;
  const hour = document.querySelector("#hora").value;

  const emptyFields = [table, hour].some((field) => field === "");

  if (emptyFields) {
    const existAlert = document.querySelector('.invalid-feedback');
    if(!existAlert) {

      const alert = document.createElement('DIV');
      alert.classList.add('invalid-feedback', 'd-block', 'text-center');
      alert.textContent = 'All fields are required';
      document.querySelector('.modal-body form').appendChild(alert);
      setTimeout(() => {
        alert.remove()
      },2000)
    }
    return
  } 
  
  customer = { ...customer, table, hour }

  const modalForm = document.querySelector('#formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
  modalBootstrap.hide();

  showSections();

  getItemsFromAPI();
}

function showSections() {
  const hidenSections = document.querySelectorAll('.d-none');
  hidenSections.forEach(section => {
    section.classList.remove('d-none');
  })
}

function getItemsFromAPI() {

  const url = 'http://localhost:3000/items';

  fetch(url)
    .then(response => response.json())
    .then(data => showItems(data))
    .catch(error => console.log(error))
}

function showItems(responseAPI) {
  const containerItems = document.querySelector('#platillos .contenido');
  responseAPI.forEach(item => {
    const { id, name, price, category } = item;

    const row = document.createElement('DIV');
    row.classList.add('row', 'py-3', 'border-top');
    
    const nameRow = document.createElement('DIV');
    nameRow.classList.add('col-md-4');
    nameRow.textContent = name;

    const priceRow = document.createElement('DIV');
    priceRow.classList.add('col-md-3', 'fw-bold');
    priceRow.textContent = `$ ${price}`;
    
    const categoryRow = document.createElement('DIV');
    categoryRow.classList.add('col-md-3');
    categoryRow.textContent = categories[category];

    row.appendChild(nameRow);
    row.appendChild(priceRow);
    row.appendChild(categoryRow);
    
    containerItems.appendChild(row);
    
  })
}

