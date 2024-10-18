/**
 * Translations form type interface.
 */
export interface TranslationsFormType {
    formEntries: {
        english_string: string;
        italian_translation_string: string;
    }[];
    onTranslationFormSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onTranslationFormAddRow: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onTranslationFormRemoveRow: (e: React.MouseEvent<HTMLButtonElement>, index: number) => void;
    onInputChange: (e: React.FormEvent<HTMLInputElement>, index: number, key: string) => void;
    onDeleteAllTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onAutomaticTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onExportTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onImportTranslations: (e: React.MouseEvent<HTMLButtonElement>) => void;
    submitError: boolean;
    errorObject: null | { message: any };
    submitSuccess: boolean | string;
    submitLoading: boolean;
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
}

/**
 * Feedback text interface
 */
export interface FeedbackTextType {
    text: string;
    status: 'success' | 'warning' | 'error' | 'info';
}