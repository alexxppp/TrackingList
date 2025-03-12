import List from "../classes/list.js"

/**
 * Clears the searching bar
 */
export function clear(barId) {
    let searchBar = document.getElementById(barId)
    searchBar.value = ""
}

/**
 * Searches in the List for an Element name or note
 * @returns a filtered list
 */
export function search(text, list) {

    const filteredElements = list.list.filter(e => 
        e.notes.toLowerCase().includes(text.toLowerCase()) || e.name.toLowerCase().startsWith(text.toLowerCase())
    )

    return new List(filteredElements)

}