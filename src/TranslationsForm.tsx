import { forwardRef, useEffect } from 'react';
import { TranslationsFormType } from './@types/componentTypes';
import { AdvicesText } from './AdvicesText';

const TranslationsForm = forwardRef<HTMLFormElement, TranslationsFormType>
(
    ({
        formEntries, 
        onTranslationFormSubmit, 
        onTranslationFormAddRow,
        onTranslationFormRemoveRow,
        onInputChange,
        onDeleteAllTranslations,
        onAutomaticTranslations,
        onExportTranslations,
        onImportTranslations,
        submitError,
        errorObject,
        submitSuccess,
        submitLoading
    }, formRef) => {

        return (
            <form ref={formRef} method="post" action="" className='form-wrap'>
                <AdvicesText />
        
                <div className='translations-form-tools'>
                    <div className='left-tools'>
                        <p>Strumenti rapidi</p>
        
                        <div className='buttons'>
                            { /** Translate automatically btn */ }
                            <button className='button button-primary' onClick={onAutomaticTranslations}>Traduci automaticamente</button>
        
                            { /** Delete all button */ }
                            <button className='button button-red' onClick={onDeleteAllTranslations}>Elimina tutto</button>
                        </div>
                    </div>
        
                    <div className='right-tools'>
                        <p>Gestisci traduzioni</p>
        
                        <div className='buttons'>
                            { /** Export translations */ }
                            <button className='button button-primary' onClick={onExportTranslations}>Esporta</button>
        
                            { /** Import translations */ }
                            <button className='button button-primary' onClick={onImportTranslations}>Importa</button>
                            <input 
                                id="import-translations-file" 
                                type='file' 
                                name="import-translations-file" 
                                className='hidden' 
                                accept="application/json"
                            />
                        </div>
                    </div>
                </div>
        
                <table className="form-table">
                    <thead>
                        <tr>
                            <th className='enumerations'>N.</th>
                            <th>Stringa da tradurre</th>
                            <th>Traduzione in Italiano</th>
                            <th className='actions'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            formEntries.length !== 0 ?
                            formEntries.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='enum'>{index + 1}</td>
                                        <td>
                                            <input 
                                                type="text" 
                                                name="custom_text_setting" 
                                                value={entry.english_string} 
                                                onInput={(e) => onInputChange(e, index, 'english_string')}
                                                className="regular-text"
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                name="italian_translation_setting" 
                                                value={entry.italian_translation_string}
                                                onInput={(e) => onInputChange(e, index, 'italian_translation_string')}
                                                className="regular-text" 
                                            />
                                        </td>
                                        <td className='action'>
                                            <button 
                                                type="button" 
                                                className="button button-link-delete" 
                                                onClick={(e) => onTranslationFormRemoveRow(e, index)}
                                            >
                                                <span className="dashicons dashicons-minus"></span>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <div className='missing-translations'>
                                <p>Non ci sono traduzioni da mostrare. Per iniziare:</p>
                                <button className='button button-primary' onClick={onTranslationFormAddRow}>Aggiungi una traduzione</button>
                            </div>
                        }
                    </tbody>
                </table>
        
                <div className='actions translations-actions'>
                    <button 
                        id='submit-translations' 
                        className='button button-primary' 
                        role='submit'
                        onClick={onTranslationFormSubmit}
                    >
                            Salva impostazioni
                    </button>
        
                    <button 
                        id='add-translation-row' 
                        className='button button-secondary' 
                        role='submit'
                        onClick={onTranslationFormAddRow}
                    >
                        Aggiungi riga di traduzione
                    </button>
                </div>
        
                {
                    submitLoading ?
                        <div className="spinner-box">
                            <div className="spinner is-active"></div> 
                            <p>Caricamento in corso...</p>
                        </div>
                    : 
                    null  
                }
        
                {
                    submitError ? 
                        <div className="wrap">   
                            <div className="error">
                                <p>Si è verificato un errore durante il salvataggio delle traduzioni.</p>
                                <p><p>Tipo di messaggio di errore: <em>{errorObject.message}</em></p></p>
                            </div>
                        </div>
                        : null
                }
        
                {
                    submitSuccess ? 
                        <div className="wrap">   
                            <div className="notice notice-success is-dismissible">
                                <p>{submitSuccess}</p>
                            </div>
                        </div>
                    : null
                }
            </form>
        );
    }
);

export default TranslationsForm;