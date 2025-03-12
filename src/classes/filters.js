import List from "./list.js"

/**
 * Defines filters to make it easier to handle their logic
 */
class Filters {
    #filters

    static unmodifiedFilters = {
        type: { book: false, game: false, movie: false },
        status: { pending: false, in_progress: false, completed: false },
        rating: { 1: false, 2: false, 3: false, 4: false, 5: false }
    }

    constructor() {
        this.#filters = JSON.parse(JSON.stringify(Filters.unmodifiedFilters))
    }

    /**
     * Resets the object to the unmodifiedObject.
     * Uses JSON only for the object formatting
     */
    reset() {
        this.#filters = JSON.parse(JSON.stringify(Filters.unmodifiedFilters))
    }

    /**
     * Updates the object with from a given input
     * @param {string} filterType 
     * @param {string} key 
     */
    updateObject(filterType, key) {
        if (key && this.#filters[filterType] && key in this.#filters[filterType]) {
            // Toggle the filter value for the selected key
            this.#filters[filterType][key] = !this.#filters[filterType][key]
        }
    }

    /**
     * Checks whether the object has been modified from its original form
     * @returns true if has been modified false if not
     */
    hasBeenModified() {
        const mergedFilters = { ...this.#filters.type, ...this.#filters.status, ...this.#filters.rating }
        return Object.values(mergedFilters).some(value => value)
    }

    /**
     * Filters the given list
     * @param {List} list 
     * @returns filtered list
     */
    filter(list) {
        return new List(list.list.filter(item => {
            // Check type filters
            for (const [type, isActive] of Object.entries(this.#filters.type)) {
                if (isActive && item.type !== type) {
                    return false
                }
            }

            // Check status filters
            for (const [status, isActive] of Object.entries(this.#filters.status)) {
                if (isActive && item.status !== status) {
                    return false
                }
            }

            // Check rating filters
            for (const [rating, isActive] of Object.entries(this.#filters.rating)) {
                if (isActive && item.rating !== parseInt(rating)) {
                    return false
                }
            }

            return true
        }))
    }
}

export default Filters