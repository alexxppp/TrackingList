import Element from "./classes/element.js"
import List from "./classes/list.js"
import Filters from "./classes/filters.js"
import * as formLogic from "./helpers/formLogic.js"
import * as searchBarLogic from "./helpers/searchingBarLogic.js"
import * as elementLogic from "./helpers/elementLogic.js"

// Constants and objects
const filters = new Filters()
const elementsContainer = document.getElementById("elements-container")
const searchingBarInput = document.getElementById("search-input")
const sortingSelect = document.getElementById("sort-select")
const descendingButton = document.getElementById("sort-descending")
const filtersSelects = document.querySelectorAll("[id^='filter-']") // Selects all html elements with given id pattern
const confirmFiltersButton = document.getElementById("confirm-filters-btn")
const resetButton = document.getElementById("reset-filters-btn")

let list = new List()


// Exit point. Initializes everything
document.addEventListener("DOMContentLoaded", async () => {
    await initializeList()
    renderList(list)
    initializeListeners()
    console.log("Works so far")
})


// JSON
async function initializeList() {
    const listData = await window.electron.loadList()
    console.log(listData)

    list = new List(listData ? listData : [])
    console.log(list)
} // TODO: Doesn't fill the list correctly leading to errors in adding items


export async function saveList(list) {
    await window.electron.saveList(list.toJSON())
    console.log("list saved")
}


// Rendering
/**
 * Renders the given list into "elements-container"
 * @param {List} list list to render
 */
export function renderList(list) {
    elementsContainer.classList.remove("justify-content-center")
    elementsContainer.innerHTML = ""

    if (!list.list.length) {
        displayEmptyListMessage(elementsContainer)
    } else {
        renderAllElements(list, elementsContainer)
    }
    console.log("list rendered")
}

/**
 * Renders the given element, used for updating the element div after editing it
 * @param {Element} element element to render
 */
export function renderElement(element) {
    const elementDiv = document.getElementById(`container-element-${element.id}`)
    if (elementDiv) {
        elementDiv.innerHTML = element.getHTML()
        elementLogic.initializeElementButtons(element.id, list)
    }
}


// Helpers for rendering

/**
 * Displays a message in the container based on whether the list is empty
 * because no elements have been added or because the applied filters returned no results
 * @param {HTMLDivElement} container container element where the message will be displayed
 */
function displayEmptyListMessage(container) {

    const emptyListMessage = `<img src='../static/no-task.png' id='no-task-icon' class='opacity-50'><br>
                              <p class='opacity-50'>No elements yet.</p>`
        
    const emptyListForFiltersMessage = `<p class='opacity-50'>No elements were found with the given filters.</p>`

    container.classList.add("justify-content-center")
    container.innerHTML = filters.hasBeenModified() ? emptyListForFiltersMessage : emptyListMessage
}

/**
 * helper for RenderList(). Renders all the Elements in the list
 * @param {List} list List with the Elements
 * @param {HTMLDivElement} container container where to render the elements
 */
function renderAllElements(list, container) {
    list.list.forEach((element) => {
        const elementDiv = createElementDiv(element)
        container.appendChild(elementDiv)
        elementLogic.initializeElementButtons(element.id, list)
    })
}

/**
 * Helper for renderAllElements(). Creates and fills a personalized div for the given element
 * @param {Element} element Element to display in the div
 * @returns {HTMLDivElement} the created container
 */
function createElementDiv(element) {
    const elementDiv = document.createElement("div")

    elementDiv.id = `container-element-${element.id}`
    elementDiv.classList.add("element","d-flex","align-items-center","mb-3","mr-3","p-2","border")
    elementDiv.innerHTML = element.getHTML()

    return elementDiv
}


// Event listeners initializers

/**
 * Initializes all the initializers
 */
function initializeListeners() {
    initializeFormButtons()
    initializeSearchingBarListeners()
    initializeFormInputListener()
    initializeFiltersButtons()
    initializeSortingButtons()
    initializeConfirmRangeFiltersBtn()
}


// Event listeners

/**
 * Initializes all the form buttons
 */
function initializeFormButtons() {
    setupButton("show-form-btn", () => {
        formLogic.showForm("element-form-container")
        console.log("Show form button clicked")
    })

    setupButton("hide-form-btn", () => {
        formLogic.hideForm("element-form-container", "element-form")
        console.log("Hide form button clicked")
    })

    setupButton("hide-status-form-btn", () => {
        formLogic.hideForm("element-status-form-container","element-status-form")
        console.log("Hide status form button clicked")
    })

    setupSubmitButton("submit-button", () => {
        handleFormSubmitButton()
        saveList(list)
        console.log("Submit button pressed")
    })

    setupSubmitButton("change-status-button", () => {
        handleFormChangeStatusButton()
        saveList(list)
        console.log("Change status button pressed")
    })
}

/**
 * Initializes the searching bar listeners
 */
function initializeSearchingBarListeners() {
    setupButton("clear-bar-button", () => {
        searchBarLogic.clear("search-input")
        console.log("Clear bar button clicked")
    })

    searchingBarInput.addEventListener("input", () => {
        clearFilters()
        const filteredSearchingList = searchBarLogic.search(searchingBarInput.value.trim(), list)
        renderList(filteredSearchingList)
    })
}

/**
 * Initializes the form "input" listeners
 */
