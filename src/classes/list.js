import Element from "./element.js"

/**
 * Class to define a List of Elements.
 * It will be a list of dictionaries, where each dictionary
 * will represent an Element, with all its values stored as
 * a key-value pair.
 * Example:
 * [
 * {"name": "Harry Potter", "type": "book", "status": "pending", "rating": 1.5, "notes": ""},
 * {etc...}
 * ]
 */
class List {

    constructor(elements = []) {
        if (!Array.isArray(elements)) throw new Error("Constructor parameter of list is not an array")
        
        elements.forEach((e) => {
            if (typeof e !== "object") throw new Error("Constructor parameter of list does not contain Objects")
        })

        this.list = []
        this.fillWithElements(elements)
    }

    /**
     * Fills the list by instanciating elements and pushing them
     * @param {Element Array} elements 
     */
    fillWithElements(elements) {
        elements.forEach(e => {
            this.list.push(new Element(e.name, e.type, e.status, e.rating, e.notes))
        })
    }

    /**
     * Gets an element from the list by its index
     * @param {Integer} index 
     * @returns Element
     */
    get(index) {
        return this.list[index]
    }

    /**
     * Finds an element by its ID
     * @param {string} elementId 
     * @returns Element
     */
    getElement(elementId) {
        return this.list.find(element => element.id === elementId)
    }

    /**
     * To String
     */
    toString() {
        this.list.forEach(e => console.log(e.name + ", " + e.status))
    }

    /**
     * Adds an Element to the List of Elements
     * @param {Element} element Element type variable
     */
    add(element) {
        this.list.push(element)
    }

    /**
     * Removes an Element from the List of Elements
     * @param {Element} element Element type variable
     */
    remove(elementId) {

        for (let i = 0, length = this.list.length; i < length; i++) {
            if (this.list[i].id == elementId) {
                this.list.splice(i, 1)
                console.log(`Element ${this.list[i]} removed`)
                break
            }
        }

    }

    /**
     * Triggers event to save list in main.js
     */
    async save () {
        await window.bridge.saveList(this.toJSON())
    }

    /**
     * Filters the list by type and by the given parameters
     * @param type Element type to filter by
     * @returns a new list with the filtered elements
     */
    filterByType(type) {
        return this.list.filter(element => element.type === type)
    }

    /**
     * Filters the list by status and by the given parameters
     * @param type Element status to filter by
     * @returns a new list with the filtered elements
     */
    filterByStatus(status) {
        return this.list.filter(element => element.status === status)
    }

    /**
     * Filters the list by rating and by the given parameters
     * @param type Element rating to filter by
     * @returns a new list with the filtered elements
     */
    filterByRating(rating) {
        return this.list.filter(element => element.rating === parseInt(rating))
    }

    filterRatingByRange(min, max) {

        return new List(this.list.filter(e => e.rating <= parseInt(max) && e.rating >= parseInt(min)))
    }

    /**
     * Function to sort the list of Elements by name in Ascending or Descending order
     * @param {boolean} isDescending false by default: true if Descending order, false if Ascending order
     */
    sortByName(isDescending = false) {
        return this.list.sort((a, b) => {
            if (a.name < b.name) return isDescending ? 1 : -1
            if (a.name > b.name) return isDescending ? -1 : 1
            return 0
        })
    }

    /**
     * Function to sort the list of Elements by status in Ascending or Descending order
     * considering the Ascending status order the following:
     * pending, in_progress, completed
     * @param {boolean} isDescending false by default: true if Descending order, false if Ascending order
     */
    sortByStatus(isDescending = false) {
        return this.list.sort((a, b) => {
            let order = ["pending", "in_progress", "completed"]

            if (isDescending) return order.indexOf(a.status) - order.indexOf(b.status)
            else return order.indexOf(b.status) - order.indexOf(a.status)
        })
    }

    /**
     * Function to sort the list of Elements by rating in Ascending or Descending order
     * @param {boolean} isDescending false by default: true if Descending order, false if Ascending order
     */
    sortByRating(isDescending = false) {
        return this.list.sort((a, b) => {
            return isDescending ? b.rating - a.rating : a.rating - b.rating
        })
    }

    /**
     * Parses the List to JSON format
     * @returns JSON fomatted List with all the Elements
     */
    toJSON() {
        let jsonList = []

        this.list.forEach((e) => {

            let jsonElement = {
                name: e.name,
                type: e.type,
                status: e.status,
                rating: e.rating,
                notes: e.notes
            }

            jsonList.push(jsonElement)
        })

        return jsonList
    }
    
}

export default List
