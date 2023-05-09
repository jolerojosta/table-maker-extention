let tableArray = [] // text and +-

let copiedText // text from page 
let isInputEmpty
let isInputEmptyWhileExtensionIsOpen = false


const textEl = document.getElementById("selected-text")
const arrFromLocalStorage = JSON.parse( localStorage.getItem("tableArray") )

const plusButton = document.getElementById("plus-btn")
const minusButton = document.getElementById("minus-btn")
const copyBtn = document.getElementById("copy-btn")
const deleteBtn = document.getElementById("delete-btn")

const tableEl = document.getElementById("data-table")

// get selected text from page
chrome.runtime.sendMessage({ action: "getSelectedText" }, function (response) {
  if (response)
  textEl.innerHTML = `Your text: ${response}`
  tableArray.push(response)
  copiedText = response
  isInputEmpty = !copiedText ? true : false
  //alert("input emtpy: " + isInputEmpty +" copied text: " + copiedText)
})


// get table from local storage if exists
if (arrFromLocalStorage) {
  tableArray = arrFromLocalStorage
  //console.log(tableArray)
  render(tableArray)
}


// draw array
function render(arr) {
  let tableItems = ''
  
  for (let i = 0; i < arr.length-1; (i+=2)) {
      tableItems += `
          <tr>
              <td>${arr[i]}</td>
              <td>${arr[(i+1)]}</td>
          </tr>
      `
  }
  tableEl.innerHTML = tableItems
}

// add two new elements to table
function addRowToTable(sign)
{ 
  
  //alert("isInputEmpty: " + isInputEmpty)
  
  const a = tableArray.length
  let char = (sign ? '+':'-')

  // adding text and sign to array
  //if (char && copiedText){
  if (isInputEmpty === false){
    tableArray.push(copiedText, char)
    
    //removeEmptyValues(tableArray)
  }
    
  // if text wasn't selected
  else if (isInputEmpty === true)
  {
    

      textEl.innerHTML = `<b id="error-text">No text was selected</b>`
      if (isInputEmptyWhileExtensionIsOpen === false)
      {
        tableArray.pop()
        isInputEmptyWhileExtensionIsOpen = true
      }
      
      //removeEmptyValues(tableArray)
      
      render(tableArray)
    
      //isInputEmpty = false
    } 
  
  // it works
  if (tableArray[a-1] === tableArray[a])
  {
    tableArray[a] = char

    tableArray.pop()
  }
  tableArray = removeEmptyValues(tableArray)
  localStorage.setItem("tableArray", JSON.stringify(tableArray))
 
  render(tableArray)
}

function removeEmptyValues(arr)
{
  arr = arr.filter(function(value,index,arr){
    return value !== ""
  })
  
  arr = arr.filter(function(value,index,arr){
    return value !== null
  })
  return arr
}

// + 
plusButton.addEventListener("click", function()
{
  addRowToTable(true)
})


// -
minusButton.addEventListener("click", function()
{    
  addRowToTable(false)
})


// delete click event
deleteBtn.addEventListener("dblclick", function()
{
  // delete from everywhere
  localStorage.clear()
  
  tableArray = []
  textEl.textContent = (copiedText ? ("Your text: " + copiedText) : "")
  tableEl.innerHTML = ''
})

// copy table click event
copyBtn.addEventListener("click", function()
{
    const tableToCopy = document.querySelector('#data-table').outerHTML
    copyToClipboard(tableToCopy, 'copy-table')
    textEl.innerHTML = `<b id="success-text">Table copied!</b>`
})

function copyToClipboard(html,id) {
  // create a temporary element for copying the HTML content
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html
  
  // get table
  const table = tempElement.querySelector('#data-table')

  // change the id so the copied table has black-on-white style
  html = table.outerHTML.replace('id="data-table"', 'id="copy-table"')

  tempElement.innerHTML = html
  document.body.appendChild(tempElement)

  // select the content of the temporary element
  const range = document.createRange()
  range.selectNodeContents(tempElement)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)

  // сopy the selected content to the clipboard
  document.execCommand('copy')
  

  // clean up
  selection.removeAllRanges()
  document.body.removeChild(tempElement)
}