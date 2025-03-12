const validationMessageContainer = document.getElementById("validation-message-container")
const messageContainer = document.getElementById("personalized-message")
const confirmButton = document.getElementById("confirm-action-btn")
const cancelButton = document.getElementById("cancel-action-btn")
const overlay = document.getElementById("overlay-custom-2")

/**
* Shows a validation message with personalized message
* @param {string} message The personalized message to show
* @returns true if user is sure, false if cancel
*/
export function show(message) {
    return new Promise((resolve) => {
 
        // Show the validation message after updating the message content
        messageContainer.textContent = message
        validationMessageContainer.style.display = "block"
        overlay.style.display = "block"
 
        // Handle "Yes, I'm sure"
        const onConfirm = () => {
            validationMessageContainer.style.display = "none"
            overlay.style.display = "none"
            resolve(true)
        }
 
        // Handle "Cancel"
        const onCancel = () => {
            validationMessageContainer.style.display = "none"
            overlay.style.display = "none"
            resolve(false)
        }
 
        confirmButton.addEventListener("click", onConfirm)
        cancelButton.addEventListener("click", onCancel)
    })
 } //* Works