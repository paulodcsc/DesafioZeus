export default function Modal() {
  const modalWrapper = document.querySelector('.modal-wrapper')
  const cancelButton = document.querySelector('.button.cancel')

  cancelButton.addEventListener('click', close)

  function open() {
    //tira active
    modalWrapper.classList.add('active')
  }
  function close() {
    //dá active
    modalWrapper.classList.remove('active')
  }

  return {
    open,
    close
  }
}
