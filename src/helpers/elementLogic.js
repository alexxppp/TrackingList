import Element from "../classes/element.js"
import * as formLogic from "./formLogic.js"
import { renderList, saveList } from "../renderer.js"

/**
 * Creates a new Element instance from the given form data.
 * @param {Object} formData - The data from the form to populate the Element.
 * @returns {Element} - The created Element instance.
 */
export function createElement(formData) {
    return new Element(formData.name, formData.type, formData.status, formData.rating, formData.notes)
}

/**
 * Adds listeners to the buttons of an Element:
 * Change Status, Edit, Delete
 * @param {String} id ID of the element
 * @param {Object} list list of Elements
 */
export function initializeElementButtons(id, list) {
    const changeStatusBtn = document.getElementById(`${id}-change-status`)
    const editBtn = document.getElementById(`${id}-edit`)
    const deleteBtn = document.getElementById(`${id}-delete`)

    // Adds listener to the "Change status" button
    if (changeStatusBtn) changeStatusBtn.addEventListener("click", () => handleChangeStatus(id, list))

    // Adds listener to the "Edit" button
    if (editBtn) editBtn.addEventListener("click", () => handleEditElement(id, list))

    // Adds listener to the "Delete" button
    if (deleteBtn) deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        handleDeleteElement(id, list, deleteBtn)
    })
}

/**
 * Handles the "Change Status" button listener
 * @param {String} id ID of the Element
 * @param {Object} list list of Elements
 */
function handleChangeStatus(id, list) {
    console.log(`Change status clicked for Element ID: ${id}`)
    const element = list.getElement(id)
    formLogic.showStatusForm("element-status-form-container", element.status, id)
}

/**
 * Handles the "Edit" button listener
 * @param {String} id ID of the Element
 * @param {Object} list list of elements
 */
function handleEditElement(id, list) {
    console.log(`Edit clicked for Element ID: ${id}`)
    const element = list.getElement(id)

    formLogic.fillForm("element-form-container", "element-form", element)
    formLogic.showForm("element-form-container")

    renderList(list)
}

/**
 * Handles the "Delete" button listener with confirmation
 * @param {String} id ID of the element
 * @param {Object} list List of Elements
 * @param {HTMLElement} deleteBtn The Delete button element
 */
function handleDeleteElement(id, list, deleteBtn) {
    console.log(`Delete clicked for Element ID: ${id}`)

    deleteBtn.textContent = "Press again to confirm"

    const revertText = setTimeout(() => {
        deleteBtn.textContent = "Delete"
        deleteBtn.removeEventListener("click", confirmDelete)
        deleteBtn.removeEventListener("click", preventCloseDropdown)
    }, 5000)

    deleteBtn.addEventListener("click", preventCloseDropdown)

    // Add an event listener to confirm deletion on the second click
    function confirmDelete(event) {
        deleteBtn.removeEventListener("click", preventCloseDropdown)

        // Remove the element from the list
        list.remove(id)
        saveList(list)
        renderList(list)

        clearTimeout(revertText)
        deleteBtn.removeEventListener("click", confirmDelete)
    }

    deleteBtn.addEventListener("click", confirmDelete)
}

/**
 * Prevents closing the dropdown when clicking the delete button
 * @param {event} event the click event
 */
function preventCloseDropdown(event) {
    event.stopPropagation()
}
