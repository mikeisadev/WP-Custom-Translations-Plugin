/**
 * Translations form type interface.
 * 
 * TranslationsObject -> an array of single translations.
 */
export type TranslationsObject = SingleTranslation[];

/**
 * Single translation object structure.
 */
export type SingleTranslation = {
    id: number | string;
    english_string: string;
    italian_translation_string: string;
}

/**
 * Structure of meta data object.
 */
export type MetaDataObject = {
    published_on_date: string;
    unique_id: string;
    timestamp: string | number;
    id_type: 'uint' | 'uuid';
    translations_origin: string;
    uuid: string;
    added_from_user_id: number;
    added_from_user_privileges: string[] | string;
}

/**
 * Translation form interface type.
 */
export interface TranslationsFormType {
    // Data.
    formEntries: TranslationsObject;
    metaData: MetaDataObject;

    // Search query
    searchQuery: string;

    // Pagination
    entriesPerPage: number;
    nPages: number;
    currPage: number;
    prevPageBtnActive: boolean;
    nextPageBtnActive: boolean;

    // On form submit
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    // Functions
    onTranslationSearch: (e: React.FormEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement> ) => void;
    onSearchClear: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onTranslationFormSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onTranslationFormAddRow: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onTranslationFormRemoveRow: (e: React.MouseEvent<HTMLButtonElement>, id: number | string) => void;
    onInputChange: (e: React.FormEvent<HTMLInputElement>, id: number | string, key: string) => void;
    onDeleteAllTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onAutomaticTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onRegenerateDefaultTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onExportTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onImportTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;

    onPaginationEntriesPerPage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPageChange: (e: React.MouseEvent<HTMLButtonElement>, pageNum: number) => void;

    onPrevPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onNextPage: (e: React.MouseEvent<HTMLButtonElement>) => void;

    // Error states
    submitError: boolean;
    errorObject: null | { message: any };

    // Success states
    submitSuccess: boolean | string;
    
    // Loading states
    hasSearched: boolean;
    submitLoading: boolean;
    defaultRegeneration: boolean;
    entriesDeleting: boolean;
    entriesImporting: boolean;
    entriesExporting: boolean;

    // Saved state
    saved: boolean;
}

/**
 * Form row type interface.
 */
export interface FormRowType {
    index: number;
    entry: SingleTranslation;
    onInputChange: (e: React.FormEvent<HTMLInputElement>, id: number | string, key: string) => void;
    onRemoveRow: (e: React.MouseEvent<HTMLButtonElement>, id: number | string) => void;
}

/**
 * Init error message type interface.
 */
export interface InitErrorMessageType {
    error: any
}

/**
 * Interface for the modal.
 */
export interface ModalType {
    title: string;
    show: boolean;
    onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode
}

/**
 * Spinner interface
 */
export interface SpinnerType {
    title: string;
    classes?: string;
}

/**
 * Feedback text interface
 */
export interface FeedbackTextType {
    text: string;
    status: 'success' | 'warning' | 'error' | 'info';
}

/**
 * Toast message interface
 */
export interface ToastMessageType {
    message: string;
    timeout: number;
    onToastClose: () => void;
    status: 'success' | 'warning' | 'error' | 'info';
}