/**
 * Calculate the total number of pages to generate pagination 
 * buttons.
 * 
 * @param totalEntries
 * @param entriesPerPage 
 * @returns 
 */
export function calcNumberOfPages(totalEntries: number, entriesPerPage: number): number {
   return Math.ceil(totalEntries / entriesPerPage);
}