function initializeFormInputListener() {
    const form = document.getElementById("element-form")
    form.addEventListener("input", (event) => {
        event.preventDefault()

        const submitButton = document.getElementById("submit-button")
        submitButton.disabled = !form.checkValidity()

        formLogic.realTimeDisplayFormError("element-form")
    })
}

/**
 * Initializes the filters "checkbox" buttons
 */
function initializeFiltersButtons() {
    
    Array.from(filtersSelects).forEach(select => {
        select.addEventListener("change", (event) => {
            const filterType = event.target.id.split('-')[1]
            const selectedValue = event.target.value

            filters.updateObject(filterType, selectedValue)
        })
    })

    confirmFiltersButton.addEventListener("click", (event) => {
        let filteredList = filters.filter(list)
        if (filters.hasBeenModified()) {
            renderList(filteredList)
        } else {
            renderList(list)
        }
    })

    resetButton.addEventListener("click", () => {
        clearFilters()

        renderList(list)
    })

    document.querySelectorAll('.dropdown-menu').forEach((dropdown) => {
        dropdown.addEventListener('click', (event) => {
            event.stopPropagation()
        })
    })
}

/**
 * Clears everything related to filters
 */
function clearFilters() {
    filters.reset()

        Array.from(filtersSelects).forEach(select => {
            select.selectedIndex = 0
        })

        descendingButton.checked = false
        sortingSelect.selectedIndex = 0
}


// Initializers helpers

/**
 * Helper for setting listeners to a normal button. Used to make the code more readable
 * @param {String} buttonId id of the button to set the listener to
 * @param {callback} callback function to run as the listener activates 
 */
function setupButton(buttonId, callback) {
    const button = document.getElementById(buttonId)
    button.addEventListener("click", callback)
}

/**
 * Helper for setting listeners to a submit button. Used to make the code more readable
 * @param {String} buttonId id of the button to set the listener to
 * @param {callback} callback function to run as the listener activates 
 */
function setupSubmitButton(buttonId, callback) {
    const button = document.getElementById(buttonId)
    button.addEventListener("click", (event) => {
        event.preventDefault()
        callback()
    })
}

/**
 * Helper for initializeFormButtons(). Handles the "submit-button" logic to update
 * or create an element
 */
function handleFormSubmitButton() {
    const formData = formLogic.getFormData("element-form")
        const elementId = formData.id

        if (elementId) { // Update existing element
            const element = list.getElement(elementId)
            element.update(formData)

        } else { // Add new element
            const newElement = elementLogic.createElement(formData)
            list.add(newElement)
        }

        formLogic.hideForm("element-form-container", "element-form", true)
        saveList(list)
        renderList(list)
}

/**
 * Helper for initializeFormButtons(). Handles the "change-status-button" logic
 * to update or create an element
 */
function handleFormChangeStatusButton() {
    const elementId = parseInt(document.getElementById("element-status-id").value)
    const newStatus = formLogic.getStatusFormData("element-status-form")
    const element = list.getElement(elementId)

    element.status = newStatus
    formLogic.hideForm("element-status-form-container","element-status-form",true)

    saveList(list)
    renderElement(element)
}


/**
 * Initializes the sorting logic
 */
function initializeSortingButtons() {
    let originalList = []
    let sortedList = []

    sortingSelect.addEventListener("change", (event) => {
        sortedList = helperSorting(event, descendingButton.checked)
        originalList = [...sortedList]
        renderList(new List(sortedList))
    });

    descendingButton.addEventListener("change", (event) => {
        if (event.target.checked) {
            const reversedList = helperDescending(sortingSelect.selectedOptions[0]) ?? []
            if (reversedList.length) renderList(new List(reversedList))
        } else {
            if (originalList.length) renderList(new List(originalList))
        }
    })
}

/**
 * Helper for sorting elements of the list
 * @param {event} event 
 * @param {boolean} descending 
 * @returns sorted list
 */
function helperSorting(event, descending) {
    if (event.target.value == "name") return list.sortByName(descending)
    if (event.target.value == "rating") return list.sortByRating(descending)
    if (event.target.value == "status") return list.sortByStatus(descending)
}

/**
 * Helper for descending button logic
 * @param {event.target} eventTarget 
 * @returns sorted list
 */
function helperDescending(eventTarget) {
    if (eventTarget.value == "name") return list.sortByName(true)
    if (eventTarget.value == "rating") return list.sortByRating(true)
    if (eventTarget.value == "status") return list.sortByStatus(true)
    else return false
}

function getMinMaxFiltersInputs() {
    const min = document.getElementById("rating-min").value
    const max = document.getElementById("rating-max").value

    return [min, max]
}

function initializeConfirmRangeFiltersBtn() {
    const minButton = document.getElementById("rating-min")
    minButton.addEventListener("input", () => {
        const min = getMinMaxFiltersInputs()[0]
        const max = getMinMaxFiltersInputs()[1]
        if (max && max) renderList(list.filterRatingByRange(min, max))
        else renderList(list)
    })

    const maxButton = document.getElementById("rating-max")
    maxButton.addEventListener("input", () => {
        const min = getMinMaxFiltersInputs()[0]
        const max = getMinMaxFiltersInputs()[1]
        if (min && max) renderList(list.filterRatingByRange(min, max))
        else renderList(list)
    })
}