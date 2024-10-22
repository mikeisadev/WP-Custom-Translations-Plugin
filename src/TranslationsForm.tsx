import { forwardRef, useState, useEffect } from 'react';
import { TranslationsFormType, SingleTranslation } from './@types/componentTypes';
import { AdvicesText } from './AdvicesText';
import Spinner from './Spinner';
import { toTextDate } from './utils/date';
import FormRow from './FormRow';

const TranslationsForm = forwardRef<HTMLFormElement, TranslationsFormType>
(
    ({
        formEntries, 
        metaData,

        entriesPerPage,
        nPages,
        currPage,
        prevPageBtnActive,
        nextPageBtnActive,

        searchQuery,
        
        onFormSubmit,
        onTranslationSearch,
        onSearchClear,
        onTranslationFormSubmit, 
        onTranslationFormAddRow,
        onTranslationFormRemoveRow,
        onInputChange,
        onDeleteAllTranslations,
        onAutomaticTranslations,
        onRegenerateDefaultTranslations,
        onExportTranslations,
        onImportTranslations,

        onPaginationEntriesPerPage,
        onPageChange,

        onNextPage,
        onPrevPage,

        submitError,
        errorObject,
        
        submitSuccess,

        hasSearched,
        submitLoading,
        defaultRegeneration,
        entriesDeleting,
        entriesImporting,
        entriesExporting,
        
        saved
    }, formRef) => {

        const filteredEntries = formEntries.filter((entry: SingleTranslation, i) => {
            const q = searchQuery ? searchQuery.toLowerCase() : '';

            if (entry.english_string.toLowerCase().includes(q)) return true;
        });

        const paginationStart: number = currPage * entriesPerPage;
        const paginationEnd: number = paginationStart + entriesPerPage;

        return (
            <form ref={formRef} method="post" action="#" className='form-wrap' onSubmit={onFormSubmit}>
                <AdvicesText />

                <div className='ctp-separator' style={{margin: '10px 0'}}></div>

                <div className='meta-data'>
                    <p>Ultime traduzioni salvate: {toTextDate(metaData.published_on_date)}</p>
                </div>
        
                <div className='translations-form-tools'>
                    <div className='left-tools'>
                        <p>Strumenti rapidi</p>
        
                        <div className='buttons'>
                            { /** Translate automatically btn */ }
                            <button 
                                className='button button-primary' 
                                onClick={onAutomaticTranslations} 
                                type='button'
                            >
                                Traduci automaticamente
                            </button>

                            { /** Regenerate default btn */ }
                            <button 
                                className='button button-primary' 
                                onClick={onRegenerateDefaultTranslations}
                                disabled={defaultRegeneration}
                                type='button'
                            >
                                {defaultRegeneration ? <Spinner title='Rigenerazione in corso...' /> : 'Rigenera default'}
                            </button>
        
                            { /** Delete all button */ }
                            <button 
                                className='button button-red' 
                                onClick={onDeleteAllTranslations}
                                disabled={entriesDeleting}
                                type='button'
                            >
                                {entriesDeleting ? <Spinner title='Eliminazione in corso...' /> : 'Elimina tutto'}
                            </button>
                        </div>
                    </div>
        
                    <div className='right-tools'>
                        <p>Gestisci traduzioni</p>
        
                        <div className='buttons'>
                            { /** Export translations */ }
                            <button 
                                className='button button-primary' 
                                onClick={onExportTranslations}
                                disabled={entriesExporting} 
                                type='button'
                            >
                                {entriesExporting ? <Spinner title='Esportazione in corso...' /> : 'Esporta'}
                            </button>
        
                            { /** Import translations */ }
                            <button 
                                className='button button-primary' 
                                onClick={onImportTranslations}
                                disabled={entriesImporting}
                                type='button'
                            >
                                {entriesImporting ? <Spinner title='Importazione in corso...' /> : 'Importa'}
                            </button>
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

                <div className='search-box'>
                    <input 
                        type="text"
                        id="search-translations--input" 
                        className="regular-text search-translations-input"
                        name="search-translations" 
                        value={searchQuery}
                        onInput={onTranslationSearch}
                        placeholder='Cerca una stringa da tradurre...'
                    />
                    <button 
                        className='button button-primary' 
                        onClick={onSearchClear}
                        disabled={!hasSearched}
                        type='button'
                    >
                        Pulisci ricerca
                    </button>
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
                            filteredEntries.length > 0 ?
                            filteredEntries.map((entry: SingleTranslation, i:number) => {
                                if (entry && i >= paginationStart && i < paginationEnd) {
                                    // console.log(
                                    //     'start ' + paginationStart + ', ',
                                    //     'end ' + paginationEnd + ', ',
                                    //     'index ' + i
                                    // )

                                    return <FormRow
                                        key={i} 
                                        index={i}
                                        entry={entry}
                                        onInputChange={onInputChange}
                                        onRemoveRow={onTranslationFormRemoveRow}
                                    />
                                }
                            })
                            :
                            <div className='missing-translations'>
                                {
                                    hasSearched ? 
                                        <p>Nessun risultato di ricerca...</p>
                                        :
                                        <>
                                            <p>Non ci sono traduzioni da mostrare. Per iniziare:</p>
                                            <button className='button button-primary' onClick={onTranslationFormAddRow}>Aggiungi una traduzione</button>
                                        </>
                                }
                            </div>
                        }
                        <tfoot>
                            <div className='pagination-box'>
                                <div className='results'>
                                    <label htmlFor="translation-category">Risultati per pagina:</label>
                                    <select 
                                        id="translation-category" 
                                        name="translation-category" 
                                        className="postform"
                                        onChange={onPaginationEntriesPerPage}
                                        value={entriesPerPage}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>

                                <div className='pagination'>
                                    <button 
                                        type='button' 
                                        className='button button-secondary pag-back'
                                        disabled={!prevPageBtnActive}
                                        onClick={onPrevPage}
                                    >
                                        {'<'}
                                    </button>
                                    {
                                        nPages > 1 ?
                                        Array.from({length: nPages}, (_, p) => p+1).map((p, i) => {
                                            return <button 
                                            key={i} 
                                            type='button' 
                                            className={`button ${currPage === i ? 'button-primary' : 'button-secondary'}`}
                                            onClick={e => onPageChange(e, i)}
                                            >
                                                {p}
                                            </button>
                                        })
                                        :
                                        <button className="button button-secondary" type='button' disabled={true}>1</button>
                                    }
                                    <button 
                                        type='button' 
                                        className='button button-secondary pag-next'
                                        disabled={!nextPageBtnActive}
                                        onClick={onNextPage}
                                    >
                                        {'>'}
                                    </button>
                                </div>

                                <div className='tot-results'>
                                    <p>{hasSearched ? 'Risultati di ricerca: ' : 'Stringhe totali: '} {formEntries.length}</p>
                                </div>
                            </div>
                        </tfoot>
                    </tbody>
                </table>
        
                <div className='actions translations-actions'>
                    <button 
                        id='submit-translations' 
                        className='button button-primary relative-btn' 
                        role='submit'
                        type='button'
                        onClick={onTranslationFormSubmit}
                        disabled={submitLoading || saved}
                    >
                        {
                            submitLoading ?
                            <Spinner title='Salvataggio in corso...' />
                            : 
                            'Salva traduzioni'  
                        }
                    </button>
        
                    <button 
                        id='add-translation-row' 
                        className='button button-secondary' 
                        role='submit'
                        type='button'
                        onClick={onTranslationFormAddRow}
                    >
                        Aggiungi traduzione
                    </button>
                </div>
        
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