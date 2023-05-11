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
const languageBtn = document.getElementById("lang-changer")

const tableEl = document.getElementById("data-table")


let currentLanguage = JSON.parse( localStorage.getItem("lang") )
if (!currentLanguage) {
  currentLanguage = "en"
}
let yourText = `Your text: `
let noTxtSelected = `No text was selected!`
let copied = `Table copied!`
let firstH = document.getElementById("white")
let secondH = document.getElementById("green")


document.addEventListener("DOMContentLoaded", () => {
  document
    setLanguage(currentLanguage)
});


// get selected text from page
chrome.runtime.sendMessage({ action: "getSelectedText" }, function (response) {
  if (response)
  textEl.innerHTML = `${yourText}${response}`
  tableArray.push(response)
  copiedText = response
  isInputEmpty = !copiedText ? true : false
})


// get table from local storage if exists
if (arrFromLocalStorage) {
  tableArray = arrFromLocalStorage
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
  const a = tableArray.length
  let char = (sign ? '+':'-')

  // adding text and sign to array
  if (isInputEmpty === false){
    tableArray.push(copiedText, char)
  }
    
  // if text wasn't selected
  else if (isInputEmpty === true)
  {
    

      textEl.innerHTML = `<b id="error-text">${noTxtSelected}</b>`
      if (isInputEmptyWhileExtensionIsOpen === false)
      {
        tableArray.pop()
        isInputEmptyWhileExtensionIsOpen = true
      }

      render(tableArray)
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

function setLanguage(lang){
  if (lang === "ru")
  {
    yourText = `Ваш текст: `
    noTxtSelected = `Текст не выбран!`
    copied = `Скопировано!`

    firstH.textContent = `Обратный ответ`
    secondH.textContent = `на резюме соискателя`
    copyBtn.textContent = `Копировать`
    deleteBtn.textContent = `Удалить всё`

    currentLanguage = "ru"
    
  }
  else if (lang === "en")
  {
    yourText = `Your text: `
    noTxtSelected = `No text was selected!`
    copied = `Table copied!`

    firstH.textContent = `Applicant e-mail`
    secondH.textContent = `response generator`
    copyBtn.textContent = `Copy table`
    deleteBtn.textContent = `Delete all`

    currentLanguage = "en"
  }
  localStorage.setItem("lang", JSON.stringify(currentLanguage))
}
languageBtn.addEventListener("click", function()
{
  if (currentLanguage === "ru")
  setLanguage("en")
  else if (currentLanguage === "en")
  setLanguage("ru")
  
})


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
  textEl.textContent = (copiedText ? (yourText + copiedText) : "")
  tableEl.innerHTML = ''
})

// copy table click event
copyBtn.addEventListener("click", function()
{
    const tableToCopy = document.querySelector('#data-table').outerHTML
    copyToClipboard(tableToCopy, 'copy-table')
    textEl.innerHTML = `<b id="success-text">${copied}</b>`
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