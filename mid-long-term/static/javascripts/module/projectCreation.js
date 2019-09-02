class projectCreation {
  constructor(){
    //refresh dropdwon in addForm
    $('#type-dropdown.dropdown')
      .dropdown()
    $('#campus-dropdown.dropdown')
      .dropdown()

    this.type = document.getElementById('type-dropdown')
    this.campus = document.getElementById('campus-dropdown')
    this.yearFrom = document.getElementById('yearFrom')
    this.yearTo = document.getElementById('yearTo')
    this.submit = document.getElementById('add-project')

    // add event listener to the add button
    document.getElementById('add-data').addEventListener('click', this.addButtonClicked())

    // add event listener to the dropdown of addForm
    this.type.addEventListener('change', this.typeDropdownOnChange(this))

    // trigger dropdown on change to refresh the selection of school
    this.type.dispatchEvent(new Event('change'))

    this.yearFrom.addEventListener('change', this.restrictYear(this))
    this.yearTo.addEventListener('change', this.restrictYear(this))
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

  restrictYear(that){
    return () => {
      const to = parseInt(that.yearTo.value)
      const from = parseInt(that.yearFrom.value)
      if(from >= to)
        that.yearTo.value = from + 1
    }
  }
}

new projectCreation()