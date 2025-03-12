import * as validationMessage from "./popup.js"

const overlay = document.getElementById("overlay-custom")

// Form helpers

/**
 * Checks if the form has any field that has been filled or changed
 * @param {String} formId ID of the form
 * @returns {Boolean} true if any fields are filled
 */
export function isFilled(formId) {
    const form = document.getElementById(formId)

    // Previously used to check any imput

    // const inputs = form.querySelectorAll("input")
    // const selects = form.querySelectorAll("select")
    // const areInputsFilled = Array.from(inputs).some(input => input.value.trim() !== "")
    // const areSelectsFilled = Array.from(selects).some(select => select.value !== "")
    // return areInputsFilled || areSelectsFilled

    // Now check only name
    const name = form.querySelector("#element-name")
    
    return name.value.trim() !== ""
}

/**
 * Clears the form to its default values
 * @param {String} formId ID of the form to clear
 */
export function clearForm(formId) {
    const form = document.getElementById(formId)
    form.reset()
}

/**
 * Validates custom error messages for input fields
 * @param {HTMLInputElement} input
 * @returns {String} Error message or empty string
 */
function customErrorValidationMessage(input) {
    if (input.checkValidity()) return ""
    if (input.validity.valueMissing) return "This field is mandatory"
    if (input.validity.tooShort) return `Field has to have at least ${input.minLength} characters`
    if (input.validity.tooLong) return `Field has to have at max ${input.maxLength} characters`
    if (input.validity.rangeUnderflow) return `Field has to be at least ${input.min}`
    if (input.validity.rangeOverflow) return `Field has to be at max ${input.max}`
    if (input.validity.patternMismatch) return "The field has to match the pattern"

    return "Error in this field"
}

// Form display functions

/**
 * Shows the form with the given ID
 * @param {String} formContainerId ID of the form container
 */
export function showForm(formContainerId) {
    const formContainer = document.getElementById(formContainerId)
    formContainer.style.display = "block"
    overlay.style.display = "block"
}

/**
 * Hides the form with the given ID, with validation
 * @param {String} formContainerId ID of the form container
 * @param {String} formId ID of the form
 * @param {Boolean} forceHide if true, force hiding without validation
 */
export function hideForm(formContainerId, formId, forceHide = false) {
    const formContainer = document.getElementById(formContainerId)

    if (!forceHide) {
        if (!isFilled(formId)) {
            formContainer.style.display = "none"
            overlay.style.display = "none"
            clearForm(formId)
        } else {
            onValidationClickForm(formContainerId)
        }
    } else {
        clearForm(formId)
        formContainer.style.display = "none"
        overlay.style.display = "none"
    }
}

/**
 * Handles user confirmation for leaving a filled form
 * @param {String} formContainerId ID of the form container
 */
async function onValidationClickForm(formContainerId) {
    const message =
        "You already filled out some fields, if you go back you will lose the progress."
    const userConfirmed = await validationMessage.show(message)

    const formContainer = document.getElementById(formContainerId)
    if (userConfirmed) {
        formContainer.style.display = "none"
        overlay.style.display = "none"
        clearForm("element-form")
    } else {
        formContainer.style.display = "block"
        overlay.style.display = "block"
    }
}

// Form input functions

/**
 * Displays real-time error messages for a form
 * @param {String} formId ID of the form
 */
export function realTimeDisplayFormError(formId) {
    const form = document.getElementById(formId)

    Array.from(form.elements).forEach((field) => {
        if (field.tagName === "INPUT" && field.id != "element-hidden-id") {
            const errorField = document.getElementById("error-" + field.id)
            if (field.value.length === 0) {
                errorField.textContent = ""
            } else if (!field.checkValidity()) {
                errorField.textContent = customErrorValidationMessage(field)
                console.log("Form has invalid fields")
            } else {
                errorField.textContent = ""
            }
        }
    })
}

/**
 * Fills a form with data from an element
 * @param {String} formContainerId ID of the form container
 * @param {String} formId ID of the form
 * @param {Object} element the element to fill up the form
 */
export function fillForm(formContainerId, formId, element) {
    const formContainer = document.getElementById(formContainerId)
    formContainer.querySelector("#form-title").textContent = "Edit Element"
    formContainer.querySelector("#submit-button").textContent = "Confirm"

    const form = document.getElementById(formId)
    form.querySelector("#element-name").value = element.name
    form.querySelector("#element-type").value = element.type
    form.querySelector("#element-status").value = element.status
    form.querySelector("#element-rating").value = element.rating
    form.querySelector("#element-notes").value = element.notes
    form.querySelector("#element-hidden-id").value = element.id
}

/**
 * Extracts data from a form
 * @param {String} formId ID of the form
 * @returns {Object} all form data
 */
export function getFormData(formId) {
    const form = document.getElementById(formId)
    return {
        name: form.querySelector("#element-name").value.trim(),
        type: form.querySelector("#element-type").value,
        status: form.querySelector("#element-status").value,
        rating: parseInt(form.querySelector("#element-rating").value) || 0,
        notes: form.querySelector("#element-notes").value.trim() || "",
        id: parseInt(form.querySelector("#element-hidden-id").value),
    }
}

/**
 * Extracts the element status from the form
 * @param {String} formId ID of the form
 * @returns {String} element status
 */
export function getStatusFormData(formId) {
    const form = document.getElementById(formId)
    return form.querySelector("#element-status-only").value
}

/**
 * Displays the status form and sets its values
 * @param {String} formContainerId ID of the form container
 * @param {String} elementStatus element status
 * @param {String} elementId ID of the Element
 */
export function showStatusForm(formContainerId, elementStatus, elementId) {
    showForm(formContainerId)
    const form = document.getElementById(formContainerId)
    form.querySelector("#element-status-id").value = elementId
    form.querySelector("#element-status-only").value = elementStatus
}
