/**
 * Class to define an element of the list, with all the error checking
 * needed based on the exercise description.
 * Throws Error with description of the problem if any of the
 * requirements is not met.
 */
class Element {

    static types = ["book", "game", "movie"]
    static typeIcons = ["book.png", "game.png", "clapperboard.png"] //! matches the order above

    static statuses = ["pending", "in_progress", "completed"]
    static statusColors = ["red", "orange", "green"] //! matches the order above

    static count = 0

    #id
    #name
    #type
    #status
    #rating
    #notes

    constructor(name, type, status = "pending", rating = 0, notes) {
        this.#id = Element.count++
        this.name = name
        this.type = type
        this.typeIcon = Element.typeIcons[Element.types.indexOf(this.type)] // to match the icon
        this.status = status
        this.statusColor = Element.statusColors[Element.statuses.indexOf(this.status)] // to match the status color
        this.rating = rating
        this.notes = notes
    }

    /**
     * Updates a single element without changing its ID
     * @param {Element} Element element with data to update
     */
    update({ name, type, status, rating, notes }) {
        this.name = name
        this.type = type
        this.typeIcon = Element.typeIcons[Element.types.indexOf(this.type)] // to match the icon
        this.status = status
        this.statusColor = Element.statusColors[Element.statuses.indexOf(this.status)] // to match the status color
        this.rating = rating
        this.notes = notes
    }

    get id() {
        return this.#id
    }

    get name() {
        return this.#name
    }

    set name(name) {
        if (!name || name.length > 50) throw new Error("Name is mandatory and must be shorter than 50 characters")
        this.#name = name
    }

    get type() {
        return this.#type
    }

    set type(type) {
        if (!Element.types.includes(type)) throw new Error("Not a valid type")
        this.#type = type
    }

    get status() {
        return this.#status
    }

    set status(status) {
        if (!Element.statuses.includes(status)) throw new Error("Not a valid status")
        this.#status = status
        this.statusColor = Element.statusColors[Element.statuses.indexOf(status)]
    }

    get rating() {
        return this.#rating
    }

    set rating(rating) {
        if (rating < 0 || rating > 5) throw new Error("Rating must be a number between 1 and 5, or 0 if not rated")
        this.#rating = rating
    }

    get notes() {
        return this.#notes
    }

    set notes(notes) {
        if (notes.length > 200) throw new Error("Notes length must be shorter than 200 characters")
        this.#notes = notes
    }

    /**
     * Builds the HTML of an element with personalized IDs
     * @returns the HTML of an element
     */
    getHTML() {
        return `
            <div class="status-bar ${this.statusColor}"></div>
            
            <div class="d-flex align-items-center ml-2">
                <img src="../static/${this.typeIcon}" alt="Type" class="icon mr-2">
                <div class="hover-div">
                    <strong class="name">${this.#name}</strong>
                    ${this.#notes ? `<div class="notes-hover"><p>${this.#notes}</p></div>` : ''}
                </div>
            </div>

            <div class="d-flex align-items-center ml-auto">

                <strong class="rating mr-2">${this.#rating}</strong>
                <button class="btn p-0 d-flex align-items-center" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="../static/more.png" alt="more" id="three-dots" class="icon">
                </button>
                <div class="dropdown-menu">
                    <a id="${this.#id}-change-status" class="dropdown-item" href="#">Change status</a>
                    <a id="${this.#id}-edit" class="dropdown-item" href="#">Edit</a>
                    <a id="${this.#id}-delete" class="dropdown-item text-danger" href="#">Delete</a>
                </div>

            </div>
        `
    }

}

export default Element