class projectCreation {
  constructor(addButton){
    //refresh dropdwon in addForm
    $('#type-dropdown.dropdown')
      .dropdown()
    $('#campus-dropdown.dropdown')
      .dropdown()

    this.type = document.getElementById('type-dropdown')
    this.campus = document.getElementById('campus-dropdown')
    this.year = document.getElementById('year')
    this.submit = document.getElementById('add-project')

    // add event listener to the add button
    document.getElementById('add-data').addEventListener('click', this.addButtonClicked())

    // add event listener to the dropdown of addForm
    this.type.addEventListener('change', this.typeDropdownOnChange(this))

    // trigger dropdown on change to refresh the selection of school
    this.type.dispatchEvent(new Event('change'))

  }
  addButtonClicked(){
    return () => {
      $('#addDataForm').modal({
        onApprove(){return false},
      }).modal('show')
    }
  }
  // handle dropdown on change
  typeDropdownOnChange(that){
    return () => {
      that.campus.innerHTML = document.getElementById(`type${that.type.value}`).innerHTML
    }
  }

}

new projectCreation()