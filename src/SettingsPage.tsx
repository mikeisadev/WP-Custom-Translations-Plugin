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

const SettingsPage: React.FC = () => {
    /**
     * Variables to handle data and errors.
     */
    const [formEntries, setFormEntries] = useState(null);

    const [error, setError] = useState(null);
    const [onError, setOnError] = useState(false);

    const [submitError, setSubmitError] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [submitLoading, setSubmitLoading] = useState(false);

    /**
     * Modal states.
     * 
     * Import modal.
     */
    const [showImportModal, setShowImportModal] = useState(false);
    const [importModalContent, setImportModalContent] = useState(null);

    /**
     * References.
     */
    const formRef = useRef(null);

    /**
     * Get translations from the server.
     */
    useEffect(() => {
        setTimeout(
            () => {
                Http.get(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/translations')
                    .then((response) => {
                        setFormEntries(response.data);
                    })
                    .catch((error) => {
                        console.error(error);

                        setError(error);
                        setOnError(true);
                    });
            }, 
            1200
        )
    }, []);

    /**
     * On translations form submit.
     * 
     * @param e
     */
    function onTranslationFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

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
        
                        console.log(response);
        
                        if (data.status === 200 && data.status_message === 'OK') {
                            setSubmitSuccess(data.message);
        
                            setError(null);
                            setOnError(false);
                            setSubmitError(false);

                            setSubmitLoading(false);    
                        }
        
                    })
                    .catch((error) => {
                        console.error(error);
        
                        setError(error);    
                        setSubmitError(true);

                        setSubmitLoading(false);    
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

        if (formEntries.length === 0) {
            setFormEntries([
                {
                    english_string: 'Esempio: Stringa da tradurre',
                    italian_translation_string: 'Esempio: Traduzione'
                }
            ]);
        } else {
            setFormEntries([
                ...formEntries,
                {
                    english_string: 'Esempio: Stringa da tradurre',
                    italian_translation_string: 'Esempio: Traduzione'
                }
            ]);
        }
    }

    /**
     * On translations form remove row.
     * 
     * @param e 
     * @param index 
     */
    function onTranslationFormRemoveRow(e: React.MouseEvent<HTMLButtonElement>, index: number) {
        e.preventDefault();

        setFormEntries(formEntries.filter((entry, i) => i !== index));
    } 

    /**
     * On translation row input change.
     * 
     * @param e 
     * @param index 
     * @param key 
     */
    function onInputChange(e: React.FormEvent<HTMLInputElement>, index: number, key: string) {
        e.preventDefault();

        setFormEntries(formEntries.map((entry, i) => {
            if (i === index) {
                return {
                    ...entry,
                    [key]: e.currentTarget.value
                }
            }

            return entry;
        }));
    }

    /**
     * On Automatic translation.
     */
    function onAutomaticTranslations (e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        alert("Attenzione: questa funzione non è ancora disponibile. La sto sviluppando - Michele Mincone");
    }

    /**
     * Delete all translations.
     * 
     * @param e
     */
    function onDeleteAllTranslations(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!confirm("Sei sicuro di voler eliminare tutte le traduzioni?")) {
            return;
        }

        Http.delete(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/translations')
            .then(response => {
                console.log(response);

                // if ( setFormEntries(response.data.translations) ) {
                //     alert("Tutte le traduzioni sono state eliminate. Per favore, salva le impostazioni per confermare.");
                // }
            })
            .catch(error => {
                console.log(error)

                alert('Si è verificato un errore durante la cancellazione di tutte le traduzioni. Per favore, riprova più tardi. Se l\'errore persiste contattate lo sviluppatore del plugin.')
            });

    }

    /**
     * Tools.
     * 
     * Export translations
     */
    function onExportTranslations(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!confirm("Sei sicuro di voler esportare tutte le traduzioni? Le riceverai in formato JSON")) return;

        Http.post(ctpMetaData.restUrl + ctpMetaData.ctpNamespace + '/manage/export')
            .then(response => {
                const data = isJson(response.data) ? response.data : JSON.stringify(response.data);

                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'translations.json';
                a.click();

                URL.revokeObjectURL(url);
            })
            .catch(error => {    
                console.error(error);
            });
    }

    /**
     * Import translations.
     */
    function onImportTranslations(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        const formHtml = formRef.current
        const formImportInputField: HTMLInputElement = formHtml.querySelector('#import-translations-file')

        formImportInputField.value = ''

        if (!confirm("Sei sicuro di voler importare delle traduzioni? Se si, devono essere in formato JSON e devi averle precedentemente esportate da questo plugin.")) return;
        
        formImportInputField.click()

        formImportInputField.onchange = (event: Event) => {
            setImportModalContent(<Spinner title="Rilevamento del file in corso..."/>);
            setShowImportModal(true); // Show the modal

            const target = event.target as HTMLInputElement;

            if (target.files && target.files.length > 0) {
                setImportModalContent(<Spinner title="Caricamento in corso del file di traduzione JSON..."/>);

                const file = target.files[0];

                const formData = new FormData();
                formData.append('translations', file);

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
                            console.log(response)

                            setImportModalContent(<FeedbackText text="Caricamento del file avvenuto con successo!..." status="success"/>);

                            setFormEntries(response.data.translations);
                        })
                        .catch(error => {
                            console.log(error)

                            setImportModalContent(<FeedbackText text="Si è verificato un errore durante il caricamento del file!..." status="error"/>);
                        })
                }, 1200);
            }
        };
    }

    /**
     * Modal functions.
     */
    function onCloseImportModals(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setShowImportModal(false);
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
                        formEntries={formEntries}
                        onTranslationFormSubmit={onTranslationFormSubmit}
                        onTranslationFormAddRow={onTranslationFormAddRow}
                        onTranslationFormRemoveRow={onTranslationFormRemoveRow}
                        onInputChange={onInputChange}
                        onAutomaticTranslations={onAutomaticTranslations}
                        onDeleteAllTranslations={onDeleteAllTranslations}
                        onExportTranslations={onExportTranslations}
                        onImportTranslations={onImportTranslations}
                        submitError={submitError}   
                        errorObject={submitError ? error.response.data : null}
                        submitSuccess={submitSuccess}
                        submitLoading={submitLoading}
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
        </>
    )
}

export default SettingsPage;