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

const content = document.querySelector('#resumen .contenido');

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

    const quantityInput = document.createElement('INPUT');
    quantityInput.type = 'number';
    quantityInput.min = 0;
    quantityInput.value = 0;
    quantityInput.id = `item-${id}`
    quantityInput.classList.add('form-control');
    
    quantityInput.onchange = () => {

      const qty = parseInt(quantityInput.value);
      addItem( {...item, qty } );
    };


    const addInputToRow = document.createElement('DIV');
    addInputToRow.classList.add('col-md-2');
    addInputToRow.appendChild(quantityInput);

    row.appendChild(nameRow);
    row.appendChild(priceRow);
    row.appendChild(categoryRow);
    row.appendChild(addInputToRow);
    
    containerItems.appendChild(row);
    
  })
}

function addItem(item) {

  let { order } = customer;
  
  if( item.qty > 0 ) {
    if(order.some( product => product.id === item.id )) {
      const updatedOrder = order.map( food => {
        if(food.id === item.id) {
          food.qty = item.qty;
        }

        
        return food;
      })

      customer.order = [...updatedOrder];

    } else {

      customer.order = [...order, item]
    }
  } else {

    const result = order.filter( food => food.id !==  item.id )
    customer.order = [...result]
    
  }

  
  
  if (customer.order.length) {
    updateSummary();
  } else {
    messageEmptyOrder();
  }
  
}

function updateSummary() {

  cleanHTML(content);


  const summary = document.createElement('DIV');
  summary.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

  const table = document.createElement('P');
  table.textContent = 'Table: ';
  table.classList.add('fw-bold');

  const tableSpan = document.createElement('SPAN');
  tableSpan.textContent = customer.table;
  tableSpan.classList.add('fw-normal');

  const hour = document.createElement('P');
  hour.textContent = 'Hour: ';
  hour.classList.add('fw-bold');

  const hourSpan = document.createElement('SPAN');
  hourSpan.textContent = customer.hour;
  hourSpan.classList.add('fw-normal');

  table.appendChild(tableSpan);
  hour.appendChild(hourSpan);

  const heading = document.createElement('H3');
  heading.textContent = 'Dishes consumed: ';
  heading.classList.add('my-4', 'text-center')

  const group = document.createElement('UL');
  group.classList.add('list-group');

  const { order } = customer;
  order.forEach( item => {
    const { name, qty, price, id } = item;

    const list  = document.createElement('LI');
    list.classList.add('list-group-item');

    const itemName = document.createElement('H4');
    itemName.classList.add('my-4');
    itemName.textContent = name;

    const itemQuantity = document.createElement('P');
    itemQuantity.classList.add('fw-bold');
    itemQuantity.textContent = 'Quantity: ';

    const itemQuantitySpan = document.createElement('SPAN');
    itemQuantitySpan.classList.add('fw-normal');
    itemQuantitySpan.textContent = qty;

    itemQuantity.appendChild(itemQuantitySpan);
    
    const itemPrice = document.createElement('P');
    itemPrice.classList.add('fw-bold');
    itemPrice.textContent = 'Unit Price: ';
    
    const itemPriceSpan = document.createElement('SPAN');
    itemPriceSpan.classList.add('fw-normal');
    itemPriceSpan.textContent = `$ ${price}`;

    itemPrice.appendChild(itemPriceSpan);

    const itemSubtotal = document.createElement('P');
    itemSubtotal.classList.add('fw-bold');
    itemSubtotal.textContent = 'Subtotal: ';
    
    const itemSubtotalSpan = document.createElement('SPAN');
    itemSubtotalSpan.classList.add('fw-normal');
    itemSubtotalSpan.textContent = calculateSubtotal(price, qty);

    itemSubtotal.appendChild(itemSubtotalSpan);

    const deleteBtn = document.createElement('BUTTON');
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.textContent = 'Delete item';
    deleteBtn.onclick = () => {
      deleteItem(id);
    }

    list.appendChild(itemName);
    list.appendChild(itemQuantity);
    list.appendChild(itemPrice);
    list.appendChild(itemSubtotal);
    list.appendChild(deleteBtn);

    group.appendChild(list);

  })

  summary.appendChild(table);
  summary.appendChild(hour);
  summary.appendChild(heading);
  summary.appendChild(group);
  
  content.appendChild(summary);


}

function cleanHTML(target) {
  while( target.firstElementChild ) {
    target.firstElementChild.remove()
  }
}

function calculateSubtotal(price, quantity) {
  return `$ ${price * quantity}`
}

function deleteItem(id) {
  const { order } = customer;
  const updatedOrder = order.filter( item => item.id !== id );
  customer.order = [...updatedOrder];

  updateSummary();
  updateInput(id);
 
  if (customer.order.length === 0) {
    cleanHTML(content);
    messageEmptyOrder();
  }
}

function updateInput(id) {
  const inputTarget = document.querySelector(`#item-${id}`);
  inputTarget.value = 0;
}

function messageEmptyOrder() {
  const welcomeParagraph = document.createElement('P');
  welcomeParagraph.textContent = 'Añade los elementos del pedido';
  welcomeParagraph.classList.add('text-center')
  const container = document.querySelector('.contenido.row')
  container.appendChild(welcomeParagraph);
}