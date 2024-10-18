import { InitErrorMessageType } from "./@types/componentTypes";
import { CreditsText } from "./CreditsText";

const InitErrorMessage: React.FC<InitErrorMessageType> = ({ error }) => {
    return (
        <div className="wrap">
            <div className="wrap notice notice-error">
                <h1>Errore durante il caricamento delle traduzioni personalizzate</h1>
                <p style={{marginBottom: 10}}>Si è verificato un errore durante il caricamento delle traduzioni personalizzate. Per favore, riprova più tardi.</p>

                <p>Tipo di messaggio di errore: <em>{error.response.data.message}</em></p>
            </div>

            <CreditsText />
        </div>
    );
};

export default InitErrorMessage;