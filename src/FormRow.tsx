import { FormRowType } from "./@types/componentTypes";

const FormRow: React.FC<FormRowType> = ({
    index,
    entry,
    onInputChange,
    onRemoveRow
}) => {
    return (
        <tr id={String(entry.id)} key={entry.id} className={`translation-row row-${entry.id}`}>
            <td className='enum'>{index + 1}</td>
            <td>
                <input 
                    type="text" 
                    name="custom_text_setting" 
                    value={entry.english_string} 
                    onInput={e => onInputChange(e, entry.id, 'english_string')}
                    className="regular-text"
                />
            </td>
            <td>
                <input 
                    type="text" 
                    name="italian_translation_setting" 
                    value={entry.italian_translation_string}
                    onInput={e => onInputChange(e, entry.id, 'italian_translation_string')}
                    className="regular-text" 
                />
            </td>
            <td className='action'>
                <button 
                    className="button button-link-delete" 
                    onClick={e => onRemoveRow(e, entry.id)}
                    type="button" 
                >
                    <span className="dashicons dashicons-minus"></span>
                </button>
            </td>
        </tr>
    );
};

export default FormRow;