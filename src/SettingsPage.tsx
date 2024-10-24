import { useEffect, useState, useRef } from "react";
import Http from "./Http";
import TranslationsForm from "./TranslationsForm";
import { InfoText } from "./InfoText";
import { CreditsText } from "./CreditsText";
import InitErrorMessage from "./InitErrorMessage";
import SettingsPageHeader from "./SettingsPageHeader";
import Spinner from "./Spinner";
import Modal from "./Modal";
import FeedbackText from "./FeedbackText";
import { isJson } from "./utils/utils";
import { responseMessages } from "./responseMessages";
import ToastNotice from "./ToastNotice";
import { calcNumberOfPages } from "./utils/pagination";
import { SingleTranslation, TranslationsObject } from "./@types/componentTypes";
import { v4 as uuid } from 'uuid';

const SettingsPage: React.FC = () => {
    /**
     * Variables to handle data and errors.
     */
    const [formEntries, setFormEntries] = useState(null); // All entries (storage/state).
    const [metaData, setMetaData] = useState(null);

    const [searchQuery, setSearchQuery] = useState(null);

    const [error, setError] = useState(null);
    const [onError, setOnError] = useState(false);

    const [submitError, setSubmitError] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    /**
     * Pagination.
     */
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [nPages, setNPages] = useState<number>(0);
    const [currPage, setCurrPage] = useState<number>(0);
    const [prevPageBtnActive, setPrevPageBtnActive] = useState<boolean>(false);
    const [nextPageBtnActive, setNextPageBtnActive] = useState<boolean>(false);

    /**
     * Loading statuses - partial statuses.
     * 
     * Submitting, default regeneration, deleting, importing, exporting
     */
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [defaultRegeneration, setDefaultRegeneration] = useState<boolean>(false);
    const [entriesDeleting, setEntriesDeleting] = useState<boolean>(false);
    const [entriesImporting, setEntriesImporting] = useState<boolean>(false);
    const [entriesExporting, setEntriesExporting] = useState<boolean>(false);

    /**
     * Modal states.
     * 
     * Import modal.
     */
    const [showImportModal, setShowImportModal] = useState(false);
    const [importModalContent, setImportModalContent] = useState(null);

    /**
     * Toast messages
     */
    const [toast, setToast] = useState({message: null, status: null});

    /**
     * Track for edits and saved.
     * 
     * Then if the user made edits and is going out of the tab add an advice with window events.
     * 
     * Set saved on false on first load.
     */
    const [saved, setSaved] = useState<boolean>(true);

    /**
     * Track last action performed.
     */
    const [lastAction, setLastAction] = useState(null); 

    /**
     * References.
     */
    const formRef = useRef(null);

    /**
     * Get translations from the server.
     * 
     * Save the data on formEntries as data storage.
     */
    useEffect(() => {
        setTimeout(async () => await getTranslations(), 1200)
    }, []);

    /**
     * Paginate when:
     * 
     * - entriesPerPage and formEntries change.
     * - searchQuery is NOT an empty string and contains a query to search for (detect search query and adjust pagination).
     */
    useEffect(
        () => {
            const fetchData = async () => {
                if (!formEntries) return;

                // Empty search query.
                if (!searchQuery || searchQuery.length === 0) {
                    /**
                     * Regenerate pagination
                     */
                    await regeneratePagination();
    
                    /**
                     * Prev and next pagination buttons.
                     */
                    setPagPrevNextBtns();

                    setHasSearched(false);

                    return;
                }
                
                // Search query | Detect search action.
                if (!hasSearched) setCurrPage(0);
                setHasSearched(true);   // Yes, you searched!
        
                // Recalculate pagination on filtered elements.
                const filtered: TranslationsObject = filterEntriesBySearch();

                if (filtered.length <= entriesPerPage) setCurrPage(0);
        
                regeneratePagination(filtered);
                setPagPrevNextBtns();
        
                // console.info(
                //     ['Searched entries: ', filtered],
                //     ['Search query: ', searchQuery]
                // )

                return;
            };

            fetchData();
        },
        [formEntries, entriesPerPage, currPage, nPages, searchQuery]
    )

    /**
     * Detect when 'formEntries' changes.
     */
    useEffect(
        () => {
            // if (!edited) return;

            // setEdited(true);

            // console.log('formEntries changed');
            // console.log(formEntries);
        },
        [formEntries]
    )

    /**
     * Detect saved or unsaved information.
     */
    useEffect(
        () => {
            const handleTabClosing = (e: BeforeUnloadEvent) => {
                if (!saved) {
                    e.preventDefault();

                    const msg = 'Non hai salvato le tue traduzioni? Se lascerai questa pagina perderai i tuoi progressi!';

                    e.returnValue = msg;
                    
                    return msg;
                }
            }

            window.addEventListener('beforeunload', handleTabClosing);

            return () => {
                window.removeEventListener('beforeunload', handleTabClosing);
            }
        }, [saved]
    );

    /**
     * Track last action performed.
     */
    useEffect(
        () => {
            if (!lastAction) return;    

            switch (lastAction) {
                // Focus on the last row added.
                case 'add-row':
                    const rows = formRef.current.querySelectorAll('.translations-form .translation-row');
                    const lastRow = rows[rows.length - 1];

                    // console.log(lastRow);

                    lastRow.scrollIntoView({behavior: 'smooth', block: 'center'});
                    lastRow.classList.add('highlight-row');
                    lastRow.querySelector('input[type="text"]').focus();

                    setTimeout(() => { lastRow.classList.remove('highlight-row') }, 3000);

                    break;
            }

            // Reset last action.
            setLastAction(null);
        },
        [lastAction]
    )

    /**
     * Get translations.
     */
    async function getTranslations() {
        return new Promise((resolve, reject) => {
            Http.get(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/translations')
                .then((response) => {
                    const data = response.data
    
                    if (!data.hasOwnProperty('translations') || !data.hasOwnProperty('meta_data')) {
                        setError(responseMessages.missingServerResponseData);
                        setOnError(true);
    
                        console.error(responseMessages.missingServerResponseData);

                        reject(responseMessages.missingServerResponseData);
                    } else {
                        // console.log(data);
        
                        setFormEntries(data.translations);
                        setMetaData(data.meta_data);
    
                        setOnError(false);

                        resolve(data);
                    }
    
                })
                .catch((error) => {
                    console.error(error);
    
                    setError(error);
                    setOnError(true);

                    reject(error);
                });
        })
    }

    /**
     * Get filtered entries by search query.
     * 
     * Return the entire translation object array filtered by the search query.
     * 
     * We need this function also to regenerate pagination getting a new array of translations.
     */
    function filterEntriesBySearch(): TranslationsObject {
        return formEntries.filter((entry: SingleTranslation, i) => {
            const q = searchQuery ? searchQuery.toLowerCase() : '';

            if (entry.english_string.toLowerCase().includes(q)) return true;
        })
    }

    /**
     * Regenerate pagination.
     */
    async function regeneratePagination(filteredEntries = null) {
        return new Promise((resolve, reject) => {
            setNPages(
                calcNumberOfPages(
                    filteredEntries ? filteredEntries.length : formEntries.length, 
                    entriesPerPage
                )
            );

            resolve(true);
        })
    }

    /**
     * On translation search.
     */
    function onTranslationSearch(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        e.stopPropagation();

        // console.log((e.target as HTMLFormElement).value)

        setSearchQuery((e.target as HTMLFormElement).value as string);
    }

    /**
     * On search clear.
     */
    function onSearchClear(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setHasSearched(false);
        setSearchQuery('');
        setCurrPage(0);
    }

    /**
     * On translations form submit.
     * 
     * @param e
     */
    function onTranslationFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setSubmitLoading(true);

        setTimeout(
            () => {
                Http.post(
                    ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/translations', 
                    {
                        'translations_data': formEntries
                    }
                )
                    .then((response) => {
                        const data = response.data
        
                        // console.log(data);
        
                        if (data.status === 200 && data.status_message === 'OK') {
                            setSubmitSuccess(data.message);

                            setFormEntries(data.translations_data.translations);
                            setMetaData(data.translations_data.meta_data);
        
                            setError(null);
                            setOnError(false);
                            setSubmitError(false);

                            setSubmitLoading(false);    

                            // Show the toast message  .
                            setToast({message: data.message, status: 'success'});

                            // Set that translations are saved.
                            setSaved(true);
                        } else {
                            setSaved(false);
                        }
        
                    })
                    .catch((error) => {
                        console.error(error);
        
                        setError(error);    
                        setSubmitError(true);

                        setSubmitLoading(false);    

                        setToast({message: error.response.data.message, status: 'error'});

                        setSaved(false);
                    });
            },
            1200
        )
    }

    /**
     * On translation form add row.
     * 
     * @param e 
     */
    function onTranslationFormAddRow(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault(); 
        e.stopPropagation();

        /**
         * You have searched before?
         * 
         * If you have searched and still searching and you are adding a row,
         * go out of search mode and clear the search query.
         */
        if (hasSearched) {
            setHasSearched(false);
            setSearchQuery('');

            // console.log('You searched before. Error can occur! So I clean searching and go back to normal mode.');
        }

        if (formEntries.length === 0) {
            setFormEntries([
                {
                    id: metaData.id_type === 'uint' ? 1 : uuid(),
                    english_string: 'Esempio: Stringa da tradurre',
                    italian_translation_string: 'Esempio: Traduzione'
                }
            ]);
        } else {
            setFormEntries([
                ...formEntries,
                {
                    id: metaData.id_type === 'uint' ? (getLastEntryId() + 1) : uuid(),
                    english_string: 'Esempio: Stringa da tradurre',
                    italian_translation_string: 'Esempio: Traduzione'
                }
            ]);
        }

        /**
         * If last page is full, go to the new generated page (nPages + 1, or nPages if React do not update the state immediately).
         * 
         * If the last page is not full, but current page has reached the limit, go to the last page.
         */
        if (isLastPageFull()) {
            setCurrPage(nPages);
        } else if (pageEntriesLimitReached()) {
            setCurrPage(nPages - 1);
        }

        setSaved(false);

        setLastAction('add-row');

        // console.log(formEntries)
    }

    /**
     * On translations form remove row.
     * 
     * @param e 
     * @param index 
     */
    function onTranslationFormRemoveRow(e: React.MouseEvent<HTMLButtonElement>, id: number | string) {
        e.preventDefault();
        e.stopPropagation();

        /**
         * Before we delete the element, because it could be the last one,
         * check if we reached the last page entry on current page.
         * 
         * If yes, go back to the previous page. If current page is not zero.
         * 
         * Do not go back if current page is 0.
         * 
         * If we go back when current page is 0 we'll get a pagination bug if we add more entries.
         */
        if (currPage !== 0 && lastEntryCurrPageReached()) {
            setCurrPage(currPage - 1);
        }

        setFormEntries(formEntries.filter((entry: SingleTranslation) => entry.id !== id));

        setSaved(false);
    } 

    /**
     * Get last entry id.
     */
    function getLastEntryId(): number {
        return Number(formEntries[formEntries.length - 1]['id']);
    }

    /**
     * On translation row input change.
     * 
     * @param e 
     * @param index 
     * @param key 
     */
    function onInputChange(e: React.FormEvent<HTMLInputElement>, id: number | string, key: string) {
        e.preventDefault();
        e.stopPropagation();

        setFormEntries(formEntries.map((entry: SingleTranslation) => {
            if (entry.id === id) {
                return {
                    ...entry,
                    [key]: e.currentTarget.value
                }
            }

            return entry;
        }));

        setSaved(false);
    }

    /**
     * On Automatic translation.
     */
    function onAutomaticTranslations (e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        
        // console.log(e.target);

        alert("Attenzione: questa funzione non è ancora disponibile. La sto sviluppando - Michele Mincone");
    }

    /**
     * Regenerate default translations.
     * 
     * @param e
     */
    function onRegenerateDefaultTranslations(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Sei sicuro di voler rigenerare le traduzioni di default? Questa operazione sovrascriverà tutte le traduzioni attuali.\n\nLe traduzioni di default non sono altro che un preset di traduzioni standard che vengono generate automaticamente alla prima installazione di questo plugin.")) {
            return;
        }

        setDefaultRegeneration(true);

        Http.post(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/translations/regenerate')
            .then(response => {
                const data = response.data

                // console.log(data);

                setFormEntries(data.translations_data.translations);
                setMetaData(data.translations_data.meta_data);

                setDefaultRegeneration(false);

                setToast({message: data.message, status: 'success'});

                setCurrPage(0); // Restart from page 0

                setSaved(true);
            })
            .catch(error => {
                console.log(error);

                setDefaultRegeneration(false);

                setToast({message: error.response.data.message, status: 'error'});

                setSaved(false);
            });
    }

    /**
     * Delete all translations.
     * 
     * @param e
     */
    function onDeleteAllTranslations(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Sei sicuro di voler eliminare tutte le traduzioni?")) {
            return;
        }

        setEntriesDeleting(true);   

        Http.delete(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/translations')
            .then(response => {
                const data = response.data

                // console.log(data);

                setFormEntries(data.translations_data.translations);
                setMetaData(data.translations_data.meta_data);

                setEntriesDeleting(false);
                
                setToast({message: data.message, status: 'success'});

                // When I delete everything, reset current page to 0.
                setCurrPage(0);

                setSaved(true);
            })
            .catch(error => {
                console.log(error)

                setEntriesDeleting(false);  

                setToast({message: error.response.data.message, status: 'error'});

                setSaved(false);
            });

    }

    /**
     * Tools.
     * 
     * Export translations
     */
    function onExportTranslations(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Sei sicuro di voler esportare tutte le traduzioni? Le riceverai in formato JSON")) return;

        setEntriesExporting(true);  

        Http.post(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/manage/export')
            .then(response => {
                const data = response.data;

                const exportedJson = isJson(data.exported_json) ? data.exported_json : JSON.stringify(data.exported_json);

                const blob = new Blob([exportedJson], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = data.json_file_name;
                a.click();

                URL.revokeObjectURL(url);

                setEntriesExporting(false); 

                setToast({message: data.message, status: 'success'});
            })
            .catch(error => {    
                console.error(error);

                setEntriesExporting(false); 

                setToast({message: error.response.data.message, status: 'error'});
            });
    }

    /**
     * Import translations.
     */
    function onImportTranslations(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setEntriesImporting(true);

        const formHtml = formRef.current
        const formImportInputField: HTMLInputElement = formHtml.querySelector('#import-translations-file')

        formImportInputField.value = ''

        if (!confirm("Sei sicuro di voler importare delle traduzioni? Se si, devono essere in formato JSON e devi averle precedentemente esportate da questo plugin.")) return;
        
        formImportInputField.click()

        // Detect cancel of file window selection
        formImportInputField.oncancel = (event: Event) => {  
            setEntriesImporting(false); 
            
            setToast({message: 'Nessun file selezionato. Operazione di importazione annullata!', status: 'warning'});
        }

        // Detect file change to get the file.
        formImportInputField.onchange = (event: Event) => {
            setImportModalContent(<Spinner title="Rilevamento del file in corso..."/>);
            setShowImportModal(true); // Show the modal

            const target = event.target as HTMLInputElement;

            // No files selected
            if (!target.files && target.files.length === 0) {
                setImportModalContent(<FeedbackText text="Nessun file selezionato!" status="warning"/>);
                setEntriesImporting(false); 

                console.log('Nessun file selezionato!');

                return;
            }

            setImportModalContent(<Spinner title="Caricamento in corso del file di traduzione JSON..."/>);

            const file = target.files[0];

            const formData = new FormData();
            formData.append('ctp-translations', file);

            setTimeout(() => {
                Http.post(
                    ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/manage/import',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                        }
                    }
                )
                .then(response => {
                    const data = response.data

                    // console.log(data)

                    setImportModalContent(<FeedbackText text="Caricamento del file avvenuto con successo!..." status="success"/>);

                    setFormEntries(data.translations_data.translations);
                    setMetaData(data.translations_data.meta_data);

                    setEntriesImporting(false); 

                    setToast({message: data.message, status: 'success'});

                    // After importing data set current page to 0.
                    setCurrPage(0);

                    setSaved(true);
                })
                .catch(error => {
                    console.log(error)

                    const text = `Si è verificato un errore durante il caricamento del file! Codice errore: ${error.response.data.message}`;

                    setImportModalContent(<FeedbackText text={text} status="error"/>);

                    setEntriesImporting(false); 

                    setToast({message: error.response.data.message, status: 'error'});

                    setSaved(false);
                })
            }, 1200);
        }
    }

    /**
     * On pagination entries per page.
     */
    function onPaginationEntriesPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLSelectElement
        const entries = Number(target.value) as number

        // console.log(entries);

        // Set entries per page
        setEntriesPerPage(entries);

        // Everytime we change entries per page -> set curr page to 0
        setCurrPage(0);
    }

    /**
     * On Page Change.
     */
    function onPageChange(e: React.MouseEvent<HTMLButtonElement>, pageNum: number) {
        e.preventDefault();
        e.stopPropagation();

        // console.log(pageNum)

        setCurrPage(pageNum)
    }

    /**
     * Activate or deactivate previous or next pagination buttons.
     */
    function setPagPrevNextBtns() {
        /**
         * Convert current page to base 0, to base 1 (start from 1)
         */
        const rCurrentPage = currPage + 1

        if (nPages === 1 && rCurrentPage === 1) {
            setPrevPageBtnActive(false);
            setNextPageBtnActive(false);

            return;
        }

        if (nPages > 1 && rCurrentPage === 1) {
            setPrevPageBtnActive(false);
            setNextPageBtnActive(true);
        }

        if (nPages > 1 && rCurrentPage > 1) {
            setPrevPageBtnActive(true);

            if (nPages === rCurrentPage) {
                setNextPageBtnActive(false);
            } else {
                setNextPageBtnActive(true);
            }
        }
    }

    /**
     * On prev page button click
     */
    function onPrevPage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setCurrPage(currPage - 1)
    }

    /**
     * On next page button click
     */
    function onNextPage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setCurrPage(currPage + 1)
    }

    /**
     * Modal functions.
     */
    function onCloseImportModals(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        setShowImportModal(false);
    }

    /**
     * Get how many entries we have on current page.
     * 
     * The reference for this calculation is "currPage" variable.
     * 
     * So, in the "currPage" I want to know how many entries I have.
     */
    function getCurrPageEntriesNum(): number {
        // Define the limits of the entries (interval)
        const start = currPage * entriesPerPage;
        const end = start + entriesPerPage;

        /**
         * Get the entries withing the interval (entries in the current page).
         * 
         * So get an array with current entries on current interval (or current page of a range of elements).
         */
        const currentEntries = formEntries.slice(start, end);

        /**
         * Get the number of entries.
         */
        const entriesNum = currentEntries.length;

        // console.log('page ' + currPage + ', ', 'Total entries: ' + entriesNum);

        return entriesNum;
    }

    /**
     * Have we reached pagination limit?
     * 
     * Yes if current page entries is equal to entries per page limit.
     */
    function pageEntriesLimitReached(): boolean {
        return getCurrPageEntriesNum() === entriesPerPage;
    }

    /**
     * Have we reached the last element on current page?
     * 
     * Get entries per page number and if it is equal to 1 return true.
     * 
     * NOTE: This function calculates if we reached the last entry only on the current page (the selected one from the user).
     */
    function lastEntryCurrPageReached(): boolean {
        return getCurrPageEntriesNum() === 1;
    }

    /**
     * This function will tell us if the last page is full.
     * 
     * This function works with 'entriesPerPage' and length of 'formEntries'.
     * 
     * NOTE: the last page is not the current page. This function
     * will rely on a global calculation and not on 'currPage' variable.
     */
    function isLastPageFull(): boolean {
        const start = (nPages - 1) * entriesPerPage;
        const end = start + entriesPerPage;

        const lastPageEntries = formEntries.slice(start, end);

        return lastPageEntries.length === entriesPerPage;
    }

    // Render on error.
    if (onError) return <InitErrorMessage error={error}/>

    // Render the component.
    return (
        <>  
            {/** Main components */}
            <div className="wrap">
                <SettingsPageHeader />
                
                {
                    formEntries ? 
                    <TranslationsForm
                        ref={formRef}

                        formEntries={filterEntriesBySearch()}
                        metaData={metaData}

                        searchQuery={searchQuery}

                        entriesPerPage={entriesPerPage}
                        nPages={nPages}
                        currPage={currPage}
                        prevPageBtnActive={prevPageBtnActive}
                        nextPageBtnActive={nextPageBtnActive}

                        onFormSubmit={e => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}

                        onTranslationSearch={onTranslationSearch}
                        onSearchClear={onSearchClear}
                        onTranslationFormSubmit={onTranslationFormSubmit}
                        onTranslationFormAddRow={onTranslationFormAddRow}
                        onTranslationFormRemoveRow={onTranslationFormRemoveRow}
                        onInputChange={onInputChange}
                        onAutomaticTranslations={onAutomaticTranslations}
                        onDeleteAllTranslations={onDeleteAllTranslations}
                        onRegenerateDefaultTranslations={onRegenerateDefaultTranslations}
                        onExportTranslations={onExportTranslations}
                        onImportTranslations={onImportTranslations}

                        onPaginationEntriesPerPage={onPaginationEntriesPerPage}
                        onPageChange={onPageChange}

                        onPrevPage={onPrevPage}
                        onNextPage={onNextPage}

                        submitError={submitError}   
                        errorObject={submitError ? error.response.data : null}

                        submitSuccess={submitSuccess}

                        hasSearched={hasSearched}
                        submitLoading={submitLoading}
                        defaultRegeneration={defaultRegeneration}
                        entriesDeleting={entriesDeleting}
                        entriesImporting={entriesImporting}
                        entriesExporting={entriesExporting}

                        saved={saved}
                    />
                    :
                    <Spinner title="Caricamento in corso..."/>
                }

                <InfoText />
                <CreditsText />
            </div>

            {/** Trigger modals */}
            {   
                // Import modal
                showImportModal ?
                <Modal
                    title="Importa le tue traduzioni"
                    show={showImportModal}
                    onClose={onCloseImportModals}
                    children={importModalContent}
                />
                : null
            }

            {/** Toast messages */}
            {
                toast.message ? 
                <ToastNotice 
                    message={toast.message}
                    timeout={5000}
                    onToastClose={() => setToast({message: null, status: null})}    
                    status={toast.status}
                />
                : null
            }
        </>
    )
}

export default SettingsPage;