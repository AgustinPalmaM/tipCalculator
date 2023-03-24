let customer = {
  table: "",
  hour: "",
  order: [],
};

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
}

function showSections() {
  const hidenSections = document.querySelectorAll('.d-none');
  hidenSections.forEach(section => {
    section.classList.remove('d-none');
  })
}

